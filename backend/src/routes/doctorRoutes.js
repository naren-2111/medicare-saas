import express from "express";
import { supabaseAdmin } from "../config/supabaseClient.js";

const router = express.Router();

// GET /api/doctors - public listing for website + booking page
router.get("/", async (req, res) => {
  const { department_id } = req.query;
  let query = supabaseAdmin
    .from("doctors")
    .select("id, specialization, qualification, experience_years, consultation_fee, available_days, available_time_start, available_time_end, bio, users(full_name, email), departments(name)");

  if (department_id) query = query.eq("department_id", department_id);

  const { data, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
