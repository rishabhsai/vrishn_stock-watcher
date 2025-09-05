export const load = async ({ locals, params }) => {
  const getBusinessMetrics = async () => {
    const { apiURL, apiKey } = locals;

    const postData = {
      ticker: params.tickerID,
    };

    const response = await fetch(apiURL + "/business-metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
    });

    const output = await response.json();

    // Replace "/" with "-" in all names arrays
    const replaceSlashes = (arr) =>
      arr?.map((s) => s?.replace(/\//g, "-"));

    if (output.revenue?.names) {
      output.revenue.names = replaceSlashes(output.revenue.names);
    }

    if (output.geographic?.names) {
      output.geographic.names = replaceSlashes(output.geographic.names);
    }

    if (output.operatingExpenses?.names) {
      output.operatingExpenses.names = replaceSlashes(output.operatingExpenses.names);
    }

    return output;
  };

  return {
    getBusinessMetrics: await getBusinessMetrics(),
  };
};
