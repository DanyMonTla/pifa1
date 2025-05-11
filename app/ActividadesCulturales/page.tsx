"use client";
import React from "react";

export default function ActividadesCulturalesPage() {
  const actividades = [
    {
      nombre: "A propósito de las olimpiadas Ciclo de cine",
      categoria: "Extensión",
      tipo: "Funciones de obras fílmicas y videos",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "No",
      realizadas: 4,
      sesiones: 4,
      asistentes: 118,
      inicio: "07/08/2024",
      fin: "28/08/2024"
    },
    {
      nombre: "Quinteto Tutti Archi",
      categoria: "Extensión",
      tipo: "Funciones de conciertos",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 122,
      inicio: "20/08/2024",
      fin: "20/08/2024"
    },
    {
      nombre: "Letras y café 'Desde el exilio, Isabel Allende'",
      categoria: "Extensión",
      tipo: "Actividades literarias",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "A distancia",
      genero: "Sí",
      realizadas: 1,
      sesiones: 1,
      asistentes: 728,
      inicio: "29/08/2024",
      fin: "29/08/2024"
    },
    {
      nombre: "Talento artístico de la FaM Trio Meraki (Piano, violín y cello)",
      categoria: "Extensión",
      tipo: "Funciones de conciertos",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Mixta",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 52,
      inicio: "03/09/2024",
      fin: "03/09/2024"
    },
    {
      nombre: "Inauguración expo 'Metamorfosis, Interpretaciones gráficas sobre Franz Kafka'",
      categoria: "Extensión",
      tipo: "Exposiciones",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Mixta",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 223,
      inicio: "04/09/2024",
      fin: "04/09/2024"
    },
    {
      nombre: "A propósito de las olimpiadas Ciclo de cine (Golpes del destino)",
      categoria: "Extensión",
      tipo: "Funciones de obras fílmicas y videos",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "Sí",
      realizadas: 1,
      sesiones: 1,
      asistentes: 62,
      inicio: "04/09/2024",
      fin: "04/09/2024"
    },
    {
      nombre: "Río de primavera y noche iluminada por la luna",
      categoria: "Extensión",
      tipo: "Funciones de obras de danza",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 450,
      inicio: "11/09/2024",
      fin: "11/09/2024"
    },
    {
      nombre: "Letras y café 'Octavio Paz'",
      categoria: "Extensión",
      tipo: "Actividades literarias",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "A distancia",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 600,
      inicio: "12/09/2024",
      fin: "12/09/2024"
    },
    {
      nombre: "Taller Coreográfico de la UNAM 'Tierra y movimiento'",
      categoria: "Extensión",
      tipo: "Funciones de obras de danza",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 300,
      inicio: "13/09/2024",
      fin: "13/09/2024"
    },
    {
      nombre: "Compañía de Danza México de Colores 'Pura señora católica'",
      categoria: "Extensión",
      tipo: "Funciones de obras de danza",
      funcion: "Actividades de difusión, extensión y vinculación",
      modalidad: "Presencial",
      genero: "No",
      realizadas: 1,
      sesiones: 1,
      asistentes: 400,
      inicio: "14/09/2024",
      fin: "14/09/2024"
    }
  ];

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Actividades Culturales – Trimestre 3</h1>
      <table border={1} cellPadding={8} style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
          <tr>
            <th>#</th>
            <th>Nombre de la actividad</th>
            <th>Categoría</th>
            <th>Tipo Actividad</th>
            <th>Actividad por función</th>
            <th>Modalidad</th>
            <th>Género</th>
            <th>Realizadas</th>
            <th>Sesiones</th>
            <th>Asistentes</th>
            <th>Fecha inicio</th>
            <th>Fecha final</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.nombre}</td>
              <td>{a.categoria}</td>
              <td>{a.tipo}</td>
              <td>{a.funcion}</td>
              <td>{a.modalidad}</td>
              <td>{a.genero}</td>
              <td>{a.realizadas}</td>
              <td>{a.sesiones}</td>
              <td>{a.asistentes}</td>
              <td>{a.inicio}</td>
              <td>{a.fin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
