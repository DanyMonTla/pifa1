
"use client";
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
  // Datos de los indicadores
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