'use client';
import React, { ChangeEvent } from 'react';

type AreaResponsable = {
  nid_area: string;
  cunidad_responsable: string;
  creporta_a: string;
  ccorreo_electronico_ur: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja: string;
};

type Props = {
  form: AreaResponsable;
  modo: 'agregar' | 'modificar' | 'eliminar' | null;
  soloVisualizacion: boolean;
  encabezados: { [key: string]: string };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  areasRegistradas: AreaResponsable[];
};

export default function AreasRespFormulario({
  form,
  modo,
  soloVisualizacion,
  encabezados,
  handleChange,
  handleSubmit,
  areasRegistradas,
}: Props) {
  /* -------------------- utilidades de visibilidad -------------------- */
  const mostrarCampo = (key: string) => {
    if (key === 'dfecha_alta' && !soloVisualizacion) return false;
    if (modo === 'agregar' && (key === 'dfecha_baja' || key === 'bhabilitado'))
      return false;
    if (
      modo === 'modificar' &&
      ['nid_area', 'dfecha_baja', 'bhabilitado'].includes(key)
    )
      return false;
    if (
      (modo === 'eliminar' || soloVisualizacion) &&
      key === 'dfecha_baja' &&
      form.bhabilitado
    )
      return false;
    return true;
  };

  const isReadOnly = modo === 'eliminar' || soloVisualizacion;

  const formatValue = (key: string, value: any): string => {
    if (value === undefined || value === null) return '';
    if (key === 'bhabilitado') return value ? 'Sí' : 'No';
    if (key === 'dfecha_alta' || key === 'dfecha_baja')
      return typeof value === 'string' ? value.slice(0, 10) : '';
    return String(value);
  };

  /* -------------------- opciones para el <select> Reporta A -------------------- */
  const opcionesReportaA = areasRegistradas.filter(area => {
    const nombre = area.cunidad_responsable
      ?.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
    return (
      nombre?.startsWith('DIVISION') || nombre === 'UNIDAD DE PLANEACION'
    );
  });

  /* ------------------------------ render ----------------------------- */
  return (
    (modo || soloVisualizacion) && (
      <form onSubmit={handleSubmit} style={formStyle}>
        {Object.keys(form)
          .filter(key => mostrarCampo(key))
          .map(key => {
            const value = form[key as keyof AreaResponsable];
            const isDate = key === 'dfecha_alta' || key === 'dfecha_baja';

            /* --------- campo especial: <select> para creporta_a --------- */
            if (key === 'creporta_a') {
              return (
                <div key={key} style={fieldRow}>
                  <label htmlFor={key} style={labelStyle}>
                    {encabezados[key] || key}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formatValue(key, value)}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    style={selectStyle}
                  >
                    <option value="">Seleccione unidad</option>
                    {opcionesReportaA.map(area => (
                      <option
                        key={area.nid_area}
                        value={area.cunidad_responsable}
                      >
                        {area.cunidad_responsable}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            /* -------------------------- campos genéricos -------------------------- */
            return (
              <div key={key} style={fieldRow}>
                <label htmlFor={key} style={labelStyle}>
                  {encabezados[key] || key}
                </label>

                {key === 'bhabilitado' ? (
                  <input
                    type="text"
                    value={formatValue(key, value)}
                    readOnly
                    style={inputStyle}
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    type={isDate ? 'date' : 'text'}
                    value={formatValue(key, value)}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    autoComplete="off"
                    style={inputStyle}
                  />
                )}
              </div>
            );
          })}

        {!soloVisualizacion && modo && (
          <div style={submitRow}>
            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {modo === 'modificar'
                ? 'Actualizar'
                : modo === 'eliminar'
                ? 'Marcar inactivo'
                : 'Guardar'}
            </button>
          </div>
        )}
      </form>
    )
  );
}

/* -------------------------- estilos en línea -------------------------- */
const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '780px',              // ⬅️ más amplio para que todos entren y queden iguales
  margin: '2rem auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const fieldRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  gap: '1rem',
};

const labelStyle: React.CSSProperties = {
  width: '220px',                 // ⬅️ ancho fijo suficiente para el más largo
  textAlign: 'right',
  fontWeight: 'bold',
  color: 'white',
  whiteSpace: 'nowrap',
};

const baseInput: React.CSSProperties = {
  flex: 1,
  minWidth: 0,                    // ⬅️ evita desbordar flex-box
  padding: '0.55rem 0.75rem',
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const inputStyle: React.CSSProperties = { ...baseInput };

const selectStyle: React.CSSProperties = {
  ...baseInput,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
};

const submitRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
};
