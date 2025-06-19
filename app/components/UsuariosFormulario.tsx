'use client';

import React, { ChangeEvent, useState } from 'react';
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
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [tituloSeleccionado, setTituloSeleccionado] = useState(
    ['Ing.', 'Dra.', 'Dr.', 'Mtra.', 'Mtro.', 'Prof.', 'Lic.', 'Act.', 'Arq.'].includes(form.btitulo_usuario)
      ? form.btitulo_usuario
      : 'Otro'
  );

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '4rem',
        rowGap: '1rem',
      }}>
        {/* Columna izquierda */}
        <div>
          {(modo === 'eliminar' || modo === null) && (
            <div style={rowStyle}>
              <label style={labelStyle}>ID Usuario:</label>
              <input
                name="cid_usuario"
                autoComplete="off"
                value={form.cid_usuario}
                style={inputStyle}
                disabled
              />
            </div>
          )}

          <div style={rowStyle}>
            <label style={labelStyle}>RFC:</label>
            <input name="rfc" autoComplete="off" value={form.rfc} onChange={onChange} style={inputStyle} disabled={esSoloLectura} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Apellido Paterno:</label>
            <input name="capellido_p_usuario" autoComplete="off" value={form.capellido_p_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} />
          </div>
          
          <div style={rowStyle}>
  <label style={labelStyle}>Cargo:</label>
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
    <select
      value={
        ["Coordinador", "Coordinadora", "Jefe", "Jefa", "Secretaria", "Secretaria General", "Analista"].includes(form.ccargo_usuario)
          ? form.ccargo_usuario
          : "Otro"
      }
      onChange={(e) => {
        const valor = e.target.value;
        if (valor === "Otro") {
          onChange({
            target: {
              name: "ccargo_usuario",
              value: "",
            },
          } as any);
        } else {
          onChange({
            target: {
              name: "ccargo_usuario",
              value: valor,
            },
          } as any);
        }
      }}
      disabled={esSoloLectura}
      style={inputStyle}
    >
      <option value="">Seleccione Cargo</option>
      <option value="Coordinador">Coordinador</option>
      <option value="Coordinadora">Coordinadora</option>
      <option value="Jefe">Jefe</option>
      <option value="Jefa">Jefa</option>
      <option value="Secretaria">Secretaria</option>
      <option value="Secretaria General">Secretaria General</option>
      <option value="Analista">Analista</option>
      <option value="Otro">Otro</option>
    </select>

    {(
      !["Coordinador", "Coordinadora", "Jefe", "Jefa", "Secretaria", "Secretaria General", "Analista"].includes(form.ccargo_usuario)
    ) && (
      <input
        name="ccargo_usuario"
        placeholder="Especifique otro cargo"
        value={form.ccargo_usuario}
        onChange={onChange}
        autoComplete="off"
        disabled={esSoloLectura}
        style={{ ...inputStyle, marginTop: "0.5rem" }}
      />
    )}
  </div>
</div>



          <div style={rowStyle}>
            <label style={labelStyle}>Título:</label>
            <div style={{ flex: 1 }}>
              <select
                value={tituloSeleccionado}
                onChange={(e) => {
                  const valor = e.target.value;
                  setTituloSeleccionado(valor);
                  if (valor !== 'Otro') {
                    onChange({
                      target: {
                        name: 'btitulo_usuario',
                        value: valor,
                      },
                    } as any);
                  } else {
                    onChange({
                      target: {
                        name: 'btitulo_usuario',
                        value: '',
                      },
                    } as any);
                  }
                }}
                disabled={esSoloLectura}
                style={inputStyle}
              >
                <option value="">Seleccione Título</option>
                <option value="Ing.">Ing.</option>
                <option value="Dra.">Dra.</option>
                <option value="Dr.">Dr.</option>
                <option value="Mtra.">Mtra.</option>
                <option value="Mtro.">Mtro.</option>
                <option value="Prof.">Prof.</option>
                <option value="Lic.">Lic.</option>
                <option value="Act.">Act.</option>
                <option value="Arq.">Arq.</option>
                <option value="Otro">Otro</option>
              </select>

              {tituloSeleccionado === 'Otro' && (
                <input
                  name="btitulo_usuario"
                  placeholder="Especifique otro título"
                  value={form.btitulo_usuario}
                  onChange={onChange}
                  autoComplete="off"
                  disabled={esSoloLectura}
                  style={{ ...inputStyle, marginTop: '0.5rem' }}
                />
              )}
            </div>
          </div>

          <div style={rowStyle}>
            <label style={labelStyle}>Rol:</label>
            <select name="nid_rol" value={form.nid_rol} onChange={onChange} style={inputStyle} disabled={esSoloLectura} autoComplete="off">
              <option value="">Seleccione Rol</option>
              {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.rol}</option>)}
            </select>
          </div>
        </div>

        {/* Columna derecha */}
        <div>
          <div style={rowStyle}>
            <label style={labelStyle}>Nombre:</label>
            <input name="cnombre_usuario" autoComplete="off" value={form.cnombre_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Apellido Materno:</label>
            <input name="capellido_m_usuario" autoComplete="off" value={form.capellido_m_usuario} onChange={onChange} style={inputStyle} disabled={esSoloLectura} />
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Contraseña :</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                name="chashed_password"
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="off"
                value={form.chashed_password}
                onChange={onChange}
                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                disabled={esSoloLectura}
              />
              {!esSoloLectura && (
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              )}
            </div>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Área:</label>
            <select name="nid_area" value={form.nid_area} onChange={onChange} style={inputStyle} disabled={esSoloLectura} autoComplete="off">
              <option value="">Seleccione Área</option>
              {areas.map(a => <option key={a.idArea} value={a.idArea}>{a.unidad}</option>)}
            </select>
          </div>

          {modo === null && (
            <div style={rowStyle}>
              <label style={labelStyle}>Fecha Alta:</label>
              <input
                name="dfecha_alta"
                type="date"
                autoComplete="off"
                value={form.dfecha_alta}
                readOnly
                style={inputStyle}
              />
            </div>
          )}
        </div>
      </div>

      {modo === null && (
        <div style={{ ...rowStyle, marginTop: '1rem' }}>
          <label style={labelStyle}>Habilitado:</label>
          <input type="text" value={form.bhabilitado ? 'Sí' : 'No'} readOnly style={inputStyle} />
        </div>
      )}

      {modo === null && form.bhabilitado === false && (
        <div style={{ ...rowStyle, marginTop: '1rem' }}>
          <label style={labelStyle}>Fecha Baja:</label>
          <input name="dfecha_baja" type="date" value={form.dfecha_baja} readOnly style={inputStyle} />
        </div>
      )}

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
  marginBottom: '0.5rem',
};

const labelStyle: React.CSSProperties = {
  width: '120px',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'right',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.4rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};
