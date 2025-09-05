export const load = async ({ locals, params }) => {
  const { apiKey, apiURL } = locals;
  const { tickerID } = params;

  const urlQuote   = `${apiURL}/stock-quote`;
  const urlMaxPain = `${apiURL}/max-pain`;
  const headers = {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
  };
  const body = JSON.stringify({ ticker: tickerID });

  // Kick off both requests in parallel
  const [quoteRes, maxPainRes] = await Promise.all([
    fetch(urlQuote,   { method: "POST", headers, body }),
    fetch(urlMaxPain, { method: "POST", headers, body }),
  ]);

  // Parse both JSON bodies in parallel
  const [quoteJson, maxPainData] = await Promise.all([
    quoteRes.json(),
    maxPainRes.json(),
  ]);

  const currentPrice = quoteJson?.price ?? 0;

  // Compute changes
  const output = (maxPainData || []).map(item => ({
    ...item,
    change:          item.maxPain - currentPrice,
    changesPercentage: currentPrice
      ? (item.maxPain / currentPrice - 1) * 100
      : 0,
  }));

  return { getData: output };
};
