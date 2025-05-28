import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") throw new Error("Method not allowed");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    // Verify admin status
    const { data: { user }, error: verifyError } = await supabaseClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (verifyError || !user) throw new Error("Invalid token");

    const { data: adminCheck } = await supabaseClient
      .from('admin_users')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (!adminCheck?.is_super_admin) throw new Error("Not authorized");

    // Get user ID from request body
    const { userId } = await req.json();
    if (!userId) throw new Error("User ID required");

    // Ban user
    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { banned: true }
    );

    if (banError) throw banError;

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});