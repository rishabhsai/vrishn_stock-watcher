import { error, redirect } from "@sveltejs/kit";

export const actions = {
  support: async ({ locals, request }) => {
    const { pb } = locals;
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;
    
    // Normalize & set category
    const email = String(data.email || "").trim().toLowerCase();
    if (!email) throw error(400, "Email is required.");
    
    data.email = email;
    data.category = "contact";
  

    try {
      // Check recent submissions by same email
      const list = await pb.collection("support").getFullList({
        filter: `email="${email}"`, // Fixed: removed extra quote
        sort: "-created",
      });
     
      if (list?.length > 0) {
        console.log("Rate limit check failed for email:", email); // Fixed: removed extra quote and parenthesis
        throw error(
          429,
          "Rate limit exceeded for this email. Please wait before submitting another request."
        );
      }
      
      await pb.collection("support").create(data);
          return redirect(303, "/contact");

    } catch (err: any) {
      if (err?.status) throw err; // rethrow our explicit errors
      throw error(err?.status || 500, err?.message || "Failed to submit support request.");
    }
    
  },
};