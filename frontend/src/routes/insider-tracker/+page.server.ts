export const load = async ({ locals }) => {
  const getInsiderTracker = async () => {
    const { apiKey, apiURL, user } = locals;

    // make the POST request to the endpoint
    const response = await fetch(apiURL + "/insider-tracker", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
    });

    let output = await response.json();

    output = ['Pro','Plus']?.includes(user?.tier) ? output : output?.slice(0,10)

    return output;
  };

  // Make sure to return a promise
  return {
    getInsiderTracker: await getInsiderTracker(),
  };
};
