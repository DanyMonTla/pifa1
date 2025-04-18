'use client';
import React, { useState } from 'react';

export default function IndicadoresForm() {
  const [formData, setFormData] = useState({
    clave_indicador: '',
    indicador_descripcion: '',
    definicion: '',
    frecuencia: '',
    fuente: '',
    id_indicador: '',
    id_proyecto_inves: '',
    id_act_programa: '',
    id_act_cedetec: '',
    id_act_cultural: '',
  });

  const camposOpcionales = [
    'id_proyecto_inves',
    'id_act_programa',
    'id_act_cedetec',
    'id_act_cultural'
  ];

  type CampoFormulario =
    | 'clave_indicador'
    | 'indicador_descripcion'
    | 'definicion'
    | 'frecuencia'
    | 'fuente'
    | 'id_indicador'
    | 'id_proyecto_inves'
    | 'id_act_programa'
    | 'id_act_cedetec'
    | 'id_act_cultural';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Indicador enviado:', formData);
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.4rem',
    backgroundColor: '#A57E22',
    color: '#000000',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '0.95rem'
  };

  const labelStyle: React.CSSProperties = {
    width: '220px',
    fontWeight: 'bold',
    color: '#000000',
    fontSize: '0.95rem'
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.5rem'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        color: '#000000'
      }}>
        <h2 style={{ textAlign: 'center', color: '#000000', marginBottom: '1rem' }}>
          Formulario para dear de alta Indicadores
        </h2>

        {[
          ['Clave del Indicador', 'clave_indicador'],
          ['Descripción del Indicador', 'indicador_descripcion'],
          ['Definición', 'definicion'],
          ['Frecuencia', 'frecuencia'],
          ['Fuente', 'fuente'],
          ['ID Indicador', 'id_indicador'],
          ['ID Proyecto Investigación', 'id_proyecto_inves'],
          ['ID Actividad Programa', 'id_act_programa'],
          ['ID Actividad Cedetec', 'id_act_cedetec'],
          ['ID Actividad Cultural', 'id_act_cultural'],
        ].map(([label, name]) => (
          <div key={name} style={rowStyle}>
            <label htmlFor={name} style={labelStyle}>{label}</label>
            {name === 'definicion' || name === 'fuente' ? (
              <textarea
                id={name}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                style={{ ...inputStyle, height: '80px' }}
                required={!camposOpcionales.includes(name as CampoFormulario)}
              />
            ) : (
              <input
                type={name.startsWith('id_') ? 'number' : 'text'}
                id={name}
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                style={inputStyle}
                required={!camposOpcionales.includes(name as CampoFormulario)}
              />
            )}
          </div>
        ))}

        <button type="submit" style={{
          padding: '0.75rem',
          backgroundColor: '#003B5C',
          color: 'white',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          marginTop: '0'
        }}>
          Enviar Indicador
        </button>
      </form>
    </div>
  );
}
