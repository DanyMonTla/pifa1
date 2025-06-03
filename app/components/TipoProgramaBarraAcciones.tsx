'use client';
import React from 'react';

type Props = {
  busquedaId: string;
  setBusquedaId: (val: string) => void;
  setModo: (modo: 'agregar' | 'modificar' | 'eliminar') => void;
  mostrarInactivos: boolean;
  setMostrarInactivos: (val: boolean) => void;
  handleBuscarPorId: () => void;
};

export default function TipoProgramaBarraAcciones({
  busquedaId,
  setBusquedaId,
  setModo,
  mostrarInactivos,
  setMostrarInactivos,
  handleBuscarPorId,
}: Props) {
  return (
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
          onChange={(e) => setMostrarInactivos(e.target.checked)}
        /> Ver inactivos
      </label>
    </div>
  );
}

const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
