import express from "express";
import { supabaseAdmin } from "../config/supabaseClient.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { notifyAppointmentBooked } from "../services/notificationService.js";

const router = express.Router();

// POST /api/appointments - patient books an appointment
// body: { doctor_id, department_id, appointment_date, appointment_time, reason }
router.post("/", requireAuth, requireRole("patient"), async (req, res) => {
  try {
    const { doctor_id, department_id, appointment_date, appointment_time, reason } = req.body;
    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "doctor_id, appointment_date, appointment_time are required" });
    }

    // Compute a simple daily token number per doctor
    const { count } = await supabaseAdmin
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctor_id)
      .eq("appointment_date", appointment_date);

    const { data: appointment, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        patient_id: req.user.id,
        doctor_id,
        department_id,
        appointment_date,
        appointment_time,
        reason,
        token_number: (count || 0) + 1,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Fetch doctor profile for notification
    const { data: doctorProfile } = await supabaseAdmin
      .from("doctors")
      .select("users(full_name)")
      .eq("id", doctor_id)
      .single();

    // Fire-and-forget notifications (don't block the response)
    notifyAppointmentBooked({
      patient: req.user,
      doctor: { full_name: doctorProfile?.users?.full_name || "Doctor" },
      appointment,
    }).catch((e) => console.error("Notification error:", e));

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

// GET /api/appointments/me - patient's own appointments (upcoming + history)
router.get("/me", requireAuth, requireRole("patient"), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("*, doctors(users(full_name), specialization), departments(name)")
    .eq("patient_id", req.user.id)
    .order("appointment_date", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/appointments/doctor/today - doctor's appointments for today
router.get("/doctor/today", requireAuth, requireRole("doctor"), async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("*, patients(users(full_name, phone, email))")
    .eq("doctor_id", req.user.id)
    .eq("appointment_date", today)
    .order("appointment_time", { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/appointments/doctor/patients - distinct patient list for a doctor
router.get("/doctor/patients", requireAuth, requireRole("doctor"), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select("patients(id, users(full_name, email, phone))")
    .eq("doctor_id", req.user.id);

  if (error) return res.status(400).json({ error: error.message });

  const uniquePatients = Object.values(
    data.reduce((acc, row) => {
      if (row.patients) acc[row.patients.id] = row.patients;
      return acc;
    }, {})
  );
  res.json(uniquePatients);
});

// PATCH /api/appointments/:id/notes - doctor adds consultation notes / updates status
router.patch("/:id/notes", requireAuth, requireRole("doctor"), async (req, res) => {
  const { consultation_notes, status } = req.body;
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .update({ consultation_notes, status })
    .eq("id", req.params.id)
    .eq("doctor_id", req.user.id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
