"use client"; 

import React, { ChangeEvent } from "react";
console.log("Formulario cargado correctamente");


type Usuario = {
  id_usuario: string;
  usuario: string;
  nombre_usuario: string;
  apellidoP: string;
  apellidoM: string;
  cargoUsuario: string;
  hashed_password: string;
  id_area: string;
  id_rol: string;
  correo_usuario: string;
  estado?: "activo" | "inactivo";
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
  modo: "agregar" | "modificar" | "eliminar" | "ver";
  areas: Area[];
  roles: Rol[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FormularioUsuario({
  form,
  modo,
  areas,
  roles,
  onChange,
  onSubmit,
}: Props) {
  const isReadOnly = modo === "ver" || modo === "eliminar" || (modo === "modificar" && form.estado === "inactivo");

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
      {["id_usuario", "usuario", "nombre_usuario", "apellidoP", "apellidoM", "cargoUsuario", "hashed_password", "correo_usuario"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace("_", " ").toUpperCase()}
          value={(form as any)[field]}
          onChange={onChange}
          disabled={isReadOnly && field !== "id_usuario"}
          style={{
            width: "100%",
            marginBottom: "0.5rem",
            padding: "0.5rem",
          }}
        />
      ))}

      <select
        name="id_area"
        value={form.id_area}
        onChange={onChange}
        disabled={isReadOnly}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      >
        <option value="">Seleccione un área</option>
        {areas.map((area) => (
          <option key={area.idArea} value={area.idArea}>
            {area.idArea}
          </option>
        ))}
      </select>

      <select
        name="id_rol"
        value={form.id_rol}
        onChange={onChange}
        disabled={isReadOnly}
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      >
        <option value="">Seleccione un rol</option>
        {roles.map((rol) => (
          <option key={rol.id_rol} value={rol.id_rol}>
            {rol.id_rol}
          </option>
        ))}
      </select>

      {modo === "modificar" && form.estado !== "inactivo" && (
        <button
          type="submit"
          style={{
            backgroundColor: "#0077b6",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          Actualizar
        </button>
      )}

      {modo === "agregar" && (
        <button
          type="submit"
          style={{
            backgroundColor: "#0077b6",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          Guardar
        </button>
      )}

      {modo === "eliminar" && (
        <button
          type="submit"
          style={{
            backgroundColor: "#8B0000",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            cursor: "pointer",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          Inactivar
        </button>
      )}
    </form>
  );
}