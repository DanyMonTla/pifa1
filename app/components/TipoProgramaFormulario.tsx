import React, { ChangeEvent } from 'react';

type Props = {
  form: {
    nid_tipo_programa: string;
    ctipo_programa: string;
    bhabilitado: boolean;
    dfecha_alta: string;
    dfecha_baja?: string;
  };
  modo: 'agregar' | 'modificar' | 'eliminar' | 'visualizar';
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function TipoProgramaFormulario({ form, modo, handleChange, handleSubmit }: Props) {
  const esSoloLectura = modo === 'eliminar' || modo === 'visualizar';

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#222',
      padding: '1rem',
      borderRadius: '10px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>ID Tipo Programa:</label>
        <input
          name="nid_tipo_programa"
          value={form.nid_tipo_programa}
          onChange={handleChange}
          readOnly={esSoloLectura}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>Tipo de Programa:</label>
        <input
          name="ctipo_programa"
          value={form.ctipo_programa}
          onChange={handleChange}
          readOnly={esSoloLectura}
          style={inputStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>Fecha de Alta:</label>
        <input
          type="date"
          name="dfecha_alta"
          value={form.dfecha_alta}
          onChange={handleChange}
          readOnly={esSoloLectura}
          style={inputStyle}
        />
      </div>

      {modo === 'eliminar' && form.dfecha_baja && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>Fecha de Baja:</label>
          <input
            type="date"
            name="dfecha_baja"
            value={form.dfecha_baja}
            readOnly
            style={inputStyle}
          />
        </div>
      )}

      {modo !== 'visualizar' && (
        <button type="submit" style={botonEstilo}>
          {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Inactivar' : 'Guardar'}
        </button>
      )}
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  backgroundColor: '#333',
  border: '1px solid #888',
  color: 'white',
  borderRadius: '5px',
};

const botonEstilo: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#0077b6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  marginTop: '1rem',
};
