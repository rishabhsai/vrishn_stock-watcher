import { redirect, error } from "@sveltejs/kit";

export const load = async ({ locals, fetch }) => {
  const { pb } = locals;

  if (!pb.authStore.isValid) {
    redirect(303, "/login");
  }

  async function getNotifications() {

    const postData = {'readed': true}
    const response = await fetch("/api/get-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    const output = await response.json();

    return output;
  }

  return {
    getNotifications: await getNotifications(),
  };
};
