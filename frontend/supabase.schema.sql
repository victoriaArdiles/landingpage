create table if not exists public.pacientes_interesados (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  telefono text not null,
  email text,
  departamento text not null check (departamento in ('La Paz', 'Tarija', 'Chuquisaca')),
  mensaje text,
  estado_contacto text not null default 'nuevo' check (estado_contacto in ('nuevo', 'contactado', 'en_seguimiento', 'cerrado')),
  fecha_registro timestamp default now()
);

alter table public.pacientes_interesados enable row level security;

grant usage on schema public to anon;
grant insert on public.pacientes_interesados to anon;

drop policy if exists "Permitir registro desde landing" on public.pacientes_interesados;
create policy "Permitir registro desde landing"
on public.pacientes_interesados
for insert
to anon
with check (
  nombre_completo is not null
  and nombre_completo <> ''
  and telefono is not null
  and telefono <> ''
  and departamento in ('La Paz', 'Tarija', 'Chuquisaca')
);

create table if not exists public.doctores_regionales (
  id uuid primary key default gen_random_uuid(),
  departamento text not null unique check (departamento in ('La Paz', 'Tarija', 'Chuquisaca')),
  nombre text not null,
  telefono text,
  whatsapp text,
  especialidad text,
  activo boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.doctores_regionales enable row level security;

grant select on public.doctores_regionales to anon;

drop policy if exists "Ver doctores regionales activos" on public.doctores_regionales;
create policy "Ver doctores regionales activos"
on public.doctores_regionales
for select
to anon
using (activo = true);

insert into public.doctores_regionales (departamento, nombre, telefono, whatsapp, especialidad, activo)
values
  ('La Paz', 'Equipo regional La Paz', null, null, 'Contacto medico pendiente de asignacion', true),
  ('Tarija', 'Equipo regional Tarija', null, null, 'Contacto medico pendiente de asignacion', true),
  ('Chuquisaca', 'Equipo regional Chuquisaca', null, null, 'Contacto medico pendiente de asignacion', true)
on conflict (departamento) do update set
  nombre = excluded.nombre,
  telefono = coalesce(public.doctores_regionales.telefono, excluded.telefono),
  whatsapp = coalesce(public.doctores_regionales.whatsapp, excluded.whatsapp),
  especialidad = coalesce(public.doctores_regionales.especialidad, excluded.especialidad),
  activo = excluded.activo,
  updated_at = now();

-- Cuando tengas los contactos reales, actualiza asi:
-- update public.doctores_regionales
-- set nombre = 'Dra. Nombre Apellido',
--     telefono = '+591 XXXXXXXX',
--     whatsapp = '591XXXXXXXX',
--     especialidad = 'Cardiologia',
--     updated_at = now()
-- where departamento = 'La Paz';
