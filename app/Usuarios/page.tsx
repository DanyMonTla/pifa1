'use client';

import React, { useState, ChangeEvent } from 'react';

// Estructura del usuario
type Usuario = {
  id_usuario: string;
  usuario: string;
  nombre_usuario: string;
  apellidoP: string;
  apellidoM: string;
  cargoUsuario: string;
  hashed_password: string;
  id_area: string;
  id_rol: string;
  correo_usuario: string;
  estado?: 'activo' | 'inactivo';
};

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
    id_usuario: '',
    usuario: '',
    nombre_usuario: '',
    apellidoP: '',
    apellidoM: '',
    cargoUsuario: '',
    hashed_password: '',
    id_area: '',
    id_rol: '',
    correo_usuario: '',
    estado: 'activo',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const usuarioSeleccionado = usuarios.find(u => u.id_usuario === busquedaId.trim() || u.id_usuario === form.id_usuario);
    if (usuarioSeleccionado) {
      setForm(usuarioSeleccionado);
    } else {
      alert('No se encontró un usuario con ese ID');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = Object.values(form).some(val => val?.toString().trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos.');

    if (modo === 'modificar') {
      const confirmar = confirm('¿Estás seguro de que deseas actualizar este usuario?');
      if (!confirmar) return;
      setUsuarios(prev => prev.map(u => u.id_usuario === form.id_usuario ? form : u));
    } else if (modo === 'eliminar') {
      const confirmar = confirm('¿Estás seguro de que deseas marcar como inactivo este usuario?');
      if (!confirmar) return;
      setUsuarios(prev => prev.map(u => u.id_usuario === form.id_usuario ? { ...u, estado: 'inactivo' } : u));
    } else if (modo === 'agregar') {
      setUsuarios(prev => [...prev, form]);
    }

    setForm({
      id_usuario: '', usuario: '', nombre_usuario: '', apellidoP: '', apellidoM: '',
      cargoUsuario: '', hashed_password: '', id_area: '', id_rol: '', correo_usuario: '', estado: 'activo'
    });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo usuario';
    if (modo === 'modificar') return 'Modificar usuario';
    if (modo === 'eliminar') return 'Eliminar usuario';
    return 'Catálogo de Usuarios';
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
        <label style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
            name="id_usuario"
            placeholder="ID USUARIO"
            value={form.id_usuario}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
          />
          {['usuario', 'nombre_usuario', 'apellidoP', 'apellidoM', 'cargoUsuario'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.replace('_', ' ').toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              readOnly={modo === 'eliminar'}
            />
          ))}
          <input
            name="hashed_password"
            placeholder="CONTRASEÑA"
            value={form.hashed_password}
            onChange={handleChange}
            type="password"
            style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
            readOnly={modo === 'eliminar'}
          />
          {['id_area', 'id_rol', 'correo_usuario'].map(field => (
            <input
              key={field}
              name={field}
              placeholder={field.replace('_', ' ').toUpperCase()}
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
            <th style={thStyle}>Usuario</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellido P</th>
            <th style={thStyle}>Apellido M</th>
            <th style={thStyle}>Cargo</th>
            <th style={thStyle}>ID Área</th>
            <th style={thStyle}>ID Rol</th>
            <th style={thStyle}>Correo</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter(u => mostrarInactivos || u.estado !== 'inactivo')
            .map(u => (
              <tr key={u.id_usuario} style={u.estado === 'inactivo' ? rowInactivoStyle : {}}>
                <td style={tdStyle}>{u.id_usuario}</td>
                <td style={tdStyle}>{u.usuario}</td>
                <td style={tdStyle}>{u.nombre_usuario}</td>
                <td style={tdStyle}>{u.apellidoP}</td>
                <td style={tdStyle}>{u.apellidoM}</td>
                <td style={tdStyle}>{u.cargoUsuario}</td>
                <td style={tdStyle}>{u.id_area}</td>
                <td style={tdStyle}>{u.id_rol}</td>
                <td style={tdStyle}>{u.correo_usuario}</td>
                <td style={tdStyle}>{u.estado || 'activo'}</td>
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

const rowInactivoStyle: React.CSSProperties = {
  backgroundColor: '#e0e0e0',
  opacity: 0.5,
};
