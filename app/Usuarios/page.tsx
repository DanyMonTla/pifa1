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
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [areas] = useState<Area[]>([
    { idArea: "1", unidad: "Recursos Humanos" },
    { idArea: "2", unidad: "Finanzas" },
  ]);

  const [roles] = useState<Rol[]>([
    { id_rol: "1", rol: "Admin" },
    { id_rol: "2", rol: "User" },
  ]);

  const API_URL = "http://localhost:3001/usuarios";

  useEffect(() => {
    setIsClient(true);
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const agregarUsuario = async () => {
    try {
      const datos = {
        ...form,
        nid_area: parseInt(form.nid_area),
        nid_rol: parseInt(form.nid_rol),
      };

      console.log("🚀 Enviando al backend:", datos); // <-- AGREGA ESTO

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const responseText = await res.text();
      if (!res.ok) throw new Error(`Error al agregar: ${res.status} ${responseText}`);

      await fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al agregar:", err);
    }
  };


  const modificarUsuario = async () => {
  try {
    const datos = {
      cnombre_usuario: form.cnombre_usuario,
      capellido_p_usuario: form.capellido_p_usuario,
      capellido_m_usuario: form.capellido_m_usuario,
      ccargo_usuario: form.ccargo_usuario,
      chashed_password: form.chashed_password,
      nid_area: parseInt(form.nid_area),
      nid_rol: parseInt(form.nid_rol),
      btitulo_usuario: form.btitulo_usuario,
      bhabilitado: form.bhabilitado,
      dfecha_alta: form.dfecha_alta || null,
      dfecha_baja: form.dfecha_baja || null,
    };

    const res = await fetch(`${API_URL}/${form.cid_usuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    const responseText = await res.text();
    if (!res.ok) throw new Error(`Error al modificar: ${res.status} ${responseText}`);

    await fetchUsuarios(); // recarga usuarios con los datos actualizados
  } catch (err) {
    console.error("❌ Error al modificar:", err);
  }
};


  const desactivarUsuario = async () => {
    try {
      const res = await fetch(`${API_URL}/estado/${form.cid_usuario}`, {
        method: "PATCH",
      });

      const responseText = await res.text();
      if (!res.ok) throw new Error(`Error al desactivar: ${res.status} ${responseText}`);

      await fetchUsuarios();
    } catch (err) {
      console.error("Error al desactivar:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmMsg =
      modo === "agregar"
        ? "¿Estás seguro de que deseas agregar este usuario?"
        : modo === "modificar"
        ? "¿Deseas realmente actualizar este usuario?"
        : "¿Estás seguro de que deseas desactivar este usuario?";
    if (!confirm(confirmMsg)) return;

    if (modo === "agregar") await agregarUsuario();
    if (modo === "modificar") await modificarUsuario();
    if (modo === "eliminar") await desactivarUsuario();

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
        {modo === "agregar"
          ? "Agregar nuevo usuario"
          : modo === "modificar"
          ? "Modificar usuario"
          : modo === "eliminar"
          ? "Eliminar usuario"
          : "Catálogo de Usuarios"}
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
        /> Ver inhabilitados
      </label>


      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <div style={{display: "grid", gridTemplateColumns: "180px 300px", gap: "0.5rem 1rem", alignItems: "center", justifyContent: "center", }}> 
            <label>ID Usuario</label>
            <input name="cid_usuario" value={form.cid_usuario} onChange={handleChange} style={inputStyle} />

            <label>Nombre</label>
            <input name="cnombre_usuario" value={form.cnombre_usuario} onChange={handleChange} style={inputStyle} />

            <label>Apellido Paterno</label>
            <input name="capellido_p_usuario" value={form.capellido_p_usuario} onChange={handleChange} style={inputStyle} />

            <label>Apellido Materno</label>
            <input name="capellido_m_usuario" value={form.capellido_m_usuario} onChange={handleChange} style={inputStyle} />

            <label>Cargo</label>
            <input name="ccargo_usuario" value={form.ccargo_usuario} onChange={handleChange} style={inputStyle} />

            <label>Contraseña (hash)</label>
            <input name="chashed_password" value={form.chashed_password} onChange={handleChange} style={inputStyle} />

            <label>Fecha de Alta</label>
            <input
              name="dfecha_alta"
              type="datetime-local"
              value={form.dfecha_alta}
              onChange={handleChange}
              style={inputStyle}
            />

            <label>Área</label>
            <select name="nid_area" value={form.nid_area} onChange={handleChange} style={inputStyle}>
              <option value="">Seleccione un área</option>
              {areas.map(a => (
                <option key={a.idArea} value={a.idArea}>{a.unidad}</option>
              ))}
            </select>

            <label>Rol</label>
            <select name="nid_rol" value={form.nid_rol} onChange={handleChange} style={inputStyle}>
              <option value="">Seleccione un rol</option>
              {roles.map(r => (
                <option key={r.id_rol} value={r.id_rol}>{r.rol}</option>
              ))}
            </select>

            <label>Título</label>
            <input name="btitulo_usuario" value={form.btitulo_usuario} onChange={handleChange} style={inputStyle} />
          </div>

          <button type="submit" style={btnStyle("#0077b6", true)}>
            {modo === "modificar" ? "Actualizar" : modo === "eliminar" ? "Inactivar" : "Guardar"}
          </button>
        </form>

      )}

      {isClient && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["ID", "Nombre", "Apellido P", "Apellido M", "Cargo", "Área", "Rol", "Título", "Alta", "Baja", "Habilitado"].map(label => (
                <th key={label} style={thStyle}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios
              .filter(u => mostrarInactivos ? !u.bhabilitado : u.bhabilitado)
              .map(u => (
                <tr key={u.cid_usuario} style={!u.bhabilitado ? { opacity: 0.6, backgroundColor: "#444" } : {}}>
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
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#28a745", color: "white", padding: "1rem 2rem",
          borderRadius: "8px", zIndex: 1000, fontSize: "1.2rem", boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
          Operación exitosa
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", marginBottom: "0.5rem", padding: "0.5rem"
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc", padding: "8px", backgroundColor: "#003B5C", color: "white"
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc", padding: "8px", backgroundColor: "#fff", color: "#000"
};

const btnStyle = (color: string, fullWidth = false): React.CSSProperties => ({
  backgroundColor: color, color: "white", padding: "0.5rem 1rem",
  border: "none", cursor: "pointer", width: fullWidth ? "100%" : undefined,
  marginTop: fullWidth ? "1rem" : undefined,
});
