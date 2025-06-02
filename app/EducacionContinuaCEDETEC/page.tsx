"use client";
import React from "react";

export default function EducacionContinuaCedetecPage() {
  const actividades = [];

  const th = {
    padding: "12px",
    border: "1px solid #ccc",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <main style={{ padding: "2rem", backgroundColor: "#1e1e1e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por ID"
          style={{ flex: 1, padding: "0.5rem", backgroundColor: "#333", color: "#fff", border: "1px solid #777" }}
        />
        <button style={{ backgroundColor: "#2196f3", color: "white", padding: "0.5rem 1rem", border: "none" }}>Buscar</button>
        <button style={{ backgroundColor: "#1976d2", color: "white", padding: "0.5rem 1rem", border: "none" }}>Agregar</button>
        <button style={{ backgroundColor: "#0d47a1", color: "white", padding: "0.5rem 1rem", border: "none" }}>Modificar</button>
        <button style={{ backgroundColor: "#b71c1c", color: "white", padding: "0.5rem 1rem", border: "none" }}>Eliminar</button>
        <label style={{ color: "white" }}>
          <input type="checkbox" style={{ marginRight: "0.5rem" }} /> Ver inactivos
        </label>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            color: "#000",
            fontSize: "14px",
          }}
        >
          <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
            <tr>
              <th style={th}>No.</th>
              <th style={th}>Nombre de la actividad</th>
              <th style={th}>Tipo</th>
              <th style={th}>Modalidad</th>
              <th style={th}>Alcance</th>
              <th style={th}>Tipo de Proyecto</th>
              <th style={th}>Área de conocimiento</th>
              <th style={th}>Modalidad académica</th>
              <th style={th}>Equidad de género</th>
              <th style={th}>Fecha inicio</th>
              <th style={th}>Fecha fin</th>
              <th style={th}>H</th>
              <th style={th}>M</th>
              <th style={th}>T</th>
            </tr>
          </thead>
          <tbody>
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f0f0" }}>
                  No hay actividades registradas aún.
                </td>
              </tr>
            ) : (
              actividades.map((a, i) => (
                <tr key={i}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{a.nombre}</td>
                  <td style={td}>{a.tipo}</td>
                  <td style={td}>{a.modalidad}</td>
                  <td style={td}>{a.alcance}</td>
                  <td style={td}>{a.proyecto}</td>
                  <td style={td}>{a.area}</td>
                  <td style={td}>{a.modalidadAcademica}</td>
                  <td style={td}>{a.genero}</td>
                  <td style={td}>{a.inicio}</td>
                  <td style={td}>{a.fin}</td>
                  <td style={td}>{a.h}</td>
                  <td style={td}>{a.m}</td>
                  <td style={td}>{a.t}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
