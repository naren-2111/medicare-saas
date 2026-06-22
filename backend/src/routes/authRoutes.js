import express from "express";
import { supabaseAdmin } from "../config/supabaseClient.js";

const router = express.Router();

// POST /api/auth/register
// body: { email, password, full_name, phone, role } role = patient|doctor
router.post("/register", async (req, res) => {
  try {
    const { email, password, full_name, phone, role = "patient" } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "email, password, full_name are required" });
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) return res.status(400).json({ error: authError.message });

    // 2. Look up role id
    const { data: roleRow } = await supabaseAdmin.from("roles").select("id").eq("name", role).single();

    // 3. Insert profile row
    const { error: profileError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      full_name,
      email,
      phone,
      role_id: roleRow.id,
    });
    if (profileError) return res.status(400).json({ error: profileError.message });

    // 4. Insert into patients/doctors table depending on role
    if (role === "patient") {
      await supabaseAdmin.from("patients").insert({ id: authData.user.id });
    } else if (role === "doctor") {
      await supabaseAdmin.from("doctors").insert({ id: authData.user.id });
    }

    res.status(201).json({ message: "User registered", userId: authData.user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// POST /api/auth/login
// body: { email, password }
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });

    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("*, roles(name)")
      .eq("id", data.user.id)
      .single();

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: { ...profile, role: profile.roles.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
