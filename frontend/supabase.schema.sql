create table if not exists public.pacientes_interesados (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  telefono text not null,
  departamento text not null check (departamento in ('La Paz', 'Tarija', 'Chuquisaca')),
  doctor_asignado text not null,
  doctor_telefono text not null,
  estado text not null default 'nuevo' check (estado in ('nuevo', 'contactado', 'en_seguimiento', 'cerrado')),
  created_at timestamptz not null default now()
);

alter table public.pacientes_interesados enable row level security;

drop policy if exists "landing_can_insert_leads" on public.pacientes_interesados;
create policy "landing_can_insert_leads"
on public.pacientes_interesados
for insert
to anon
with check (
  nombre_completo <> ''
  and telefono <> ''
  and departamento in ('La Paz', 'Tarija', 'Chuquisaca')
);

create table if not exists public.doctores_regionales (
  id uuid primary key default gen_random_uuid(),
  departamento text not null unique check (departamento in ('La Paz', 'Tarija', 'Chuquisaca')),
  nombre text not null,
  telefono text not null,
  whatsapp text not null,
  especialidad text not null,
  activo boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.doctores_regionales enable row level security;

insert into public.doctores_regionales (departamento, nombre, telefono, whatsapp, especialidad)
values
  ('La Paz', 'Equipo medico regional La Paz', '+591 70000001', '59170000001', 'Cardiologia y medicina interna'),
  ('Tarija', 'Equipo medico regional Tarija', '+591 70000002', '59170000002', 'Cardiologia y seguimiento clinico'),
  ('Chuquisaca', 'Equipo medico regional Chuquisaca', '+591 70000003', '59170000003', 'Medicina familiar y enfermedades cronicas')
on conflict (departamento) do update set
  nombre = excluded.nombre,
  telefono = excluded.telefono,
  whatsapp = excluded.whatsapp,
  especialidad = excluded.especialidad,
  updated_at = now();
