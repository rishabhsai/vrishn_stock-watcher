<script lang="ts">
  import { displayCompanyName, stockTicker } from "$lib/store";
  import { removeCompanyStrings } from "$lib/utils";
  import Infobox from "$lib/components/Infobox.svelte";
  import SEO from "$lib/components/SEO.svelte";
  import MetricTable from "$lib/components/Table/MetricTable.svelte";

  export let data;

  let names;

  let subsectionTitles = [];

  let dataset;
  let geographicDataset;
  let operatingExpensesDataset;

  let revenueNames;
  let geographicNames;
  let operatingExpensesNames;

  let xData;
  let geographicXData;
  let operatingExpensesXData;

  let categoryValues;
  let geographiCategoryValues;
  let operatingExpensesCategoryValues;

  let growthValues;
  let geographicGrowthValues;
  let operatingExpensesGrowthValues;

  $: {
    if ($stockTicker) {
      names = data?.getBusinessMetrics?.revenue?.names || [];
      subsectionTitles = ["Overview", ...names];

      dataset = data?.getBusinessMetrics?.revenue?.history || [];
      geographicDataset = data?.getBusinessMetrics?.geographic?.history || [];
      operatingExpensesDataset =
        data?.getBusinessMetrics?.operatingExpenses?.history || [];

      revenueNames = data?.getBusinessMetrics?.revenue?.names || [];
      geographicNames = data?.getBusinessMetrics?.geographic?.names || [];
      operatingExpensesNames =
        data?.getBusinessMetrics?.operatingExpenses?.names || [];

      xData = dataset?.map((item) => item?.date);
      geographicXData = geographicDataset?.map((item) => item?.date);
      operatingExpensesXData = operatingExpensesDataset?.map(
        (item) => item?.date,
      );

      categoryValues = revenueNames?.map((_, index) =>
        dataset?.map((item) => item.value[index]),
      );
      geographiCategoryValues = geographicNames?.map((_, index) =>
        geographicDataset?.map((item) => item.value[index]),
      );
      operatingExpensesCategoryValues = operatingExpensesNames?.map(
        (_, index) =>
          operatingExpensesDataset?.map((item) => item.value[index]),
      );

      growthValues = revenueNames?.map((_, index) =>
        dataset?.map((item) => item.valueGrowth[index]),
      );
      geographicGrowthValues = geographicNames?.map((_, index) =>
        geographicDataset?.map((item) => item.valueGrowth[index]),
      );
      operatingExpensesGrowthValues = operatingExpensesNames?.map((_, index) =>
        operatingExpensesDataset?.map((item) => item.valueGrowth[index]),
      );
    }
  }
</script>

<SEO
  title={`${$displayCompanyName} (${$stockTicker}) Business Metric Overview`}
  description={`View unique business metrics for ${displayCompanyName} (${$stockTicker}) stock, including revenue breakdown, operating income, revenue by geography.`}
/>

<section class=" overflow-hidden min-h-screen w-full">
  <div class="flex justify-center m-auto h-full overflow-hidden w-full">
    <div
      class="relative flex justify-center items-center overflow-hidden w-full"
    >
      <div class="sm:pl-7 sm:pb-7 w-full m-auto mt-2 sm:mt-0">
        {#if revenueNames?.length !== 0 || geographicNames?.length !== 0}
          {#if revenueNames?.length}
            <MetricTable
              title="{removeCompanyStrings(
                $displayCompanyName,
              )} Revenue Breakdown"
              dateData={xData}
              names={revenueNames}
              {categoryValues}
              {growthValues}
              href={true}
            />
          {/if}

          {#if geographicNames?.length}
            <MetricTable
              title="Revenue by Geography"
              dateData={geographicXData}
              names={geographicNames}
              categoryValues={geographiCategoryValues}
              growthValues={geographicGrowthValues}
              href={false}
            />
          {/if}

          {#if operatingExpensesNames?.length}
            <MetricTable
              title="Operating Expense Breakdown"
              dateData={operatingExpensesXData}
              names={operatingExpensesNames}
              categoryValues={operatingExpensesCategoryValues}
              growthValues={operatingExpensesGrowthValues}
              href={false}
            />
          {/if}
        {:else}
          <Infobox
            text={`Currently, there are no business metrics available for ${removeCompanyStrings($displayCompanyName)}.`}
          />
        {/if}
      </div>
    </div>
  </div>
</section>
