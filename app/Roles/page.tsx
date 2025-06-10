'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';

type Rol = {
  nidRol: string;
  crol: string;
  bhabilitado: boolean;
  dfechaAlta: string;
  dfechaBaja?: string;
};

export default function RolesCrud() {
  const [form, setForm] = useState<Rol>({
    nidRol: '',
    crol: '',
    bhabilitado: true,
    dfechaAlta: '',
    dfechaBaja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const API_URL = 'http://localhost:3001/roles';

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const rolesBool = Array.isArray(data)
        ? data.map(r => ({
            ...r,
            nidRol: String(r.nidRol), // Asegurar que nidRol sea string
            bhabilitado: r.bhabilitado?.data ? r.bhabilitado.data[0] === 1 : Boolean(r.bhabilitado),
          }))
        : [];
      setRoles(rolesBool);
    } catch (error) {
      console.error('Error al obtener roles:', error);
    }
  };

  const cargarRolEnFormulario = (rol: Rol) => {
    setForm({
      ...rol,
      dfechaAlta: rol.dfechaAlta ? rol.dfechaAlta.substring(0, 10) : '',
      dfechaBaja: rol.dfechaBaja ? rol.dfechaBaja.substring(0, 10) : '',
    });
    setModo(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nidRol, crol, dfechaAlta } = form;
    if (!String(nidRol).trim() || !crol || !dfechaAlta) return alert('Completa todos los campos');

    try {
      if (modo === 'modificar') {
        if (!confirm('¿Actualizar este rol?')) return;
        const { nidRol, ...resto } = form;
        await fetch(`${API_URL}/${form.nidRol}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resto),
        });
        mostrarMensaje('Rol actualizado');
      } else if (modo === 'eliminar') {
        if (!confirm('¿Inactivar este rol?')) return;
        await fetch(`${API_URL}/estado/${form.nidRol}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: false }),
        });
        mostrarMensaje('Rol inactivado');
      } else if (modo === 'agregar') {
        if (!confirm('¿Agregar nuevo rol?')) return;
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        mostrarMensaje('Rol agregado');
      }

      await obtenerRoles();
      resetForm();
    } catch (err) {
      alert('Error en la operación');
    }
  };

  const resetForm = () => {
    setForm({
      nidRol: '',
      crol: '',
      bhabilitado: true,
      dfechaAlta: '',
      dfechaBaja: '',
    });
    setModo(null);
    setBusquedaId('');
  };

  const buscarRol = () => {
    const id = busquedaId.trim();

    if (!id) {
      alert('Ingresa un ID para buscar');
      return;
    }

    const encontrado = roles.find(r => String(r.nidRol) === id);

    if (encontrado) {
      cargarRolEnFormulario(encontrado);
    } else {
      alert('No se encontró un rol con ese ID');
    }
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo rol';
    if (modo === 'modificar') return 'Modificar rol';
    if (modo === 'eliminar') return 'Eliminar rol';
    return 'Catálogo de Roles';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{obtenerTitulo()}</h2>

      {mensaje && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'green',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          ✅ {mensaje}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={e => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={buscarRol} style={btnBuscar}>Buscar</button>
        <button onClick={() => { resetForm(); setModo('agregar'); }} style={btnAgregar}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={btnModificar}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={btnEliminar}>Eliminar</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos(prev => !prev)}
          />
          Ver inhabilitados
        </label>
      </div>

      {(modo !== null || form.nidRol !== '') && (
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldRow}>
            <label htmlFor="nidRol" style={labelStyle}>ID Rol:</label>
            <input
              id="nidRol"
              name="nidRol"
              type="text"
              placeholder="ID Rol"
              value={form.nidRol}
              onChange={handleChange}
              style={inputStyle}
              readOnly={modo !== 'agregar'}
            />
          </div>

          <div style={fieldRow}>
            <label style={labelStyle}>Habilitado:</label>
            <input
              type="text"
              value={form.bhabilitado ? 'Sí' : 'No'}
              readOnly
              style={inputStyle}
            />
          </div>

          <div style={fieldRow}>
            <label htmlFor="crol" style={labelStyle}>Rol:</label>
            <input
              id="crol"
              name="crol"
              placeholder="Rol"
              value={form.crol}
              onChange={handleChange}
              style={inputStyle}
              readOnly={modo === 'eliminar' || modo === null}
            />
          </div>

          <div style={fieldRow}>
            <label htmlFor="dfechaAlta" style={labelStyle}>Fecha Alta:</label>
            <input
              id="dfechaAlta"
              name="dfechaAlta"
              type="date"
              value={form.dfechaAlta}
              onChange={handleChange}
              style={inputStyle}
              readOnly={modo === 'eliminar' || modo === null}
            />
          </div>

          {(modo === 'eliminar' || modo === null) && form.dfechaBaja && (
            <div style={fieldRow}>
              <label htmlFor="dfechaBaja" style={labelStyle}>Fecha Baja:</label>
              <input
                id="dfechaBaja"
                name="dfechaBaja"
                type="date"
                value={form.dfechaBaja}
                style={inputStyle}
                readOnly
              />
            </div>
          )}

          {modo && (
            <div style={{ marginLeft: '120px', marginTop: '1rem', width: 'calc(100% - 120px)', display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Inactivar' : 'Guardar'}
              </button>
            </div>
          )}
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID Rol</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Fecha Alta</th>
            <th style={thStyle}>Fecha Baja</th>
            <th style={thStyle}>Habilitado</th>
          </tr>
        </thead>
        <tbody>
          {roles
            .filter(r => mostrarInactivos || r.bhabilitado)
            .map(r => (
              <tr key={r.nidRol} style={{ opacity: r.bhabilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{r.nidRol}</td>
                <td style={tdStyle}>{r.crol}</td>
                <td style={tdStyle}>{r.dfechaAlta?.substring(0, 10)}</td>
                <td style={tdStyle}>{r.dfechaBaja ? r.dfechaBaja.substring(0, 10) : '-'}</td>
                <td style={{ ...tdStyle, color: r.bhabilitado ? 'green' : 'red' }}>
                  {r.bhabilitado ? 'Sí' : 'No'}
                </td>
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