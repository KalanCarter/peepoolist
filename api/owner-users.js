import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function send(res, status, body) {
  res.status(status).json(body);
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase();
}

async function getCaller(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Missing authorization token.");
  }

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  if (userError || !user) {
    throw new Error("Invalid session.");
  }

  const { data: profile, error: profileError } = await serviceClient
    .from("profiles")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profile?.role !== "owner") {
    throw new Error("Owner access required.");
  }

  return { user, profile, serviceClient };
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return send(res, 204, {});
  }

  if (req.method !== "POST") {
    return send(res, 405, { message: "Method not allowed." });
  }

  try {
    const { serviceClient } = await getCaller(req);
    const body = req.body || {};
    const action = body.action;

    if (action === "listUsers") {
      const { data, error } = await serviceClient.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });

      if (error) throw error;

      const users = (data?.users || []).map((user) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }));

      return send(res, 200, { users });
    }

    if (action === "updateEmail") {
      const targetUserId = String(body.targetUserId || "");
      const newEmail = cleanEmail(body.newEmail);

      if (!targetUserId || !newEmail || !newEmail.includes("@")) {
        return send(res, 400, { message: "Missing target user or valid email." });
      }

      const { error } = await serviceClient.auth.admin.updateUserById(targetUserId, {
        email: newEmail,
        email_confirm: true,
      });

      if (error) throw error;
      return send(res, 200, { ok: true });
    }

    if (action === "sendPasswordReset") {
      const targetUserId = String(body.targetUserId || "");
      let email = cleanEmail(body.email);

      if (!email && targetUserId) {
        const { data, error } = await serviceClient.auth.admin.getUserById(targetUserId);
        if (error) throw error;
        email = cleanEmail(data?.user?.email);
      }

      if (!email || !email.includes("@")) {
        return send(res, 400, { message: "Missing valid email." });
      }

      const siteUrl = req.headers.origin || process.env.SITE_URL || "https://peepoolist.com";
      const { error } = await serviceClient.auth.resetPasswordForEmail(email, {
        redirectTo: siteUrl,
      });

      if (error) throw error;
      return send(res, 200, { ok: true });
    }

    if (action === "deleteUser") {
      const targetUserId = String(body.targetUserId || "");
      if (!targetUserId) {
        return send(res, 400, { message: "Missing target user." });
      }

      const { error } = await serviceClient.auth.admin.deleteUser(targetUserId);
      if (error) throw error;
      return send(res, 200, { ok: true });
    }

    return send(res, 400, { message: "Unknown action." });
  } catch (error) {
    return send(res, 403, { message: error.message || "Owner API failed." });
  }
}
