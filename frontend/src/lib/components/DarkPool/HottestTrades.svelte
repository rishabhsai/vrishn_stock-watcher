<script lang="ts">
  import InfoModal from "$lib/components/InfoModal.svelte";
  import TableHeader from "$lib/components/Table/TableHeader.svelte";

  import { abbreviateNumber } from "$lib/utils";

  export let data;
  export let rawData = [];
  export let ticker;

  let stockList = rawData || [];

  function formatToNewYorkTime(isoString) {
    const date = new Date(isoString);

    // Get the date components in New York time zone
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "America/New_York", // Correct IANA time zone
      hour12: true, // Enable AM/PM format
    };

    // Format date for New York timezone
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);

    const year = parts.find((p) => p.type === "year").value;
    const month = parts.find((p) => p.type === "month").value;
    const day = parts.find((p) => p.type === "day").value;
    const hour = parts.find((p) => p.type === "hour").value.padStart(2, "0");
    const minute = parts
      ?.find((p) => p.type === "minute")
      ?.value.padStart(2, "0");

    const ampm = parts.find((p) => p.type === "dayPeriod").value; // AM/PM

    return `${month}/${day}/${year} ${hour}:${minute} ${ampm}`;
  }

  $: columns = [
    { key: "rank", label: "Rank", align: "left" },
    { key: "date", label: "Time", align: "left" },
    { key: "price", label: "Price", align: "right" },
    { key: "size", label: "Size", align: "right" },
    { key: "volume", label: "Volume", align: "right" },
    { key: "sizeVolRatio", label: "Size / Vol", align: "right" },
    { key: "sizeAvgVolRatio", label: "Size / Avg Vol", align: "right" },
    { key: "premium", label: "Avg. Paid", align: "right" },
  ];
  $: sortOrders = {
    rank: { order: "none", type: "number" },
    date: { order: "none", type: "date" },
    price: { order: "none", type: "number" },
    size: { order: "none", type: "number" },
    volume: { order: "none", type: "number" },
    sizeVolRatio: { order: "none", type: "number" },
    sizeAvgVolRatio: { order: "none", type: "number" },
    premium: { order: "none", type: "number" },
  };

  const sortData = (key) => {
    // Reset all other keys to 'none' except the current key
    for (const k in sortOrders) {
      if (k !== key) {
        sortOrders[k].order = "none";
      }
    }

    // Cycle through 'none', 'asc', 'desc' for the clicked key
    const orderCycle = ["none", "asc", "desc"];
    let originalData = rawData;

    const currentOrderIndex = orderCycle.indexOf(sortOrders[key].order);
    sortOrders[key].order =
      orderCycle[(currentOrderIndex + 1) % orderCycle.length];
    const sortOrder = sortOrders[key].order;

    // Reset to original data when 'none' and stop further sorting
    if (sortOrder === "none") {
      stockList = originalData?.slice(0, 50); // Reset displayed data
      return;
    }

    // Define a generic comparison function
    const compareValues = (a, b) => {
      const { type } = sortOrders[key];
      let valueA, valueB;

      switch (type) {
        case "date":
          valueA = new Date(a[key]);
          valueB = new Date(b[key]);
          break;
        case "string":
          valueA = a[key].toUpperCase();
          valueB = b[key].toUpperCase();
          return sortOrder === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        case "number":
        default:
          valueA = parseFloat(a[key]);
          valueB = parseFloat(b[key]);
          break;
      }

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    };

    // Sort using the generic comparison function
    stockList = [...originalData].sort(compareValues)?.slice(0, 50);
  };
</script>

<section class="overflow-hidden h-full pb-8">
  <main class="overflow-hidden">
    <div class="flex flex-row items-center">
      <label
        for="hottestDPTrade"
        class="mr-1 cursor-pointer flex flex-row items-center text-xl sm:text-2xl font-bold"
      >
        Hottest Trades
      </label>
      <InfoModal
        title={"Hottest Trades"}
        content={"Real-time hottest trades highlight significant premium flows, revealing where big players are active and hinting at market trends or sentiment."}
        id={"hottestDPTrade"}
      />
    </div>

    {#if rawData?.length !== 0}
      <div class="w-full flex flex-col items-start sm:mt-3 mb-3">
        <div
          class="flex flex-row items-end justify-between w-full mt-2 sm:mt-0 mb-2"
        >
          <p class="text-[1rem]">
            Real-time institutional trades ranked by premium paid and size
            relative to average volume.
            <strong>High premiums</strong> indicate urgent positioning by large
            players, while elevated
            <strong>size-to-volume ratios</strong> reveal unusual institutional activity
            that often precedes significant price movements.
          </p>
        </div>
      </div>

      <div class="w-full m-auto rounded-none sm:rounded mb-4 overflow-x-auto">
        <table
          class="table table-sm table-compact no-scrollbar rounded-none sm:rounded w-full border border-gray-300 dark:border-gray-800 m-auto"
        >
          <thead>
            <TableHeader {columns} {sortOrders} {sortData} />
          </thead>
          <tbody>
            {#each stockList as item, index}
              <tr
                class="dark:sm:hover:bg-[#245073]/10 odd:bg-[#F6F7F8] dark:odd:bg-odd {index +
                  1 ===
                  rawData?.length && !['Pro']?.includes(data?.user?.tier)
                  ? 'opacity-[0.1]'
                  : ''}"
              >
                <td class="text-start text-sm sm:text-[1rem] whitespace-nowrap">
                  {item?.rank}
                </td>

                <td class="text-start text-sm sm:text-[1rem] whitespace-nowrap">
                  {formatToNewYorkTime(item?.date)}
                </td>

                <td class="text-end text-sm sm:text-[1rem] whitespace-nowrap">
                  {item?.price}
                </td>

                <td class="text-sm sm:text-[1rem] text-end">
                  {item?.size?.toLocaleString("en-US")}
                </td>

                <td class="text-sm sm:text-[1rem] text-end">
                  {item?.volume?.toLocaleString("en-US")}
                </td>

                <td class="text-sm sm:text-[1rem] text-end">
                  {item?.sizeVolRatio?.toFixed(2)}%
                </td>
                <td class="text-sm sm:text-[1rem] text-end">
                  {item?.sizeAvgVolRatio?.toFixed(2)}%
                </td>

                <td class="text-sm sm:text-[1rem] text-end">
                  {abbreviateNumber(item?.premium)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </main>
</section>
