'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ABCGeneralesPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => router.push('/indicadores')}
          style={boton}
        >
          Indicadores
        </button>

        <button
          onClick={() => router.push('/Frecuencia')}
          style={boton}
        >
          Frecuencia
        </button>

        <button
          onClick={() => router.push('/Fuente')}
          style={boton}
        >
          Fuente
        </button>

        <button
          onClick={() => router.push('/TipoCalculo')}
          style={boton}
        >
          Tipo Cálculo
        </button>

        <button
          onClick={() => router.push('/TipoIndicador')}
          style={boton}
        >
          Tipo Indicador
        </button>

        <button
          onClick={() => router.push('/EducacionContinuaCEDETEC')}
          style={boton}
        >
          Educación Continua
        </button>
      </div>
    </div>
  );
}

const boton: React.CSSProperties = {
  padding: '1rem',
  fontSize: '1rem',
  fontWeight: 'bold',
  backgroundColor: '#003B5C',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer'
};
