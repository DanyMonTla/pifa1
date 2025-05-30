"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

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

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
    cid_usuario: "",
    cnombre_usuario: "",
    capellido_p_usuario: "",
    capellido_m_usuario: "",
    ccargo_usuario: "",
    chashed_password: "",
    nid_area: "",
    nid_rol: "",
    btitulo_usuario: "",
    bhabilitado: true,
    dfecha_alta: "",
    dfecha_baja: "",
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [areas] = useState<Area[]>([
    { idArea: "A1", unidad: "Recursos Humanos" },
    { idArea: "A2", unidad: "Finanzas" },
  ]);
  const [roles] = useState<Rol[]>([
    { id_rol: "R1", rol: "Admin" },
    { id_rol: "R2", rol: "User" },
  ]);

  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let mensajeConfirmacion = "";
    if (modo === "agregar") mensajeConfirmacion = "¿Estás seguro de que deseas agregar este usuario?";
    if (modo === "modificar") mensajeConfirmacion = "¿Deseas realmente actualizar este usuario?";
    if (modo === "eliminar") mensajeConfirmacion = "¿Estás seguro de que deseas desactivar este usuario?";

    const confirmar = confirm(mensajeConfirmacion);
    if (!confirmar) return;

    if (modo === "modificar") {
      setUsuarios(prev => prev.map(u => u.cid_usuario === form.cid_usuario ? form : u));
    } else if (modo === "eliminar") {
      setUsuarios(prev => prev.map(u => u.cid_usuario === form.cid_usuario ? { ...u, bhabilitado: false, dfecha_baja: new Date().toISOString() } : u));
    } else if (modo === "agregar") {
      setUsuarios(prev => [...prev, form]);
    }

    setForm({
      cid_usuario: "",
      cnombre_usuario: "",
      capellido_p_usuario: "",
      capellido_m_usuario: "",
      ccargo_usuario: "",
      chashed_password: "",
      nid_area: "",
      nid_rol: "",
      btitulo_usuario: "",
      bhabilitado: true,
      dfecha_alta: "",
      dfecha_baja: "",
    });
    setModo(null);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div style={{ backgroundColor: "#222", color: "white", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {modo === "agregar" ? "Agregar nuevo usuario" :
         modo === "modificar" ? "Modificar usuario" :
         modo === "eliminar" ? "Eliminar usuario" :
         "Catálogo de Usuarios"}
      </h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={() => {
          const user = usuarios.find(u => u.cid_usuario === busquedaId.trim());
          if (user) setForm(user);
          else alert("No se encontró un usuario con ese ID");
        }} style={btnStyle("#0077b6")}>Buscar</button>
        <button onClick={() => setModo("agregar")} style={btnStyle("#004c75")}>Agregar</button>
        <button onClick={() => setModo("modificar")} style={btnStyle("#004c75")}>Modificar</button>
        <button onClick={() => setModo("eliminar")} style={btnStyle("#8B0000")}>Eliminar</button>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos(prev => !prev)}
          /> Ver inactivos
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          {[
            "cid_usuario", "cnombre_usuario", "capellido_p_usuario", "capellido_m_usuario",
            "ccargo_usuario", "chashed_password", "dfecha_alta"
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g, " ").toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
              style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
              type={field.includes("fecha") ? "datetime-local" : "text"}
            />
          ))}

          {/* Select Área */}
          <select
            name="nid_area"
            value={form.nid_area}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          >
            <option value="">Seleccione un área</option>
            {areas.map(area => (
              <option key={area.idArea} value={area.idArea}>
                {area.idArea}
              </option>
            ))}
          </select>

          {/* Select Rol */}
          <select
            name="nid_rol"
            value={form.nid_rol}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          >
            <option value="">Seleccione un rol</option>
            {roles.map(rol => (
              <option key={rol.id_rol} value={rol.id_rol}>
                {rol.id_rol}
              </option>
            ))}
          </select>

          {/* Campo Título después del rol */}
          <input
            name="btitulo_usuario"
            placeholder="TÍTULO USUARIO"
            value={form.btitulo_usuario}
            onChange={handleChange}
            style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
          />

          <button type="submit" style={btnStyle("#0077b6", true)}>
            {modo === "modificar" ? "Actualizar" : modo === "eliminar" ? "Inactivar" : "Guardar"}
          </button>
        </form>
      )}

      {isClient && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Nombre</th>
              <th style={thStyle}>Apellido P</th>
              <th style={thStyle}>Apellido M</th>
              <th style={thStyle}>Cargo</th>
              <th style={thStyle}>Área</th>
              <th style={thStyle}>Rol</th>
              <th style={thStyle}>Título</th>
              <th style={thStyle}>Alta</th>
              <th style={thStyle}>Baja</th>
              <th style={thStyle}>Habilitado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter(u => mostrarInactivos || u.bhabilitado)
              .map(u => (
                <tr key={u.cid_usuario} style={!u.bhabilitado ? { opacity: 0.5 } : {}}>
                  <td style={tdStyle}>{u.cid_usuario}</td>
                  <td style={tdStyle}>{u.cnombre_usuario}</td>
                  <td style={tdStyle}>{u.capellido_p_usuario}</td>
                  <td style={tdStyle}>{u.capellido_m_usuario}</td>
                  <td style={tdStyle}>{u.ccargo_usuario}</td>
                  <td style={tdStyle}>{u.nid_area}</td>
                  <td style={tdStyle}>{u.nid_rol}</td>
                  <td style={tdStyle}>{u.btitulo_usuario}</td>
                  <td style={tdStyle}>{u.dfecha_alta}</td>
                  <td style={tdStyle}>{u.dfecha_baja}</td>
                  <td style={tdStyle}>{u.bhabilitado ? "Sí" : "No"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {showSuccess && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#28a745",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          zIndex: 1000,
          fontSize: "1.2rem",
          boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
          Operación exitosa
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#003B5C",
  color: "white",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#fff",
  color: "#000",
};

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
  width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
