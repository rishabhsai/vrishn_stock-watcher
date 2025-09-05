export const load = async ({ locals, cookies }) => {
  const { apiURL, apiKey, pb, user } = locals;

  const getOptionsFlowFeed = async () => {
    // make the POST request to the endpoint
    const postData = {'orderList': []}
    const response = await fetch(apiURL + "/options-flow-feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
    });
    let output = await response.json();
    output = user?.tier !== "Pro" ? output?.slice(0, 6) : output;

    return output;
  };

  const getPredefinedCookieRuleOfList = async () => {
    // make the POST request to the endpoint
    const ruleOfList = cookies.get("options-flow-filter-cookie") ?? [];
    const output =
      ruleOfList?.length !== 0
        ? JSON.parse(ruleOfList)
        : [
            { name: "cost_basis", value: "any" },
            { name: "date_expiration", value: "any" },
          ];

    return output;
  };

  const getOptionsWatchlist = async () => {
    let output;
    try {
      output = (
        await pb?.collection("optionsWatchlist").getFullList({
          filter: `user="${user?.id}"`,
        })
      )?.at(0);
      if (output === undefined) {
        output = { optionsId: [] };
      }
    } catch (e) {
      //console.log(e)
      output = { optionsId: [] };
    }
    return output;
  };

  // Make sure to return a promise
  return {
    getOptionsFlowFeed: await getOptionsFlowFeed(),
    getPredefinedCookieRuleOfList: await getPredefinedCookieRuleOfList(),
    getOptionsWatchlist: await getOptionsWatchlist(),
  };
};
