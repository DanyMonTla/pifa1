'use client';

import React, { ChangeEvent } from 'react';
import { Usuario, Area, Rol } from '../components/tiposUsuarios';

type Props = {
  form: Usuario;
  modo: 'agregar' | 'modificar' | 'eliminar' | null;
  areas: Area[];
  roles: Rol[];
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function UsuariosFormulario({ form, modo, areas, roles, onChange, onSubmit }: Props) {
  const esSoloLectura = modo === null || modo === 'eliminar';

  // Línea de depuración para bhabilitado
  console.log('🧪 Formulario - modo:', modo, '| bhabilitado:', form.bhabilitado);

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem 2rem',
      }}>
        <div style={rowStyle}><label style={labelStyle}>ID Usuario:</label><input name="cid_usuario" value={form.cid_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Nombre:</label><input name="cnombre_usuario" value={form.cnombre_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Apellido Paterno:</label><input name="capellido_p_usuario" value={form.capellido_p_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Apellido Materno:</label><input name="capellido_m_usuario" value={form.capellido_m_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Cargo:</label><input name="ccargo_usuario" value={form.ccargo_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Contraseña (hash):</label><input name="chashed_password" value={form.chashed_password} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Título:</label><input name="btitulo_usuario" value={form.btitulo_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Área:</label>
          <select name="nid_area" value={form.nid_area} onChange={onChange} style={inputStyle} disabled={esSoloLectura}>
            <option value="">Seleccione Área</option>
            {areas.map(a => <option key={a.idArea} value={a.idArea}>{a.unidad}</option>)}
          </select>
        </div>
        <div style={rowStyle}><label style={labelStyle}>Rol:</label>
          <select name="nid_rol" value={form.nid_rol} onChange={onChange} style={inputStyle} disabled={esSoloLectura}>
            <option value="">Seleccione Rol</option>
            {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.rol}</option>)}
          </select>
        </div>
        <div style={rowStyle}><label style={labelStyle}>Fecha Alta:</label><input name="dfecha_alta" type="date" value={form.dfecha_alta} onChange={onChange} style={inputStyle} disabled={esSoloLectura} /></div>
        <div style={rowStyle}><label style={labelStyle}>Fecha Baja:</label><input name="dfecha_baja" type="date" value={form.dfecha_baja} readOnly style={inputStyle} /></div>
      </div>

      {modo !== null && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            type="submit"
            style={{
              padding: '0.6rem 2rem',
              backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Desactivar' : 'Guardar'}
          </button>
        </div>
      )}
    </form>
  );
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const labelStyle: React.CSSProperties = {
  width: '120px',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'right',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.4rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};