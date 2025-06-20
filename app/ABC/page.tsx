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
          onClick={() => router.push('/Usuarios')}
          style={boton}
        >
          Usuarios
        </button>

        <button
          onClick={() => router.push('/indicadores')}
          style={boton}
        >
          Indicadores
        </button>

    
        <button

          onClick={() => router.push('/AreasResponsables')}
          style={boton}
        >
          Areas Responsables
          </button>
          
        <button
          onClick={() => router.push('/ProgramaPresupuestal')}
          style={boton}
        >
          Programa Presupuestal
        </button>

        
        <button
          onClick={() => router.push('/Roles')}
          style={boton}
        >
          Roles
        </button>

        <button
          onClick={() => router.push('/EducacionContinuaCEDETEC')}
          style={boton}
        >
          Educación Continua
        </button>

        <button
          onClick={() => router.push('/ActividadesCulturales')}
          style={boton}
        >
          Actividades Culturales
        </button>

        <button
          onClick={() => router.push('/TipoActCultural')}
          style={boton}
        >
          Tipo Actividad Cultural
        </button>

        <button
          onClick={() => router.push('/TipoEducacionContinua')}
          style={boton}
        >
          Tipo Educación Continua

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
