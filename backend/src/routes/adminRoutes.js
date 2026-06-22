import express from "express";
import { supabaseAdmin } from "../config/supabaseClient.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth, requireRole("admin"));

// GET /api/admin/stats - totals for dashboard cards
router.get("/stats", async (req, res) => {
  const [{ count: patients }, { count: doctors }, { count: appointments }] = await Promise.all([
    supabaseAdmin.from("patients").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("doctors").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("appointments").select("*", { count: "exact", head: true }),
  ]);

  res.json({ totalPatients: patients || 0, totalDoctors: doctors || 0, totalAppointments: appointments || 0 });
});

// GET /api/admin/appointments - all appointments, most recent first
router.get("/appointments", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("*, patients(users(full_name)), doctors(users(full_name)), departments(name)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/admin/doctors - manage doctors
router.get("/doctors", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("doctors")
    .select("*, users(full_name, email, phone), departments(name)");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
