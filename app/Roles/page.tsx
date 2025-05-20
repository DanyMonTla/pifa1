'use client';

import React, { useState, ChangeEvent } from 'react';

type Rol = {
  id_rol: string;
  rol: string;
  anio: string;
  activo: boolean; // 🔥 nuevo campo
};

export default function RolesCrud() {
  const [form, setForm] = useState<Rol>({
    id_rol: '',
    rol: '',
    anio: '',
    activo: true,
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [verInactivos, setVerInactivos] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const encontrado = roles.find(r => r.id_rol === busquedaId.trim());
    if (encontrado) {
      setForm(encontrado);
    } else {
      alert('No se encontró un rol con ese ID');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = [form.id_rol, form.rol, form.anio].some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      const confirmar = confirm('¿Deseas actualizar este rol?');
      if (!confirmar) return;
      setRoles(prev => prev.map(r => r.id_rol === form.id_rol ? { ...form, activo: r.activo } : r));
    } else if (modo === 'eliminar') {
      const confirmar = confirm('¿Deseas inactivar este rol?');
      if (!confirmar) return;
      setRoles(prev => prev.map(r => r.id_rol === form.id_rol ? { ...r, activo: false } : r));
    } else if (modo === 'agregar') {
      setRoles(prev => [...prev, { ...form, activo: true }]);
    }

    setForm({ id_rol: '', rol: '', anio: '', activo: true });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo rol';
    if (modo === 'modificar') return 'Modificar rol';
    if (modo === 'eliminar') return 'Inactivar rol';
    return 'Catálogo de Roles';
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
            name="id_rol"
            placeholder="ID ROL"
            value={form.id_rol}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          {['rol', 'anio'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
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
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>Año</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {roles.filter(r => verInactivos || r.activo).map(r => (
            <tr key={r.id_rol} style={{ opacity: r.activo ? 1 : 0.5 }}>
              <td style={tdStyle}>{r.id_rol}</td>
              <td style={tdStyle}>{r.rol}</td>
              <td style={tdStyle}>{r.anio}</td>
              <td style={tdStyle}>{r.activo ? 'Activo' : 'Inactivo'}</td>
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
