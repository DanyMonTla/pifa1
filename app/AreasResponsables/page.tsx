'use client';

import React, { useState } from 'react';

const areas = [
  { id: 4, nombre: "Unidad de Planeación" },
  { id: 6, nombre: "Unidad de Administración Escolar" },
  { id: 8, nombre: "Secretaría General" },
  { id: 43, nombre: "Coordinación del Programa Político" },
  { id: 44, nombre: "Coordinación del Programa de Sociología" },
  { id: 46, nombre: "Coordinación del Programa de Comunicación" },
  { id: 47, nombre: "Coordinación del Programa de Pedagogía" },
  { id: 48, nombre: "Coordinación del Programa de Matemáticas Aplicadas y Computación" },
  { id: 51, nombre: "Coordinación del Programa de Enseñanza de Inglés" },
  { id: 52, nombre: "Coordinación del Programa de Ingeniería Civil" },
  { id: 53, nombre: "Coordinación del Programa de Humanidades" },
  { id: 54, nombre: "Coordinación del Programa de Economía" },
  { id: 55, nombre: "Coordinación del Programa de Diseño Gráfico" },
  { id: 56, nombre: "Coordinación del Programa de Derecho" },
  { id: 57, nombre: "Coordinación del Programa de Arquitectura" },
  { id: 58, nombre: "Coordinación del Programa de Actuaría" },
  { id: 74, nombre: "División del Sistema de Universidad Abierta y Educación a Distancia" },
  { id: 76, nombre: "División de Matemáticas e Ingeniería" },
  { id: 77, nombre: "División de Humanidades" },
  { id: 78, nombre: "División de Diseño y Edificación" },
  { id: 79, nombre: "División de Ciencias Socioeconómicas" },
  { id: 80, nombre: "División de Ciencias Jurídicas" },
  { id: 93, nombre: "Departamento de Servicio Social, Desarrollo Profesional e Inserción Laboral" },
  { id: 100, nombre: "Departamento de Movilidad Estudiantil, Intercambio Académico, Becas y de Servicios de Salud" },
  { id: 110, nombre: "Departamento de Estadística y Organización" },
  { id: 112, nombre: "Coordinación de Estudios de Posgrado" },
  { id: 122, nombre: "Coordinación del Centro de Educación Continua" },
  { id: 124, nombre: "Coordinación del Centro de Difusión Cultural" },
  { id: 128, nombre: "Coordinación del Centro de Enseñanza de Idiomas" },
  { id: 182, nombre: "Unidad del Centro de Desarrollo Tecnológico" },
  { id: 185, nombre: "Coordinación de Actividades Deportivas y Recreativas" },
  { id: 210, nombre: "Unidad de Investigación Multidisciplinaria" },
  { id: 214, nombre: "Centro de Estudios Municipales y Metropolitanos" }
];

const containerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
  padding: '1rem',
};

const topButtonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  justifyContent: 'center',
};

const topButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.75rem', // 🛠 Intermedio entre la 1ra y la 2da vez
  fontWeight: 'bold',
  fontSize: '16px',             // 🛠 Un poco más grande que 14px pero menos que 18px
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  color: 'white',
};


const agregarButton: React.CSSProperties = {
  ...topButtonStyle,
  backgroundColor: '#003B5C',
};

const modificarButton: React.CSSProperties = {
  ...topButtonStyle,
  backgroundColor: '#0F4C75',
};

const eliminarButton: React.CSSProperties = {
  ...topButtonStyle,
  backgroundColor: '#8B0000',
};

const buttonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#e5f0fa',
  borderRadius: '999px',
  padding: '0.5rem 1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

const numberCircleStyle: React.CSSProperties = {
  backgroundColor: '#003B5C',
  color: '#fff',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  marginRight: '0.75rem',
  fontSize: '14px',
};

const textStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#1f2937',
  textAlign: 'center',
  flex: 1,
};

export default function AreasResponsablesPage() {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);

  const handleClick = (titulo: string) => {
    setSeleccionado(titulo);
  };

  const handleVolver = () => {
    setSeleccionado(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* 🔵 🔴 Botones de arriba */}
      <div style={topButtonsContainerStyle}>
        <button style={agregarButton}>Agregar</button>
        <button style={modificarButton}>Modificar</button>
        <button style={eliminarButton}>Eliminar</button>
      </div>

      {/* 🔵 Área de listado */}
      {!seleccionado ? (
        <div style={containerStyle}>
          {areas.map((area) => (
            <button key={area.id} style={buttonStyle} onClick={() => handleClick(area.nombre)}>
              <div style={numberCircleStyle}>{area.id}</div>
              <span style={textStyle}>{area.nombre}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={handleVolver}
            style={{
              marginBottom: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#d1d5db',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ← Volver
          </button>

          <h2 style={{ color: '#1f2937', marginBottom: '1rem', textAlign: 'center' }}>
            {seleccionado}
          </h2>

          <p style={{ textAlign: 'center' }}>
            Próximamente se mostrará más información sobre esta área.
          </p>
        </div>
      )}
    </div>
  );
}
