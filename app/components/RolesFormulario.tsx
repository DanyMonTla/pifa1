'use client';

import React, { ChangeEvent } from 'react';

type Props = {
  form: {
    nidRol: string;
    crol: string;
    bhabilitado: boolean;
    dfechaAlta: string;
    dfechaBaja?: string;
  };
  modo: 'agregar' | 'modificar' | 'eliminar' | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function RolesFormulario({ form, modo, onChange, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} autoComplete="off" style={formStyle}>
      <div style={fieldRow}>
        <label htmlFor="nidRol" style={labelStyle}>ID Rol:</label>
        <input
          id="nidRol"
          name="nidRol"
          type="text"
          placeholder="ID Rol"
          value={form.nidRol}
          onChange={onChange}
          autoComplete="off"
          style={inputStyle}
          readOnly={modo !== 'agregar'}
        />
      </div>

      {modo !== 'agregar' && modo !== 'modificar' ? (
        <div style={fieldRow}>
          <label style={labelStyle}>Habilitado:</label>
          <input
            type="text"
            value={form.bhabilitado ? 'Sí' : 'No'}
            readOnly
            autoComplete="off"
            style={inputStyle}
          />
        </div>
      ) : (
        <input
          type="hidden"
          name="bhabilitado"
          value={form.bhabilitado ? 'true' : 'false'}
          autoComplete="off"
        />
      )}

      <div style={fieldRow}>
        <label htmlFor="crol" style={labelStyle}>Rol:</label>
        <input
          id="crol"
          name="crol"
          placeholder="Rol"
          value={form.crol}
          onChange={onChange}
          autoComplete="off"
          style={inputStyle}
          readOnly={modo === 'eliminar' || modo === null}
        />
      </div>

      {/* ✅ Mostrar Fecha Alta solo en modo visualización */}
      {modo === null && (
        <div style={fieldRow}>
          <label htmlFor="dfechaAlta" style={labelStyle}>Fecha Alta:</label>
          <input
            id="dfechaAlta"
            name="dfechaAlta"
            type="date"
            value={form.dfechaAlta}
            autoComplete="off"
            readOnly
            style={inputStyle}
          />
        </div>
      )}

      {(modo === 'eliminar' || modo === null) && form.dfechaBaja && (
        <div style={fieldRow}>
          <label htmlFor="dfechaBaja" style={labelStyle}>Fecha Baja:</label>
          <input
            id="dfechaBaja"
            name="dfechaBaja"
            type="date"
            value={form.dfechaBaja}
            autoComplete="off"
            readOnly
            style={inputStyle}
          />
        </div>
      )}

      {modo && (
        <div style={{
          marginLeft: '120px',
          marginTop: '1rem',
          width: 'calc(100% - 120px)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Inactivar' : 'Guardar'}
          </button>
        </div>
      )}
    </form>
  );
}

const formStyle: React.CSSProperties = {
  maxWidth: '450px',
  margin: '3rem auto 2rem auto',
};

const fieldRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  width: '120px',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'right',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};
