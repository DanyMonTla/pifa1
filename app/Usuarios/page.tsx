'use client';

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

type Area = { idArea: string; unidad: string };
type Rol = { id_rol: string; rol: string };

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
    cid_usuario: '', cnombre_usuario: '', capellido_p_usuario: '', capellido_m_usuario: '',
    ccargo_usuario: '', chashed_password: '', nid_area: '', nid_rol: '',
    btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '',
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busquedaId, setBusquedaId] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<"agregar" | "modificar" | "eliminar" | "visualizar" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  const API_URL = "http://localhost:3001/usuarios";
  const AREAS_URL = "http://localhost:3001/areas-responsables";
  const ROLES_URL = "http://localhost:3001/roles";

  useEffect(() => {
    fetchUsuarios();
    fetchAreas();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const normalizados = Array.isArray(data)
        ? data.map((u: any) => ({
            ...u,
            bhabilitado: u.bhabilitado?.data ? u.bhabilitado.data[0] === 1 : Boolean(u.bhabilitado),
          }))
        : [];
      setUsuarios(normalizados);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await fetch(AREAS_URL);
      const data = await res.json();
      setAreas(data.map((a: any) => ({ idArea: a.nid_area.toString(), unidad: a.cunidad_responsable })));
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(ROLES_URL);
      const data = await res.json();
      setRoles(data.map((r: any) => ({ id_rol: r.nidRol.toString(), rol: r.crol })));
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = () => {
    const user = usuarios.find(u => u.cid_usuario === busquedaId.trim());
    if (user) {
      setForm(user);
      setModo("visualizar");
    } else {
      alert("No se encontró un usuario con ese ID");
    }
  };

  const handleModo = (nuevoModo: typeof modo) => {
    if (!form.cid_usuario && nuevoModo !== 'agregar') {
      alert("Busca o selecciona primero un usuario.");
      return;
    }
    setModo(nuevoModo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmMsg = modo === 'agregar' ? '¿Agregar usuario?' : modo === 'modificar' ? '¿Actualizar usuario?' : '¿Desactivar usuario?';
    if (!confirm(confirmMsg)) return;

    try {
      const datos = {
        ...form,
        nid_area: parseInt(form.nid_area),
        nid_rol: parseInt(form.nid_rol),
        dfecha_baja: modo === "eliminar" ? new Date().toISOString().slice(0, 16) : form.dfecha_baja || null,
      };

      if (modo === "agregar") {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
      } else if (modo === "modificar") {
        await fetch(`${API_URL}/${form.cid_usuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
      } else if (modo === "eliminar") {
        await fetch(`${API_URL}/estado/${form.cid_usuario}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dfecha_baja: datos.dfecha_baja }),
        });
      }

      await fetchUsuarios();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      resetForm();
    } catch (err) {
      console.error("Error en la operación:", err);
    }
  };

  const resetForm = () => {
    setForm({ cid_usuario: '', cnombre_usuario: '', capellido_p_usuario: '', capellido_m_usuario: '', ccargo_usuario: '', chashed_password: '', nid_area: '', nid_rol: '', btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '' });
    setModo(null);
  };

  return (
    <div style={{ backgroundColor: "#222", color: "white", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {modo === "agregar" ? "Agregar nuevo usuario" : modo === "modificar" ? "Modificar usuario" : modo === "eliminar" ? "Eliminar usuario" : modo === "visualizar" ? "Detalle de usuario" : "Catálogo de Usuarios"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input placeholder="Buscar por ID" value={busquedaId} onChange={(e) => setBusquedaId(e.target.value)} style={{ flex: 1, padding: "0.5rem" }} />
          <button type="button" onClick={handleBuscar} style={btn("#0077b6")}>Buscar</button>
          <button type="button" onClick={() => handleModo("agregar")} style={btn("#004c75")}>Agregar</button>
          <button type="button" onClick={() => handleModo("modificar")} style={btn("#004c75")}>Modificar</button>
          <button type="button" onClick={() => handleModo("eliminar")} style={btn("#8B0000")}>Desactivar</button>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input type="checkbox" checked={mostrarInactivos} onChange={() => setMostrarInactivos(prev => !prev)} /> Ver inhabilitados
          </label>
        </div>
      </form>
      
      {(modo === "agregar" || modo === "modificar") && (
  <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
      <input name="cid_usuario" value={form.cid_usuario} onChange={handleChange} placeholder="ID Usuario" required style={inputStyle} disabled={modo === "modificar"} />
      <input name="cnombre_usuario" value={form.cnombre_usuario} onChange={handleChange} placeholder="Nombre" required style={inputStyle} />
      <input name="capellido_p_usuario" value={form.capellido_p_usuario} onChange={handleChange} placeholder="Apellido Paterno" required style={inputStyle} />
      <input name="capellido_m_usuario" value={form.capellido_m_usuario} onChange={handleChange} placeholder="Apellido Materno" required style={inputStyle} />
      <input name="ccargo_usuario" value={form.ccargo_usuario} onChange={handleChange} placeholder="Cargo" required style={inputStyle} />
      <input name="chashed_password" value={form.chashed_password} onChange={handleChange} placeholder="Contraseña (hash)" required style={inputStyle} />
      <select name="nid_area" value={form.nid_area} onChange={handleChange} required style={inputStyle}>
        <option value="">Seleccione Área</option>
        {areas.map(area => (
          <option key={area.idArea} value={area.idArea}>{area.unidad}</option>
        ))}
      </select>
      <select name="nid_rol" value={form.nid_rol} onChange={handleChange} required style={inputStyle}>
        <option value="">Seleccione Rol</option>
        {roles.map(rol => (
          <option key={rol.id_rol} value={rol.id_rol}>{rol.rol}</option>
        ))}
      </select>
      <input name="btitulo_usuario" value={form.btitulo_usuario} onChange={handleChange} placeholder="Título" required style={inputStyle} />
      <input name="dfecha_alta" value={form.dfecha_alta} onChange={handleChange} type="date" placeholder="Fecha Alta" required style={inputStyle} />
    </div>

    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <button type="submit" style={btn("#28a745")}>
        {modo === "agregar" ? "Guardar Usuario" : "Actualizar Usuario"}
      </button>
    </div>
  </form>
)}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {['ID', 'Nombre', 'Apellido P', 'Apellido M', 'Cargo', 'Área', 'Rol', 'Título', 'Alta', 'Baja', 'Habilitado'].map(label => (
              <th key={label} style={thStyle}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter(u => mostrarInactivos || u.bhabilitado)
            .map(u => (
              <tr key={u.cid_usuario} style={{ backgroundColor: u.bhabilitado ? "white" : "#555", color: u.bhabilitado ? "#000" : "#ccc" }}>
                <td style={tdStyle}>{u.cid_usuario}</td>
                <td style={tdStyle}>{u.cnombre_usuario}</td>
                <td style={tdStyle}>{u.capellido_p_usuario}</td>
                <td style={tdStyle}>{u.capellido_m_usuario}</td>
                <td style={tdStyle}>{u.ccargo_usuario}</td>
                <td style={tdStyle}>{areas.find(a => a.idArea === u.nid_area)?.unidad || u.nid_area}</td>
                <td style={tdStyle}>{roles.find(r => r.id_rol === u.nid_rol)?.rol || u.nid_rol}</td>
                <td style={tdStyle}>{u.btitulo_usuario}</td>
                <td style={tdStyle}>{u.dfecha_alta}</td>
                <td style={tdStyle}>{u.dfecha_baja || '-'}</td>
                <td style={{ ...tdStyle, color: u.bhabilitado ? 'lightgreen' : 'red' }}>{u.bhabilitado ? 'Sí' : 'No'}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {showSuccess && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          backgroundColor: "#28a745", color: "white", padding: "1rem 2rem", borderRadius: "8px",
          zIndex: 1000, fontSize: "1.2rem", boxShadow: "0 0 10px rgba(0,0,0,0.5)"
        }}>
          Operación exitosa
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ccc", padding: "8px", backgroundColor: "#003B5C", color: "white"
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ccc", padding: "8px"
};

const btn = (color: string): React.CSSProperties => ({
  backgroundColor: color,
  color: "white",
  padding: "0.5rem 1rem",
  border: "none",
  cursor: "pointer",
});

const inputStyle: React.CSSProperties = {
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f9f9f9",
  color: "#000",
};
