'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ABCGeneralesPage() {
  const router = useRouter();
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
         Módulos ABC Generales
      </h2>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <button onClick={() => router.push('/Usuarios')} style={boton}>👤 Usuarios</button>
        <button onClick={() => router.push('/indicadores')} style={boton}>📊 Indicadores</button>
        <button onClick={() => router.push('/Frecuencia')} style={boton}>📅 Frecuencia</button>
        <button onClick={() => router.push('/Fuente')} style={boton}>📚 Fuente</button>
        <button onClick={() => router.push('/TipoCalculo')} style={boton}>🧮 Tipo Cálculo</button>
        <button onClick={() => router.push('/TipoIndicador')} style={boton}>🏷️ Tipo Indicador</button>
        <button onClick={() => router.push('/AreasResponsables')} style={boton}>🏛️ Áreas Responsables</button>
        <button onClick={() => router.push('/ProgramaPresupuestal')} style={boton}>💰 Programa Presupuestal</button>
        <button onClick={() => router.push('/Roles')} style={boton}>🔐 Roles</button>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setMostrarInfo(!mostrarInfo)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '3.5rem',
          height: '3.5rem',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
        title="Información general del sistema"
      >
        ℹ️
      </button>

      {/* Panel desplegable de información */}
      {mostrarInfo && (
        <div style={{
          position: 'fixed',
          bottom: '6.5rem',
          right: '2rem',
          backgroundColor: '#f0f0f0',
          color: '#222',
          padding: '1.5rem',
          borderRadius: '12px',
          width: '320px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'bold' }}>ℹ️ Información general</h4>
          <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
            <li>Este módulo contiene accesos a todos los catálogos base del sistema.</li>
            <li>Desde aquí puedes administrar usuarios, indicadores, áreas, fuentes y más.</li>
            <li>Los catálogos permiten registrar, modificar y desactivar registros.</li>
            <li>Es importante completar los catálogos antes de capturar indicadores.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

const boton: React.CSSProperties = {
  padding: '1rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  backgroundColor: '#003B5C',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s ease-in-out'
};
