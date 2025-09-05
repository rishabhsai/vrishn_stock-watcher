<script lang="ts">
  import { formatDate } from "$lib/utils";
  import HoverStockChart from "$lib/components/HoverStockChart.svelte";
  import { onMount } from "svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import SEO from "$lib/components/SEO.svelte";
  import Infobox from "$lib/components/Infobox.svelte";

  export let data;
  export let form;

  let rawData = data?.getNotifications;
  let notificationList = rawData?.slice(0, 20);

  async function handleScroll() {
    const scrollThreshold = document.body.offsetHeight * 0.8; // 80% of the website height
    const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
    if (isBottom && notificationList?.length !== rawData?.length) {
      const nextIndex = notificationList?.length;
      const filteredNewResults = rawData?.slice(nextIndex, nextIndex + 25);
      notificationList = [...notificationList, ...filteredNewResults];
    }
  }

  async function updateNotifications() {
    let notificationIdList = [];

    for (let i = 0; i < notificationList?.length; i++) {
      if (notificationList[i]?.readed == false) {
        notificationIdList?.push(notificationList[i]?.id);
      }
    }

    if (notificationIdList.length !== 0) {
      const postData = {
        unreadList: notificationIdList,
      };

      await fetch("/api/update-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      $numberOfUnreadNotification = 0;
    }
  }

  onMount(async () => {
    await updateNotifications();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<SEO
  title="Stock Market Notifications | Real-Time Updates & Alerts"
  description="Stay informed with real-time stock market notifications. Get instant alerts on price changes, trends, and market movements to make smarter investment decisions."
/>

<section
  class="w-full max-w-3xl sm:max-w-[1400px] overflow-hidden min-h-screen pb-20 pt-5 px-4 lg:px-3 text-muted dark:text-white"
>
  <div class="text-sm sm:text-[1rem] breadcrumbs">
    <ul>
      <li><a href="/" class="text-muted dark:text-gray-300">Home</a></li>
      <li class="text-muted dark:text-gray-300">Notifications</li>
    </ul>
  </div>

  <div class="w-full overflow-hidden m-auto mt-5">
    <div class="sm:p-0 flex justify-center w-full m-auto overflow-hidden">
      <div
        class="relative flex justify-center items-start overflow-hidden w-full"
      >
        <main class="w-full lg:w-3/4 lg:pr-10">
          <div class="mb-3 border-[#2C6288] dark:border-white border-b-[2px]">
            <h1 class="mb-1 text-2xl sm:text-3xl font-bold">Notification</h1>
          </div>

          <div class="mb-4">
            <Infobox
              text="Personalize your notifications on your account page."
            />
          </div>

          {#if notificationList?.length !== 0}
            <div class="flex flex-col items-start w-full">
              {#each notificationList as item}
                {#if item?.notifyType === "priceAlert"}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    class="border-b border-gray-300 dark:border-gray-800 pb-3 sm:p-3 mb-6 sm:mb-3 w-full {!item?.readed
                      ? 'bg-blue-100 dark:bg-[#F9AB00]/10'
                      : ''} "
                  >
                    <div class="flex flex-row items-center w-full">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <a
                        class="avatar w-8 h-8 shrink-0 mr-4 bg-gray-200 dark:bg-gray-800 rounded-full"
                      >
                        <img
                          style="clip-path: circle(50%);"
                          class="shrink-0 w-8 h-8 rounded-full inline-block p-1"
                          src={`https://financialmodelingprep.com/image-stock/${item?.liveResults?.symbol}.png`}
                          alt="Company Logo"
                        />
                      </a>

                      <div class=" text-sm sm:text-[1rem]">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <div class="flex flex-col items-start">
                          <div>
                            <div class="flex flex-col items-start">
                              <div class="text-md mt-0.5">
                                Price Alert triggered for <HoverStockChart
                                  symbol={item?.liveResults?.symbol}
                                  assetType={item?.liveResults?.assetType}
                                />
                              </div>
                              <div class="text-md mt-0.5">
                                The price of <span class="font-semibold"
                                  >{item?.liveResults?.currentPrice}</span
                                >
                                is {item?.liveResults?.condition} your target of
                                <span class="font-semibold"
                                  >{item?.liveResults?.targetPrice}</span
                                >
                              </div>
                            </div>
                          </div>
                          <span class="text-sm mt-1 text-[#A6ADBB0"
                            >{formatDate(item?.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                {:else if item?.notifyType === "wiim"}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    class="border-b border-gray-300 dark:border-gray-800 pb-3 sm:p-3 mb-6 sm:mb-3 w-full {!item?.readed
                      ? 'bg-blue-100 dark:bg-[#F9AB00]/10'
                      : ''} "
                  >
                    <div class="flex flex-row items-center w-full">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <a
                        class="avatar w-8 h-8 shrink-0 mr-4 bg-gray-200 dark:bg-gray-800 rounded-full"
                      >
                        <img
                          style="clip-path: circle(50%);"
                          class="shrink-0 w-8 h-8 rounded-full inline-block p-1"
                          src={`https://financialmodelingprep.com/image-stock/${item?.liveResults?.symbol}.png`}
                          alt="Company Logo"
                        />
                      </a>

                      <div class=" text-sm sm:text-[1rem]">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <div class="flex flex-col items-start">
                          <div>
                            <div class="flex flex-col items-start">
                              <div class="text-md mt-0.5">
                                <span class="font-semibold"
                                  >BREAKING News for</span
                                >
                                <HoverStockChart
                                  symbol={item?.liveResults?.symbol}
                                  assetType={item?.liveResults?.assetType}
                                />
                              </div>
                              <div class="text-md mt-0.5">
                                New data for "Why Price Moved" event is out.
                              </div>
                            </div>
                          </div>
                          <span class="text-sm mt-1 text-[#A6ADBB0"
                            >{formatDate(item?.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                {:else if item?.notifyType === "topAnalyst"}
                  <div
                    class="border-b border-gray-300 dark:border-gray-800 pb-3 sm:p-3 mb-6 sm:mb-3 w-full {!item?.readed
                      ? 'bg-blue-100 dark:bg-[#F9AB00]/10'
                      : ''} "
                  >
                    <div class="flex flex-row items-center w-full">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <a
                        class="avatar w-8 h-8 shrink-0 mr-4 bg-gray-200 dark:bg-gray-800 rounded-full"
                      >
                        <img
                          style="clip-path: circle(50%);"
                          class="shrink-0 w-8 h-8 rounded-full inline-block p-1"
                          src={`https://financialmodelingprep.com/image-stock/${item?.liveResults?.symbol}.png`}
                          alt="Company Logo"
                        />
                      </a>

                      <div class=" text-sm sm:text-[1rem]">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <div class="flex flex-col items-start">
                          <div>
                            <div class="flex flex-col items-start">
                              <div class="text-md mt-0.5">
                                <span class="font-semibold"
                                  >New Top Analyst Rating for</span
                                >
                                <HoverStockChart
                                  symbol={item?.liveResults?.symbol}
                                  assetType={item?.liveResults?.assetType}
                                  link="forecast/analyst"
                                />
                              </div>
                              <div class="text-md mt-0.5">
                                The rating company {item?.liveResults?.analyst} has
                                issued a new rating of „{item?.liveResults
                                  ?.rating_current}“ with an updated price
                                target of ${item?.liveResults
                                  ?.adjusted_pt_current}.
                              </div>
                            </div>
                          </div>
                          <span class="text-sm mt-1 text-[#A6ADBB0"
                            >{formatDate(item?.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                {:else if item?.notifyType === "earningsSurprise"}
                  <div
                    class="border-b border-gray-300 dark:border-gray-800 pb-3 sm:p-3 mb-6 sm:mb-3 w-full {!item?.readed
                      ? 'bg-blue-100 dark:bg-[#F9AB00]/10'
                      : ''} "
                  >
                    <div class="flex flex-row items-center w-full">
                      <!-- svelte-ignore a11y-label-has-associated-control -->
                      <a
                        class="avatar w-8 h-8 shrink-0 mr-4 bg-gray-200 dark:bg-gray-800 rounded-full"
                      >
                        <img
                          style="clip-path: circle(50%);"
                          class="shrink-0 w-8 h-8 rounded-full inline-block p-1"
                          src={`https://financialmodelingprep.com/image-stock/${item?.liveResults?.symbol}.png`}
                          alt="Company Logo"
                        />
                      </a>

                      <div class=" text-sm sm:text-[1rem]">
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <div class="flex flex-col items-start">
                          <div>
                            <div class="flex flex-col items-start">
                              <div class="text-md mt-0.5">
                                <span class="font-semibold"
                                  >Earnings Release for</span
                                >
                                <HoverStockChart
                                  symbol={item?.liveResults?.symbol}
                                  assetType={item?.liveResults?.assetType}
                                />
                              </div>
                              <div class="text-md mt-0.5">
                                New data for "Earnings Surprise" event is out.
                              </div>
                            </div>
                          </div>
                          <span class="text-sm mt-1 text-[#A6ADBB0"
                            >{formatDate(item?.created)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        </main>

        <aside class="hidden lg:block relative fixed w-1/4 ml-4">
          <div
            class="w-full border border-gray-300 dark:border-gray-600 rounded h-fit pb-4 mt-4 cursor-pointer sm:hover:shadow-lg dark:sm:hover:bg-secondary transition ease-out duration-100"
          >
            <a
              href="/watchlist/stocks"
              class="w-auto lg:w-full p-1 flex flex-col m-auto px-2 sm:px-0"
            >
              <div class="w-full flex justify-between items-center p-3 mt-3">
                <h2 class="text-start text-xl font-bold ml-3">Watchlist</h2>
              </div>
              <span class=" p-3 ml-3 mr-3">
                Get realtime updates of your favorite stocks
              </span>
            </a>
          </div>

          <div
            class="w-full border border-gray-300 dark:border-gray-600 rounded h-fit pb-4 mt-4 cursor-pointer sm:hover:shadow-lg dark:sm:hover:bg-secondary transition ease-out duration-100"
          >
            <a
              href="/market-mover/gainers"
              class="w-auto lg:w-full p-1 flex flex-col m-auto px-2 sm:px-0"
            >
              <div class="w-full flex justify-between items-center p-3 mt-3">
                <h2 class="text-start text-xl font-bold ml-3">Market Movers</h2>
              </div>
              <span class="p-3 ml-3 mr-3">
                Today's Top Stock Gainers, Losers and most Active
              </span>
            </a>
          </div>
        </aside>
      </div>
    </div>
  </div>
</section>
