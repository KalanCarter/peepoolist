import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return res.status(500).json({ message: "Server is missing Supabase environment variables." });
  }

  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing login token." });
  }

  const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authorization,
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await userSupabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ message: "You must be signed in to delete your account." });
  }

  const adminSupabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const { data: files, error: listError } = await adminSupabase.storage
      .from("thumbnails")
      .list(user.id, { limit: 1000 });

    if (listError) {
      throw listError;
    }

    if (files?.length) {
      const paths = files.map((file) => `${user.id}/${file.name}`);
      const { error: removeError } = await adminSupabase.storage.from("thumbnails").remove(paths);

      if (removeError) {
        throw removeError;
      }
    }

    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    return res.status(200).json({ message: "Account deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Could not delete account." });
  }
}
