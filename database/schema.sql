-- ============================================================
-- Hospital Management SaaS - Supabase Schema (MVP)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ---------- ROLES ----------
create table roles (
  id serial primary key,
  name text unique not null check (name in ('patient','doctor','admin'))
);
insert into roles (name) values ('patient'), ('doctor'), ('admin');

-- ---------- USERS ----------
-- Mirrors supabase.auth.users (we store profile + role here)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  role_id int references roles(id) not null,
  created_at timestamptz default now()
);

-- ---------- DEPARTMENTS ----------
create table departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- ---------- DOCTORS ----------
create table doctors (
  id uuid primary key references users(id) on delete cascade,
  department_id uuid references departments(id),
  specialization text,
  qualification text,
  experience_years int,
  consultation_fee numeric(10,2) default 0,
  available_days text[],         -- e.g. {Mon,Tue,Wed}
  available_time_start time,
  available_time_end time,
  bio text
);

-- ---------- PATIENTS ----------
create table patients (
  id uuid primary key references users(id) on delete cascade,
  dob date,
  gender text,
  address text,
  blood_group text,
  emergency_contact text
);

-- ---------- APPOINTMENTS ----------
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) not null,
  doctor_id uuid references doctors(id) not null,
  department_id uuid references departments(id),
  appointment_date date not null,
  appointment_time time not null,
  token_number int,
  status text default 'scheduled' check (status in ('scheduled','completed','cancelled','no_show')),
  reason text,
  consultation_notes text,
  created_at timestamptz default now()
);

-- ---------- NOTIFICATIONS ----------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  appointment_id uuid references appointments(id),
  type text check (type in ('email','whatsapp')),
  status text default 'pending' check (status in ('pending','sent','failed')),
  message text,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table users enable row level security;
alter table patients enable row level security;
alter table doctors enable row level security;
alter table appointments enable row level security;
alter table notifications enable row level security;

-- Users can read/update their own row; admins (checked via role) can read all
create policy "users_select_own" on users for select using (auth.uid() = id);
create policy "users_update_own" on users for update using (auth.uid() = id);

create policy "patients_select_own" on patients for select using (auth.uid() = id);
create policy "doctors_select_all" on doctors for select using (true); -- public can view doctors

-- Patients see their own appointments, doctors see appointments assigned to them
create policy "appt_select_patient" on appointments for select using (auth.uid() = patient_id);
create policy "appt_select_doctor" on appointments for select using (auth.uid() = doctor_id);
create policy "appt_insert_patient" on appointments for insert with check (auth.uid() = patient_id);
create policy "appt_update_doctor" on appointments for update using (auth.uid() = doctor_id);

-- NOTE: Admin access is handled via the backend using the Supabase
-- service_role key (bypasses RLS), so no admin policy is required here.

-- ============================================================
-- SEED DATA (optional, for quick demo)
-- ============================================================
insert into departments (name, description) values
('Cardiology','Heart & vascular care'),
('Orthopedics','Bone & joint care'),
('Pediatrics','Child healthcare'),
('General Medicine','General checkups & treatment');
