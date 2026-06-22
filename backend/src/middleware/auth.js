import { supabaseAdmin } from "../config/supabaseClient.js";

// Verifies the Supabase access token sent from the frontend in
// the Authorization: Bearer <token> header, then loads the user's
// profile row (with role) from our `users` table.
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: "Invalid or expired token" });

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("users")
      .select("*, roles(name)")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) return res.status(401).json({ error: "User profile not found" });

    req.user = { ...profile, role: profile.roles.name };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth check failed" });
  }
}

// Restricts a route to specific roles, e.g. requireRole("admin")
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient role" });
    }
    next();
  };
}
