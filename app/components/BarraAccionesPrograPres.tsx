'use client';

import React, { ChangeEvent } from 'react';

type Props = {
  busquedaId: string;
  onChangeBusqueda: (e: ChangeEvent<HTMLInputElement>) => void;
  onBuscar: () => void;
  onAgregar: () => void;
  onModificar: () => void;
  onEliminar: () => void;
  mostrarInactivos: boolean;
  onToggleInactivos: () => void;
};

export default function BarraAcciones({
  busquedaId,
  onChangeBusqueda,
  onBuscar,
  onAgregar,
  onModificar,
  onEliminar,
  mostrarInactivos,
  onToggleInactivos
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}
    >
      <input
        placeholder="Buscar por ID"
        value={busquedaId}
        onChange={onChangeBusqueda}
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" style={btnBuscar}>Buscar</button>
      <button type="button" onClick={onAgregar} style={btnAgregar}>Agregar</button>
      <button type="button" onClick={onModificar} style={btnModificar}>Modificar</button>
      <button type="button" onClick={onEliminar} style={btnEliminar}>Desactivar</button>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={mostrarInactivos}
          onChange={onToggleInactivos}
        />
        Ver inhabilitados
      </label>
    </form>
  );
}

const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
