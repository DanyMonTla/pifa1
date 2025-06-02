"use client";

import React, { ChangeEvent } from "react";

type Usuario = {
  cid_usuario: string;
  cnombre_usuario: string;
  capellido_p_usuario: string;
  capellido_m_usuario: string;
  ccargo_usuario: string;
  chashed_password: string;
  nid_area: string;
  nid_rol: string;
  btitulo_usuario: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string;
};

type Area = {
  idArea: string;
  unidad: string;
};

type Rol = {
  id_rol: string;
  rol: string;
};

type Props = {
  form: Usuario;
  modo: "agregar" | "modificar" | "eliminar" | "visualizar" | null;
  areas: Area[];
  roles: Rol[];
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function UsuariosFormulario({
  form,
  modo,
  areas,
  roles,
  handleChange,
  handleSubmit,
}: Props) {
  if (!modo) return null;

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", maxWidth: "600px", marginInline: "auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {[["ID Usuario", "cid_usuario"],
          ["Nombre", "cnombre_usuario"],
          ["Apellido Paterno", "capellido_p_usuario"],
          ["Apellido Materno", "capellido_m_usuario"],
          ["Cargo", "ccargo_usuario"],
          ["Contraseña (hash)", "chashed_password"],
          ["Fecha de Alta", "dfecha_alta", "datetime-local"],
          ["Título", "btitulo_usuario"]
        ].map(([label, name, type = "text"]) => (
          <div key={name} style={{ display: "flex", alignItems: "center" }}>
            <label style={{ width: "200px" }}>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof Usuario] as string}
              onChange={handleChange}
              style={inputStyle}
              readOnly={modo === "visualizar" || (modo === "eliminar" && name !== "cid_usuario")}
            />
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ width: "200px" }}>Área</label>
          <select
            name="nid_area"
            value={form.nid_area}
            onChange={handleChange}
            style={inputStyle}
            disabled={modo === "visualizar" || modo === "eliminar"}
          >
            <option value="">Seleccione un área</option>
            {areas.map(a => (
              <option key={a.idArea} value={a.idArea}>{a.unidad}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ width: "200px" }}>Rol</label>
          <select
            name="nid_rol"
            value={form.nid_rol}
            onChange={handleChange}
            style={inputStyle}
            disabled={modo === "visualizar" || modo === "eliminar"}
          >
            <option value="">Seleccione un rol</option>
            {roles.map(r => (
              <option key={r.id_rol} value={r.id_rol}>{r.rol}</option>
            ))}
          </select>
        </div>

        {modo !== "visualizar" && (
          <div style={{ textAlign: "center" }}>
            <button type="submit" style={btnStyle(modo === "eliminar" ? "#8B0000" : "#0077b6", true)}>
              {modo === "modificar" ? "Actualizar" : modo === "eliminar" ? "Inactivar" : "Guardar"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.5rem",
};

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.75rem 1rem",
  border: "none",
  cursor: "pointer",
  width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
