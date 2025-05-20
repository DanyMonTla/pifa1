'use client';

import React, { useState, ChangeEvent } from 'react';

type Programa = {
  id_programa: string;
  nombre_programa: string;
  id_tipo_programa: string;
  objetivo_pp: string;
  activo: boolean; // 🔥 nuevo campo para controlar visibilidad
};

export default function ProgramasPresupuestalesCrud() {
  const [form, setForm] = useState<Programa>({
    id_programa: '',
    nombre_programa: '',
    id_tipo_programa: '',
    objetivo_pp: '',
    activo: true,
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [verInactivos, setVerInactivos] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const programaSeleccionado = programas.find(p => p.id_programa === busquedaId.trim());
    if (programaSeleccionado) {
      setForm(programaSeleccionado);
    } else {
      alert('No se encontró un programa con ese ID');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = [form.id_programa, form.nombre_programa, form.id_tipo_programa, form.objetivo_pp].some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      const confirmar = confirm('¿Deseas actualizar este programa?');
      if (!confirmar) return;
      setProgramas(prev => prev.map(p => p.id_programa === form.id_programa ? { ...form, activo: p.activo } : p));
    } else if (modo === 'eliminar') {
      const confirmar = confirm('¿Deseas inactivar este programa?');
      if (!confirmar) return;
      setProgramas(prev => prev.map(p => p.id_programa === form.id_programa ? { ...p, activo: false } : p));
    } else if (modo === 'agregar') {
      setProgramas(prev => [...prev, { ...form, activo: true }]);
    }

    setForm({ id_programa: '', nombre_programa: '', id_tipo_programa: '', objetivo_pp: '', activo: true });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo programa';
    if (modo === 'modificar') return 'Modificar programa';
    if (modo === 'eliminar') return 'Inactivar programa';
    return 'Catálogo de Programas Presupuestales';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{obtenerTitulo()}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscarPorId} style={{ backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' }}>Buscar</button>
        <button onClick={() => setModo('agregar')} style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={{ backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' }}>Eliminar</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <input type="checkbox" checked={verInactivos} onChange={() => setVerInactivos(prev => !prev)} /> Ver inactivos
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            name="id_programa"
            placeholder="ID PROGRAMA"
            value={form.id_programa}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          {['nombre_programa', 'id_tipo_programa', 'objetivo_pp'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/_/g, ' ').toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              readOnly={modo === 'eliminar'}
            />
          ))}
          <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem 2rem', backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6', color: 'white', border: 'none' }}>
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Inactivar' : 'Guardar'}
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Programa</th>
            <th style={thStyle}>ID Tipo</th>
            <th style={thStyle}>Objetivo</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {programas.filter(p => verInactivos || p.activo).map(p => (
            <tr key={p.id_programa} style={{ opacity: p.activo ? 1 : 0.5 }}>
              <td style={tdStyle}>{p.id_programa}</td>
              <td style={tdStyle}>{p.nombre_programa}</td>
              <td style={tdStyle}>{p.id_tipo_programa}</td>
              <td style={tdStyle}>{p.objetivo_pp}</td>
              <td style={tdStyle}>{p.activo ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
