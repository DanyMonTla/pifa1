"use client";

import React, { ChangeEvent } from "react";

type Usuario = {
  cid_usuario: string;
  cnombre_usuario: string;
  capellido_p_usuario: string;
  capellido_m_usuario: string;
  ccargo_usuario: string;
  chashed_password: string;
  nid_area: number;
  nid_rol: number;
  btitulo_usuario: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string | null;
};

type Rol = {
  nid_rol: number;
  crol: string;
};

type Props = {
  form: Usuario;
  roles: Rol[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function UsuariosFormulario({
  form,
  roles,
  handleChange,
  handleSubmit,
}: Props) {
  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <input name="cid_usuario" placeholder="ID Usuario" value={form.cid_usuario} onChange={handleChange} />
      <input name="cnombre_usuario" placeholder="Nombre" value={form.cnombre_usuario} onChange={handleChange} />
      <input name="capellido_p_usuario" placeholder="Apellido Paterno" value={form.capellido_p_usuario} onChange={handleChange} />
      <input name="capellido_m_usuario" placeholder="Apellido Materno" value={form.capellido_m_usuario} onChange={handleChange} />
      <input name="ccargo_usuario" placeholder="Cargo" value={form.ccargo_usuario} onChange={handleChange} />
      <input name="chashed_password" placeholder="Contraseña" value={form.chashed_password} onChange={handleChange} />
      <input name="nid_area" type="number" placeholder="ID Área" value={form.nid_area} onChange={handleChange} />

      <select name="nid_rol" value={form.nid_rol} onChange={handleChange}>
        <option value="">-- Selecciona un rol --</option>
        {roles.map((r) => (
          <option key={r.nid_rol} value={r.nid_rol}>{r.crol}</option>
        ))}
      </select>

      <input name="btitulo_usuario" placeholder="Título" value={form.btitulo_usuario} onChange={handleChange} />
      <input name="dfecha_alta" type="date" value={form.dfecha_alta.slice(0, 10)} onChange={handleChange} />
      <button type="submit">Guardar</button>
    </form>
  );
}
