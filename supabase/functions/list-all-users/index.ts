import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Initialize Supabase client with user token for checking admin status
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the user's JWT and get their ID
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Check if the user is an admin
    const { data: adminData, error: adminError } = await supabaseClient
      .from('admin_users')
      .select('is_super_admin')
      .eq('id', user.id)
      .single();

    if (adminError || !adminData?.is_super_admin) {
      throw new Error('User is not an admin');
    }

    // Get all users from auth
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      throw usersError;
    }

    // Get all profiles with admin status
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        admin_users (
          is_super_admin
        )
      `);

    if (profilesError) {
      throw profilesError;
    }

    // Get presence data
    const presenceData = await supabaseClient.channel('online-users').presenceState();

    // Combine the data
    const processedUsers = users.map(authUser => {
      const profile = profiles?.find(p => p.id === authUser.id) || {};
      return {
        id: authUser.id,
        email: authUser.email,
        first_name: profile.first_name || authUser.user_metadata?.first_name || '',
        last_name: profile.last_name || authUser.user_metadata?.last_name || '',
        avatar_url: profile.avatar_url,
        admin_users: profile.admin_users,
        is_online: Object.values(presenceData).some(
          presence => presence.user_id === authUser.id
        ),
        banned: authUser.banned || false,
        last_sign_in_at: authUser.last_sign_in_at,
      };
    });

    return new Response(
      JSON.stringify(processedUsers),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});