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
  modo: "agregar" | "modificar" | "eliminar";
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
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
      {[
        "id_usuario",
        "usuario",
        "nombre_usuario",
        "apellidoP",
        "apellidoM",
        "cargoUsuario",
        "hashed_password",
        "correo_usuario",
      ].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace("_", " ").toUpperCase()}
          value={(form as any)[field]}
          onChange={onChange}
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
        style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
      >
        <option value="">Seleccione un rol</option>
        {roles.map((rol) => (
          <option key={rol.id_rol} value={rol.id_rol}>
            {rol.id_rol}
          </option>
        ))}
      </select>

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
        {modo === "modificar"
          ? "Actualizar"
          : modo === "eliminar"
          ? "Inactivar"
          : "Guardar"}
      </button>
    </form>
  );
}
