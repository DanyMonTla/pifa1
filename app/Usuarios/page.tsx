'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';

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
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [mensaje, setMensaje] = useState('');

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
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscar = () => {
    const encontrado = usuarios.find(u => u.cid_usuario === busquedaId.trim());
    if (encontrado) {
      setForm(encontrado);
      setModo(null);
    } else {
      alert("No se encontró un usuario con ese ID");
    }
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
        dfecha_baja: modo === "eliminar" ? new Date().toISOString().slice(0, 10) : form.dfecha_baja || null,
      };

      if (modo === "agregar") {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
        setMensaje('Usuario agregado');
      } else if (modo === "modificar") {
        await fetch(`${API_URL}/${form.cid_usuario}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        });
        setMensaje('Usuario actualizado');
      } else if (modo === "eliminar") {
        await fetch(`${API_URL}/estado/${form.cid_usuario}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dfecha_baja: datos.dfecha_baja }),
        });
        setMensaje('Usuario desactivado');
      }

      await fetchUsuarios();
      resetForm();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error("Error en la operación:", err);
    }
  };

  const resetForm = () => {
    setForm({
      cid_usuario: '', cnombre_usuario: '', capellido_p_usuario: '', capellido_m_usuario: '',
      ccargo_usuario: '', chashed_password: '', nid_area: '', nid_rol: '',
      btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: ''
    });
    setModo(null);
    setBusquedaId('');
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Catálogo de Usuarios</h2>

      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'green',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          ✅ {mensaje}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscar} style={btnBuscar}>Buscar</button>
        <button onClick={() => { resetForm(); setModo('agregar'); }} style={btnAgregar}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={btnModificar}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={btnEliminar}>Desactivar</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <input type="checkbox" checked={mostrarInactivos} onChange={() => setMostrarInactivos(p => !p)} />
          Ver inhabilitados
        </label>
      </div>

      {(modo !== null || form.cid_usuario !== '') && (
        <form onSubmit={handleSubmit} style={formStyle}>
          {[
            ['ID Usuario:', 'cid_usuario'],
            ['Nombre:', 'cnombre_usuario'],
            ['Apellido Paterno:', 'capellido_p_usuario'],
            ['Apellido Materno:', 'capellido_m_usuario'],
            ['Cargo:', 'ccargo_usuario'],
            ['Contraseña (hash):', 'chashed_password'],
            ['Título:', 'btitulo_usuario']
          ].map(([label, name]) => (
            <div key={name} style={fieldRow}>
              <label style={labelStyle}>{label}</label>
              <input
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                style={inputStyle}
                disabled={modo === 'eliminar'}
              />
            </div>
          ))}

          <div style={fieldRow}>
            <label style={labelStyle}>Área:</label>
            <select name="nid_area" value={form.nid_area} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleccione Área</option>
              {areas.map(a => <option key={a.idArea} value={a.idArea}>{a.unidad}</option>)}
            </select>
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>Rol:</label>
            <select name="nid_rol" value={form.nid_rol} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleccione Rol</option>
              {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.rol}</option>)}
            </select>
          </div>
          <div style={fieldRow}>
            <label style={labelStyle}>Fecha Alta:</label>
            <input name="dfecha_alta" type="date" value={form.dfecha_alta} onChange={handleChange} style={inputStyle} />
          </div>

          {modo && (
            <div style={{ marginLeft: '120px', marginTop: '1rem', width: 'calc(100% - 120px)', display: 'flex', justifyContent: 'center' }}>
              <button type="submit" style={{
                padding: '0.75rem 2rem',
                backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}>
                {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Desactivar' : 'Guardar'}
              </button>
            </div>
          )}
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['ID', 'Nombre', 'Apellido P', 'Apellido M', 'Cargo', 'Área', 'Rol', 'Título', 'Alta', 'Baja', 'Habilitado'].map(col => (
              <th key={col} style={thStyle}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter(u => mostrarInactivos || u.bhabilitado)
            .map(u => (
              <tr key={u.cid_usuario} style={{ opacity: u.bhabilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{u.cid_usuario}</td>
                <td style={tdStyle}>{u.cnombre_usuario}</td>
                <td style={tdStyle}>{u.capellido_p_usuario}</td>
                <td style={tdStyle}>{u.capellido_m_usuario}</td>
                <td style={tdStyle}>{u.ccargo_usuario}</td>
                <td style={tdStyle}>{areas.find(a => a.idArea === u.nid_area)?.unidad}</td>
                <td style={tdStyle}>{roles.find(r => r.id_rol === u.nid_rol)?.rol}</td>
                <td style={tdStyle}>{u.btitulo_usuario}</td>
                <td style={tdStyle}>{u.dfecha_alta}</td>
                <td style={tdStyle}>{u.dfecha_baja || '-'}</td>
                <td style={{ ...tdStyle, color: u.bhabilitado ? 'lightgreen' : 'red' }}>{u.bhabilitado ? 'Sí' : 'No'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Estilos
const formStyle: React.CSSProperties = {
  maxWidth: '450px',
  margin: '3rem auto 2rem auto',
};

const fieldRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  width: '120px',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'right',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#003B5C',
  color: 'white',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#fff',
  color: '#000',
};

const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
