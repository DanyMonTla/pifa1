"use client";
import React from "react";

export default function EducacionContinuaCedetecPage() {
  const actividades = [
    {
      nombre: "Derecho Procesal Penal y Código Nacional de Procedimientos Penales",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "02/09/2023",
      fin: "21/09/2024",
      h: 8,
      m: 12,
      t: 20,
    },
    {
      nombre: "Mediación Penal: Solución y Casos Prácticos",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "23/09/2023",
      fin: "03/08/2024",
      h: 7,
      m: 14,
      t: 21,
    },
    {
      nombre: "Evaluación y Análisis de Proyectos de Inversión Productiva y Financiera",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "30/09/2023",
      fin: "30/08/2024",
      h: 7,
      m: 9,
      t: 16,
    },
    {
      nombre: "Aspectos Legales Aplicables al Comercio Exterior",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "07/10/2023",
      fin: "13/08/2024",
      h: 12,
      m: 15,
      t: 27,
    },
    {
      nombre: "Negocios Internacionales",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "21/10/2023",
      fin: "13/07/2024",
      h: 7,
      m: 16,
      t: 23,
    },
    {
      nombre: "Juicio de Amparo en Materia Fiscal y Administrativa",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "31/10/2023",
      fin: "05/07/2024",
      h: 7,
      m: 18,
      t: 30,
    },
    {
      nombre: "Finanzas y Técnicas Computacionales",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Físico-Matemáticas y de las Ingenierías",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "04/11/2023",
      fin: "12/07/2024",
      h: 6,
      m: 16,
      t: 22,
    },
    {
      nombre: "Economía Internacional y Globalización",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "11/11/2023",
      fin: "19/07/2024",
      h: 8,
      m: 14,
      t: 22,
    },
    {
      nombre: "Traducción de Textos en Inglés y Español",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Humanidades y Artes",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "11/11/2023",
      fin: "25/07/2024",
      h: 6,
      m: 12,
      t: 18,
    },
    {
      nombre: "Derecho Procesal Civil y Familiar",
      tipo: "Diplomado",
      modalidad: "A distancia",
      alcance: "Nacional",
      proyecto: "Abierto",
      area: "Ciencias Sociales",
      modalidadAcademica: "Actualización profesional",
      genero: "No",
      inicio: "18/11/2023",
      fin: "14/09/2024",
      h: 7,
      m: 17,
      t: 31,
    },
  ];

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Actividades Educación Continua y CEDETEC</h1>
      <table border={1} cellPadding={8} style={{ marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
          <tr>
            <th>No.</th>
            <th>Nombre de la actividad</th>
            <th>Tipo</th>
            <th>Modalidad</th>
            <th>Alcance</th>
            <th>Tipo de Proyecto</th>
            <th>Área de conocimiento</th>
            <th>Modalidad académica</th>
            <th>Equidad de género</th>
            <th>Fecha inicio</th>
            <th>Fecha fin</th>
            <th>H</th>
            <th>M</th>
            <th>T</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((a, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{a.nombre}</td>
              <td>{a.tipo}</td>
              <td>{a.modalidad}</td>
              <td>{a.alcance}</td>
              <td>{a.proyecto}</td>
              <td>{a.area}</td>
              <td>{a.modalidadAcademica}</td>
              <td>{a.genero}</td>
              <td>{a.inicio}</td>
              <td>{a.fin}</td>
              <td>{a.h}</td>
              <td>{a.m}</td>
              <td>{a.t}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
