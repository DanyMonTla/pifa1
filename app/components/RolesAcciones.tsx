'use client';
import React from 'react';

type Props = {
  busquedaId: string;
  setBusquedaId: (id: string) => void;
  buscarRol: () => void;
  setModo: (modo: 'agregar' | 'modificar' | 'eliminar') => void;
  resetForm: () => void;
  mostrarInactivos: boolean;
  setMostrarInactivos: React.Dispatch<React.SetStateAction<boolean>>;
  puedeReactivar: boolean;
  reactivarRol: () => void;
};

export default function RolesAcciones({
  busquedaId,
  setBusquedaId,
  buscarRol,
  setModo,
  resetForm,
  mostrarInactivos,
  setMostrarInactivos,
  puedeReactivar,
  reactivarRol,
}: Props) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
      <input
        placeholder="Buscar por ID"
        value={busquedaId}
        onChange={e => setBusquedaId(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            buscarRol();
          }
        }}
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button onClick={buscarRol} style={btnBuscar}>Buscar</button>
      <button onClick={() => { resetForm(); setModo('agregar'); }} style={btnAgregar}>Agregar</button>
      <button onClick={() => setModo('modificar')} style={btnModificar}>Modificar</button>
      <button onClick={() => setModo('eliminar')} style={btnEliminar}>Eliminar</button>
      {mostrarInactivos && puedeReactivar && (
        <button onClick={reactivarRol} style={btnReactivar}>Reactivar</button>
      )}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
        <input
          type="checkbox"
          checked={mostrarInactivos}
          onChange={() => setMostrarInactivos(prev => !prev)}
        />
        Ver inhabilitados
      </label>
    </div>
  );
}

const btnBuscar = {
  backgroundColor: '#0077b6',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  cursor: 'pointer'
};

const btnAgregar = {
  backgroundColor: '#004c75',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  cursor: 'pointer'
};

const btnModificar = {
  backgroundColor: '#004c75',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  cursor: 'pointer'
};

const btnEliminar = {
  backgroundColor: '#8B0000',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  cursor: 'pointer'
};

const btnReactivar = {
  backgroundColor: '#228B22',
  color: 'white',
  padding: '0.5rem 1rem',
  border: 'none',
  cursor: 'pointer'
};
