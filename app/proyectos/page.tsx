'use client'

import React, { useState } from 'react'
import './proyectos.css'

interface Proyecto {
  id: number
  idDgapa: string
  nombre: string
  fechaInicio: string
  fechaTermino: string
  areaConocimiento: string
  tipoFinanciamiento: string
  tipoProyecto: string
  genero: boolean
  jovenes: boolean
  investigacion: boolean
  responsable: string
  rfcResponsable: string
  nominaResponsable: string
  corresponsable: string
  rfcCorresponsable: string
  nominaCorresponsable: string
}

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])

  const handleAgregar = () => {
    setProyectos([
      ...proyectos,
      {
        id: proyectos.length + 1,
        idDgapa: '',
        nombre: '',
        fechaInicio: '',
        fechaTermino: '',
        areaConocimiento: '',
        tipoFinanciamiento: '',
        tipoProyecto: '',
        genero: false,
        jovenes: false,
        investigacion: false,
        responsable: '',
        rfcResponsable: '',
        nominaResponsable: 'No',
        corresponsable: '',
        rfcCorresponsable: '',
        nominaCorresponsable: 'No'
      }
    ])
  }

  const handleChange = (i: number, key: keyof Proyecto, value: string | boolean) => {
    const copia = [...proyectos]
    copia[i][key] = value as never
    setProyectos(copia)
  }

  const handleGuardar = () => {
    console.log('Proyectos capturados:', proyectos)
    // Aquí se puede conectar a una API
  }

  return (
    <div className="proy-container">
      <h2>Captura de Proyectos</h2>
      <table className="proy-tabla">
        <thead>
          <tr>
            <th>ID DGAPA</th>
            <th>Nombre del proyecto</th>
            <th>Fecha inicio</th>
            <th>Fecha término</th>
            <th>Área de Conocimiento</th>
            <th>Tipo de Financiamiento</th>
            <th>Tipo de Proyecto</th>
            <th>Tem. Género</th>
            <th>Tem. Jóvenes</th>
            <th>Inv. Básica</th>
            <th>Responsable</th>
            <th>RFC Responsable</th>
            <th>Nómina (R)</th>
            <th>Corresponsable</th>
            <th>RFC Corresp.</th>
            <th>Nómina (C)</th>
          </tr>
        </thead>
        <tbody>
          {proyectos.map((p, i) => (
            <tr key={p.id}>
              <td><input value={p.idDgapa} onChange={e => handleChange(i, 'idDgapa', e.target.value)} /></td>
              <td><input value={p.nombre} onChange={e => handleChange(i, 'nombre', e.target.value)} /></td>
              <td><input type="date" value={p.fechaInicio} onChange={e => handleChange(i, 'fechaInicio', e.target.value)} /></td>
              <td><input type="date" value={p.fechaTermino} onChange={e => handleChange(i, 'fechaTermino', e.target.value)} /></td>
              <td><input value={p.areaConocimiento} onChange={e => handleChange(i, 'areaConocimiento', e.target.value)} /></td>
              <td><input value={p.tipoFinanciamiento} onChange={e => handleChange(i, 'tipoFinanciamiento', e.target.value)} /></td>
              <td><input value={p.tipoProyecto} onChange={e => handleChange(i, 'tipoProyecto', e.target.value)} /></td>
              <td><input type="checkbox" checked={p.genero} onChange={e => handleChange(i, 'genero', e.target.checked)} /></td>
              <td><input type="checkbox" checked={p.jovenes} onChange={e => handleChange(i, 'jovenes', e.target.checked)} /></td>
              <td><input type="checkbox" checked={p.investigacion} onChange={e => handleChange(i, 'investigacion', e.target.checked)} /></td>
              <td><input value={p.responsable} onChange={e => handleChange(i, 'responsable', e.target.value)} /></td>
              <td><input value={p.rfcResponsable} onChange={e => handleChange(i, 'rfcResponsable', e.target.value)} /></td>
              <td>
                <select value={p.nominaResponsable} onChange={e => handleChange(i, 'nominaResponsable', e.target.value)}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td><input value={p.corresponsable} onChange={e => handleChange(i, 'corresponsable', e.target.value)} /></td>
              <td><input value={p.rfcCorresponsable} onChange={e => handleChange(i, 'rfcCorresponsable', e.target.value)} /></td>
              <td>
                <select value={p.nominaCorresponsable} onChange={e => handleChange(i, 'nominaCorresponsable', e.target.value)}>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="proy-botones">
        <button onClick={handleAgregar}>Agregar Fila</button>
        <button onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  )
}
