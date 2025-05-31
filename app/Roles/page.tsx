'use client';

import React, { useState, ChangeEvent } from 'react';

type Rol = {
  id_rol: string;
  rol: string;
  anio: string;
  habilitado: boolean;
  fechaAlta: string;
  fechaBaja?: string;
};

export default function RolesCrud() {
  const [form, setForm] = useState<Rol>({
    id_rol: '',
    rol: '',
    anio: '',
    habilitado: true,
    fechaAlta: '',
    fechaBaja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const encontrado = roles.find(r => r.id_rol === busquedaId.trim() || r.id_rol === form.id_rol);
    if (encontrado) {
      setForm(encontrado);
    } else {
      alert('No se encontró un rol con ese ID');
    }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = [form.id_rol, form.rol, form.anio, form.fechaAlta].some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      if (!confirm('¿Estás seguro de que deseas actualizar este rol?')) return;
      setRoles(prev => prev.map(r => r.id_rol === form.id_rol ? { ...form, habilitado: true } : r));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'eliminar') {
      if (!confirm('¿Estás seguro de que deseas inactivar este rol?')) return;
      const fechaActual = new Date().toISOString().split('T')[0];
      setRoles(prev => prev.map(r =>
        r.id_rol === form.id_rol ? { ...r, habilitado: false, fechaBaja: fechaActual } : r
      ));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'agregar') {
      if (!confirm('¿Estás seguro de que deseas agregar este nuevo rol?')) return;
      setRoles(prev => [...prev, { ...form, habilitado: true }]);
      mostrarMensaje('Operación exitosa');
    }

    setForm({ id_rol: '', rol: '', anio: '', habilitado: true, fechaAlta: '', fechaBaja: '' });
    setModo(null);
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscarPorId} style={btnBuscar}>Buscar</button>
        <button onClick={() => setModo('agregar')} style={btnAgregar}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={btnModificar}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={btnEliminar}>Eliminar</button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos(prev => !prev)}
          /> Ver inactivos
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            name="id_rol"
            placeholder="ID ROL"
            value={form.id_rol}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="rol"
            placeholder="ROL"
            value={form.rol}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="anio"
            placeholder="AÑO"
            value={form.anio}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="fechaAlta"
            type="date"
            placeholder="Fecha de alta"
            value={form.fechaAlta}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          {modo === 'eliminar' && form.fechaBaja && (
            <input
              name="fechaBaja"
              type="date"
              value={form.fechaBaja}
              style={inputStyle}
              readOnly
            />
          )}
          <button type="submit" style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
            color: 'white',
            border: 'none'
          }}>
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Inactivar' : 'Guardar'}
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID Rol</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Año</th>
            <th style={thStyle}>Habilitado</th>
            <th style={thStyle}>Fecha Alta</th>
            <th style={thStyle}>Fecha Baja</th>
          </tr>
        </thead>
        <tbody>
          {roles
            .filter(r => mostrarInactivos || r.habilitado)
            .map(r => (
              <tr key={r.id_rol} style={{ opacity: r.habilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{r.id_rol}</td>
                <td style={tdStyle}>{r.rol}</td>
                <td style={tdStyle}>{r.anio}</td>
                <td style={{ ...tdStyle, color: r.habilitado ? 'green' : 'red' }}>
                  {r.habilitado ? 'Activo' : 'Inactivo'}
                </td>
                <td style={tdStyle}>{r.fechaAlta}</td>
                <td style={tdStyle}>{r.fechaBaja || '-'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// Estilos reutilizables
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '0.5rem',
  padding: '0.5rem',
};

const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
