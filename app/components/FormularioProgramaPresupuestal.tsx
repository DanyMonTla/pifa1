'use client';

import React, { ChangeEvent } from 'react';

type Props = {
  form: {
    nid_programa_presupuestal: string;
    cprograma_presupuestal: string;
    cdefinicion_programa_presupuestal: string;
    dfecha_alta: string;
    dfecha_baja?: string;
    bhabilitado: boolean;
  };
  modo: 'agregar' | 'modificar' | 'eliminar' | 'visualizar' | null;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FormularioProgramaPresupuestal({ form, modo, onChange, onSubmit }: Props) {
  if (!modo) return null;

  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '2rem', maxWidth: '600px', marginInline: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ width: '200px' }}>ID Programa</label>
        <input
          name="nid_programa_presupuestal"
          value={form.nid_programa_presupuestal}
          onChange={onChange}
          style={inputStyle}
          readOnly={modo !== 'agregar'}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ width: '200px' }}>Nombre del Programa</label>
        <input
          name="cprograma_presupuestal"
          value={form.cprograma_presupuestal}
          onChange={onChange}
          style={inputStyle}
          readOnly={modo === 'eliminar' || modo === 'visualizar'}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ width: '200px' }}>Definición del Programa</label>
        <textarea
          name="cdefinicion_programa_presupuestal"
          value={form.cdefinicion_programa_presupuestal}
          onChange={onChange}
          style={{ ...inputStyle, height: '80px' }}
          readOnly={modo === 'eliminar' || modo === 'visualizar'}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={{ width: '200px' }}>Fecha de Alta</label>
        <input
          type="date"
          name="dfecha_alta"
          value={form.dfecha_alta}
          onChange={onChange}
          style={inputStyle}
          readOnly={modo === 'eliminar' || modo === 'visualizar'}
        />
      </div>

     {modo !== 'visualizar' && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            disabled={
              (modo === 'modificar' || modo === 'eliminar') && !form.bhabilitado
            }
            style={{
              marginTop: '1rem',
              padding: '0.75rem 2rem',
              backgroundColor: (modo === 'eliminar' ? '#8B0000' : '#0077b6'),
              color: 'white',
              border: 'none',
              opacity:
                (modo === 'modificar' || modo === 'eliminar') && !form.bhabilitado
                  ? 0.5
                  : 1,
              cursor:
                (modo === 'modificar' || modo === 'eliminar') && !form.bhabilitado
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Desactivar' : 'Guardar'}
          </button>
        </div>
      )}

    </form>
  );
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.5rem',
};
