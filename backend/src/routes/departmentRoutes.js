import express from "express";
import { supabaseAdmin } from "../config/supabaseClient.js";

const router = express.Router();

// GET /api/departments - public listing for website
router.get("/", async (req, res) => {
  const { data, error } = await supabaseAdmin.from("departments").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
