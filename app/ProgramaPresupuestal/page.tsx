'use client';

import React, { useState, ChangeEvent } from 'react';

type TipoProgramaPres = {
  id_tipo_proPres: string;
  tipo_programaPres: string;
  estado: 'activo' | 'inactivo';
};

export default function TipoProgramaPresCrud() {
  const [form, setForm] = useState<TipoProgramaPres>({ id_tipo_proPres: '', tipo_programaPres: '', estado: 'activo' });
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [programas, setProgramas] = useState<TipoProgramaPres[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const encontrado = programas.find(p => p.id_tipo_proPres === busquedaId.trim() || p.id_tipo_proPres === form.id_tipo_proPres);
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
    const camposVacios = Object.values(form).some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      if (!confirm('¿Estás seguro de que deseas actualizar este tipo de programa?')) return;
      setProgramas(prev => prev.map(p => p.id_tipo_proPres === form.id_tipo_proPres ? { ...form, estado: 'activo' } : p));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'eliminar') {
      if (!confirm('¿Estás seguro de que deseas inactivar este tipo de programa?')) return;
      setProgramas(prev => prev.map(p => p.id_tipo_proPres === form.id_tipo_proPres ? { ...p, estado: 'inactivo' } : p));
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'agregar') {
      if (!confirm('¿Estás seguro de que deseas agregar este nuevo tipo de programa?')) return;
      setProgramas(prev => [...prev, { ...form, estado: 'activo' }]);
      mostrarMensaje('Operación exitosa');
    }

    setForm({ id_tipo_proPres: '', tipo_programaPres: '', estado: 'activo' });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo Tipo de Programa';
    if (modo === 'modificar') return 'Modificar Tipo de Programa';
    if (modo === 'eliminar') return 'Eliminar Tipo de Programa';
    return 'Catálogo de Tipo Programa Presupuestal';
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

        {/* Checkbox Ver Inactivos */}
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
            name="id_tipo_proPres"
            placeholder="ID Tipo Programa Pres"
            value={form.id_tipo_proPres}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="tipo_programaPres"
            placeholder="Tipo Programa Pres"
            value={form.tipo_programaPres}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
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
            <th style={thStyle}>ID Tipo Programa Pres</th>
            <th style={thStyle}>Tipo Programa Pres</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {programas
            .filter(p => mostrarInactivos || p.estado === 'activo')
            .map(p => (
              <tr key={p.id_tipo_proPres} style={{ opacity: p.estado === 'activo' ? 1 : 0.5 }}>
                <td style={tdStyle}>{p.id_tipo_proPres}</td>
                <td style={tdStyle}>{p.tipo_programaPres}</td>
                <td style={{ ...tdStyle, color: p.estado === 'activo' ? 'green' : 'red' }}>
                  {p.estado}
                </td>
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