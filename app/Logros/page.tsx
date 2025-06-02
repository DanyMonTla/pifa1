"use client";
import React, { useState } from "react";
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
  const [mostrarFT, setMostrarFT] = useState(false);

  const indicadores: Indicador[] = [
    {
      clave: 'A 1.1',
      nombre: 'Proyectos de investigación con financiamiento interno en desarrollo',
      logroT1: 9,
      proyeccionT2: 9,
      logroT2: 10,
      porcentaje: '110%'
    },
  ];

  const thStyle: React.CSSProperties = {
    padding: "10px",
    border: "1px solid #ccc",
    backgroundColor: "#003366",
    color: "white",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <div className="indicadores-container">
      <div className="titulo-principal">
        <h2>32</h2>
        <h3>Investigación en Ciencias y Desarrollo Tecnológico</h3>
      </div>

      <div style={{ textAlign: "right", marginBottom: "1rem" }}>
        <button
          onClick={() => setMostrarFT(true)}
          style={{ padding: "0.5rem 1.5rem", backgroundColor: "#4a7c94", color: "white", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
        >
          FT
        </button>
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

      {mostrarFT && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "8px", width: "80%" }}>
            <button
              onClick={() => setMostrarFT(false)}
              style={{ float: "right", background: "#8B0000", color: "white", border: "none", padding: "0.5rem 1rem", cursor: "pointer" }}
            >
              Cerrar
            </button>
            <h3 style={{ marginBottom: "1rem" }}>Ficha Técnica</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>FRECUENCIA</th>
                  <th style={thStyle}>TIPO DE CÁLCULO</th>
                  <th style={thStyle}>FUENTE</th>
                  <th style={thStyle}>COMENTARIO TÉCNICO</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
                    No hay información cargada aún.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <section className="indicadores-adicionales">
        <h2>INDICADORES BLANCOS</h2>
      </section>
    </div>
  );
}
