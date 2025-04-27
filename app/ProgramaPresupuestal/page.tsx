'use client';
import React from 'react';

const programasPresupuestales = [
  { id: "10", nombre: "Educación de Licenciatura presencial" },
  { id: "11", nombre: "Educación de Posgrado" },
  { id: "12", nombre: "Educación Continua, Abierta y a Distancia" },
  { id: "31", nombre: "Investigación en Ciencias y Desarrollo Tecnológico" },
  { id: "32", nombre: "Investigación en Humanidades y Ciencias Sociales" },
  { id: "33", nombre: "Desarrollo Académico en Investigación" },
  { id: "41", nombre: "Extensión y Difusión Cultural" },
  { id: "42", nombre: "Vinculación con la Sociedad" },
];

export default function ProgramasPresupuestales() {
  return (
    <div style={contenedor}>
      <div style={subContenedor}>
        {/* 🔵 🔴 Botones arriba */}
        <div style={topButtonsContainerStyle}>
          <button style={agregarButton}>Agregar</button>
          <button style={modificarButton}>Modificar</button>
          <button style={eliminarButton}>Eliminar</button>
        </div>

        {/* 🔵 Lista de Programas */}
        <div style={tablaContenedor}>
          {programasPresupuestales.map((programa) => (
            <div key={programa.id} style={fila}>
              <div style={columnaId}>
                {programa.id}
              </div>
              <div style={columnaNombre}>
                {programa.nombre}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ESTILOS ---

const contenedor: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#333333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '4rem', // 🔥 Agregado el padding abajo
  };
  

const subContenedor: React.CSSProperties = {
  width: '100%',
  maxWidth: '700px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const topButtonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  justifyContent: 'center',
};

const topButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.75rem', // Tamaño intermedio 🔥
  fontWeight: 'bold',
  fontSize: '16px',
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

const tablaContenedor: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const fila: React.CSSProperties = {
    display: 'flex',
    height: '55px', // 🔥 Bajamos de 70px a 55px
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '0px',
    overflow: 'hidden'
  };
  
const columnaId: React.CSSProperties = {
  width: '70px',
  height: '100%',
  backgroundColor: '#003B5C',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1.8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const columnaNombre: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1rem',
  fontSize: '1.3rem',
  fontWeight: 600,
  color: '#333',
  textAlign: 'center'
};
