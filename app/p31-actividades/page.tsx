'use client'

import React, { useState } from 'react'
import './p31.css'

interface Actividad {
  id: number
  nombre: string
  tipo: string
  asociada: 'Sí' | 'No'
  modalidad: 'Presencial' | 'A distancia' | 'Mixta'
  fechaInicio: string
  fechaTermino: string
}

export default function P31ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([])

  const handleAgregar = () => {
    setActividades([
      ...actividades,
      {
        id: actividades.length + 1,
        nombre: '',
        tipo: '',
        asociada: 'No',
        modalidad: 'Presencial',
        fechaInicio: '',
        fechaTermino: ''
      }
    ])
  }

  const handleChange = (index: number, campo: keyof Actividad, valor: string) => {
    const copia = [...actividades]
    copia[index][campo] = valor
    setActividades(copia)
  }

  const handleGuardar = () => {
    console.log('Actividades registradas:', actividades)
    // Aquí conectarías con API/backend si es necesario
  }

  return (
    <div className="p31-container">
      <h2>Programa 31 - Actividades Académicas</h2>
      <table className="p31-tabla">
        <thead>
          <tr>
            <th>NP</th>
            <th>Nombre de la actividad</th>
            <th>Tipo de actividad</th>
            <th>Asociada a proyecto</th>
            <th>Modalidad</th>
            <th>Fecha de inicio</th>
            <th>Fecha de término</th>
          </tr>
        </thead>
        <tbody>
          {actividades.map((act, index) => (
            <tr key={act.id}>
              <td>{act.id}</td>
              <td>
                <input
                  type="text"
                  value={act.nombre}
                  onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={act.tipo}
                  onChange={(e) => handleChange(index, 'tipo', e.target.value)}
                />
              </td>
              <td>
                <select
                  value={act.asociada}
                  onChange={(e) => handleChange(index, 'asociada', e.target.value)}
                >
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </td>
              <td>
                <select
                  value={act.modalidad}
                  onChange={(e) => handleChange(index, 'modalidad', e.target.value)}
                >
                  <option value="Presencial">Presencial</option>
                  <option value="A distancia">A distancia</option>
                  <option value="Mixta">Mixta</option>
                </select>
              </td>
              <td>
                <input
                  type="date"
                  value={act.fechaInicio}
                  onChange={(e) => handleChange(index, 'fechaInicio', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={act.fechaTermino}
                  onChange={(e) => handleChange(index, 'fechaTermino', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p31-botones">
        <button onClick={handleAgregar}>Agregar fila</button>
        <button onClick={handleGuardar}>Guardar</button>
      </div>
    </div>
  )
}
