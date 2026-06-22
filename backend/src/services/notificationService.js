import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";
import { supabaseAdmin } from "../config/supabaseClient.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendEmail({ to, subject, html, userId, appointmentId }) {
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject, html });
    await logNotification({ userId, appointmentId, type: "email", status: "sent", message: subject });
  } catch (err) {
    console.error("Email send failed:", err.message);
    await logNotification({ userId, appointmentId, type: "email", status: "failed", message: err.message });
  }
}

export async function sendWhatsApp({ to, message, userId, appointmentId }) {
  try {
    const url = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to, // E.164 format e.g. 91XXXXXXXXXX
        type: "text",
        text: { body: message },
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` } }
    );
    await logNotification({ userId, appointmentId, type: "whatsapp", status: "sent", message });
  } catch (err) {
    console.error("WhatsApp send failed:", err.response?.data || err.message);
    await logNotification({ userId, appointmentId, type: "whatsapp", status: "failed", message: err.message });
  }
}

async function logNotification({ userId, appointmentId, type, status, message }) {
  await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    appointment_id: appointmentId,
    type,
    status,
    message,
  });
}

// Fires both notifications when an appointment is booked
export async function notifyAppointmentBooked({ patient, doctor, appointment }) {
  const dateStr = `${appointment.appointment_date} at ${appointment.appointment_time}`;

  await sendEmail({
    to: patient.email,
    subject: "Appointment Confirmed",
    html: `<p>Hi ${patient.full_name},</p>
           <p>Your appointment with Dr. ${doctor.full_name} is confirmed for <b>${dateStr}</b>.</p>
           <p>Token Number: <b>${appointment.token_number}</b></p>`,
    userId: patient.id,
    appointmentId: appointment.id,
  });

  if (patient.phone) {
    await sendWhatsApp({
      to: patient.phone,
      message: `Hi ${patient.full_name}, your appointment with Dr. ${doctor.full_name} is confirmed for ${dateStr}. Token: ${appointment.token_number}`,
      userId: patient.id,
      appointmentId: appointment.id,
    });
  }
}
