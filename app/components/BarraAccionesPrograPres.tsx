'use client';

import React, { ChangeEvent } from 'react';

type Props = {
  busquedaId: string;
  onChangeBusqueda: (e: ChangeEvent<HTMLInputElement>) => void;
  onBuscar: () => void;
  onAgregar: () => void;
  onModificar: () => void;
  onEliminar: () => void;
  onReactivar: () => void; // ✅ nuevo prop
  mostrarInactivos: boolean;
  onToggleInactivos: () => void;
  form: { bhabilitado: boolean }; // ✅ se agrega para saber si está activo o no
};

export default function BarraAcciones({
  busquedaId,
  onChangeBusqueda,
  onBuscar,
  onAgregar,
  onModificar,
  onEliminar,
  onReactivar,
  mostrarInactivos,
  onToggleInactivos,
  form
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

     {mostrarInactivos && !form.bhabilitado && (
        <button type="button" onClick={onReactivar} style={btnReactivar}>
          Reactivar
        </button>
      )}


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

// Estilos
const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
const btnReactivar = { backgroundColor: '#228B22', color: 'white', padding: '0.5rem 1rem' };
