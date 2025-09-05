// --- hoisted once, not on every sortData call ---
const orderCycle = ["none", "asc", "desc"] as const;

const valueGetters: Record<
  keyof typeof sortOrders,
  (item: any) => number | string
> = {
  time:    (i) => new Date(`1970-01-01T${i.time}`).getTime(),
  ticker:  (i) => i.ticker,
  expiry:  (i) => new Date(i.date_expiration).getTime(),
  dte:     (i) => new Date(i.date_expiration).getTime(),
  roi:     (i) => parseFloat(i.roi),
  strike:  (i) => parseFloat(i.strike_price),
  spot:    (i) => parseFloat(i.underlying_price),
  price:   (i) => parseFloat(i.price),
  premium: (i) => parseFloat(i.cost_basis),
  size:    (i) => parseFloat(i.size),
  vol:     (i) => parseFloat(i.volume),
  oi:      (i) => parseFloat(i.open_interest),
  callPut: (i) => i.put_call ?? "",
  sentiment: (i) => {
    const rank = { BULLISH: 1, NEUTRAL: 2, BEARISH: 3 };
    return rank[i.sentiment?.toUpperCase()] ?? 4;
  },
  type: (i) => {
    const rank = { SWEEP: 1, TRADE: 2 };
    return rank[i.option_activity_type?.toUpperCase()] ?? 3;
  },
  exec: (i) => i.execution_estimate ?? "",
};

function sortData(
  rawData: any[],
  filteredData: any[] = [],
  sortOrders: Record<string, "none" | "asc" | "desc">
): any[] {
  // 1) find the active key
  const key = Object.keys(sortOrders).find(k => sortOrders[k] !== "none");
  if (!key) return filteredData.length ? filteredData : rawData;

  // 2) cycle just that key, reset all others
  sortOrders[key] = orderCycle[
    (orderCycle.indexOf(sortOrders[key]) + 1) % orderCycle.length
  ];
  for (const k in sortOrders) {
    if (k !== key) sortOrders[k] = "none";
  }

  const order = sortOrders[key];
  if (order === "none") return filteredData.length ? filteredData : rawData;

  // 3) slice to avoid mutating original
  const data = (filteredData.length ? filteredData : rawData).slice();

  // 4) build a mapped array of { item, value }
  const getter = valueGetters[key as keyof typeof valueGetters];
  const mapped = data.map(item => ({ item, value: getter(item) }));
  const factor = order === "asc" ? 1 : -1;

  // 5) one cheap compare per element-pair
  mapped.sort((a, b) => {
    const va = a.value, vb = b.value;
    if (typeof va === "string" && typeof vb === "string") {
      return factor * va.localeCompare(vb);
    }
    return factor * (Number(va) - Number(vb));
  });

  // 6) unwrap
  return mapped.map(x => x.item);
}




// Web Worker message handler remains the same
onmessage = async (event: MessageEvent) => {
  const { rawData, filteredData, sortOrders } = event.data || {};
  // Filter the data
  let sortedData = sortData(rawData, filteredData, sortOrders);
    console.log('yefafasdf')
  postMessage({ message: "success", sortedData });
};

export {};