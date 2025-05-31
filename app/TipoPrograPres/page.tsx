'use client';

import React, { useState, ChangeEvent } from 'react';

type TipoPrograma = {
  nid_tipo_programa: string;
  ctipo_programa: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja?: string;
};

export default function TipoProgramaCrud() {
  const [form, setForm] = useState<TipoPrograma>({
    nid_tipo_programa: '',
    ctipo_programa: '',
    bhabilitado: true,
    dfecha_alta: '',
    dfecha_baja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [programas, setProgramas] = useState<TipoPrograma[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const encontrado = programas.find(p => p.nid_tipo_programa === busquedaId.trim() || p.nid_tipo_programa === form.nid_tipo_programa);
    if (encontrado) {
      setForm(encontrado);
    } else {
      alert('No se encontró un tipo de programa con ese ID');
    }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = [form.nid_tipo_programa, form.ctipo_programa, form.dfecha_alta].some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      if (!confirm('¿Actualizar tipo de programa?')) return;
      setProgramas(prev => prev.map(p => p.nid_tipo_programa === form.nid_tipo_programa ? { ...form, bhabilitado: true } : p));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'eliminar') {
      if (!confirm('¿Inactivar tipo de programa?')) return;
      const fechaActual = new Date().toISOString().split('T')[0];
      setProgramas(prev => prev.map(p =>
        p.nid_tipo_programa === form.nid_tipo_programa ? { ...p, bhabilitado: false, dfecha_baja: fechaActual } : p
      ));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'agregar') {
      if (!confirm('¿Agregar nuevo tipo de programa?')) return;
      setProgramas(prev => [...prev, { ...form, bhabilitado: true }]);
      mostrarMensaje('Operación exitosa');
    }

    setForm({ nid_tipo_programa: '', ctipo_programa: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '' });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar Tipo de Programa';
    if (modo === 'modificar') return 'Modificar Tipo de Programa';
    if (modo === 'eliminar') return 'Eliminar Tipo de Programa';
    return 'Catálogo de Tipos de Programa';
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
            name="nid_tipo_programa"
            placeholder="ID Tipo Programa"
            value={form.nid_tipo_programa}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="ctipo_programa"
            placeholder="Tipo de Programa"
            value={form.ctipo_programa}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="dfecha_alta"
            type="date"
            placeholder="Fecha de Alta"
            value={form.dfecha_alta}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          {modo === 'eliminar' && form.dfecha_baja && (
            <input
              name="dfecha_baja"
              type="date"
              value={form.dfecha_baja}
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
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Tipo de Programa</th>
            <th style={thStyle}>Habilitado</th>
            <th style={thStyle}>Fecha Alta</th>
            <th style={thStyle}>Fecha Baja</th>
          </tr>
        </thead>
        <tbody>
          {programas
            .filter(p => mostrarInactivos || p.bhabilitado)
            .map(p => (
              <tr key={p.nid_tipo_programa} style={{ opacity: p.bhabilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{p.nid_tipo_programa}</td>
                <td style={tdStyle}>{p.ctipo_programa}</td>
                <td style={{ ...tdStyle, color: p.bhabilitado ? 'green' : 'red' }}>
                  {p.bhabilitado ? 'Activo' : 'Inactivo'}
                </td>
                <td style={tdStyle}>{p.dfecha_alta}</td>
                <td style={tdStyle}>{p.dfecha_baja || '-'}</td>
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
