
'use client';
import React from "react";
//import ProgPresNumNom from "../components/progPresNumNom";
import IndicadorCard from "../components/Buton";
import './logros.css';

interface Indicador {
  clave: string;
  nombre: string;
  logroT1: number;
  proyeccionT2: number;
  logroT2: number;
  porcentaje: string;
}

export default function IndicadoresPage() {
  const indicadores: Indicador[] = [
    {
      clave: 'A 1.1',
      nombre: 'Proyectos de investigación con financiamiento interno en desarrollo',
      logroT1: 9,
      proyeccionT2: 9,
      logroT2: 10,
      porcentaje: '110%'
    },
    // ... otros indicadores
  ];

  return (
    <div className="indicadores-container">

      {/* 🚧 Módulo en mantenimiento (bloque superior) */}
      <div style={{
        backgroundColor: '#f5f5f5',
        color: '#222',
        padding: '1.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem' }}>🚧 Página en mantenimiento</h2>
        <p style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
          Estamos actualizando este módulo. Puedes consultar los datos actuales, pero algunas funciones podrían no estar disponibles.
        </p>
      </div>

      <div className="titulo-principal">
        <h2>32</h2>
        <h3>Investigación en Ciencias y Desarrollo Tecnológico</h3>
      </div>

      <div className="tabla-indicadores">
        <table>
          <thead>
            <tr>
              <th>CLAVE</th>
              <th>INDICADOR</th>
              <th>LOGRO T1</th>
              <th>PROY. T2</th>
              <th>LOGRO T2</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {indicadores.map((indicador, index) => (
              <tr key={index}>
                <td>{indicador.clave}</td>
                <td>{indicador.nombre}</td>
                <td>{indicador.logroT1}</td>
                <td>{indicador.proyeccionT2}</td>
                <td>{indicador.logroT2}</td>
                <td>{indicador.porcentaje}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="indicadores-adicionales">
        <h2>INDICADORES BLANCOS</h2>
        {/* Aquí puedes incluir otros componentes como ProgPresNumNom si es necesario */}
      </section>
    </div>
  );
}
