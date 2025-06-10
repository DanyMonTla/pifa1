'use client'

import React, { useState, useEffect } from 'react'

interface Indicador {
  id: number
  nombre: string
}

interface Segmentacion {
  id: number
  nombre: string
}

export default function SegmentadosPage() {
  // Simulación de datos. Aquí debes traerlos desde tu API o DB real.
  const [indicadores, setIndicadores] = useState<Indicador[]>([])
  const [segmentaciones, setSegmentaciones] = useState<Segmentacion[]>([])

  const [nidIndicador, setNidIndicador] = useState<number>(0)
  const [nidSegmentacion, setNidSegmentacion] = useState<number>(0)
  const [bHabilitado, setBHabilitado] = useState(true)
  const [dFechaBaja, setDFechaBaja] = useState<string>('')

  useEffect(() => {
    // Aquí irían tus llamadas reales a la API
    setIndicadores([
      { id: 1, nombre: 'Cursos de lenguas extranjeras impartidos' },
      { id: 2, nombre: 'Alumnos atendidos en cursos y talleres extracurriculares e intersemestrales' },
      { id: 3, nombre: 'Personal académico de otras IES nacionales en programas de movilidad académica de la entidad' },
      { id: 4, nombre: 'Personal académico participante en programas de movilidad académica con otras IES nacionales' }
    ])
    setSegmentaciones([
     { id: 1, nombre: 'Hombres' },
  { id: 2, nombre: 'Mujeres' },
  { id: 3, nombre: 'Presencial' },
  { id: 4, nombre: 'A distancia/digital' },
  { id: 5, nombre: 'Asociadas a proyectos' },
  { id: 6, nombre: 'No asociadas a proyectos' },
  { id: 7, nombre: 'Nacional' },
  { id: 8, nombre: 'Internacional' },
  { id: 9, nombre: 'Con perspectiva de género' },
  { id: 10, nombre: 'Sin perspectiva de género' }
    ])
  }, [])

  const handleGuardar = () => {
    const datos = {
      nidIndicador,
      nidSegmentacion,
      bHabilitado,
      dFechaAlta: new Date().toISOString(),
      dFechaBaja: bHabilitado ? null : dFechaBaja
    }

    console.log('Datos a guardar:', datos)
    // Aquí llamarías a tu API o backend con fetch/axios
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Registrar Indicador Segmentado</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Indicador:</label>
        <select
          value={nidIndicador}
          onChange={(e) => setNidIndicador(Number(e.target.value))}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Seleccione un indicador</option>
          {indicadores.map((indi) => (
            <option key={indi.id} value={indi.id}>
              {indi.nombre}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Segmentación:</label>
        <select
          value={nidSegmentacion}
          onChange={(e) => setNidSegmentacion(Number(e.target.value))}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="">Seleccione una segmentación</option>
          {segmentaciones.map((seg) => (
            <option key={seg.id} value={seg.id}>
              {seg.nombre}
            </option>
          ))}
        </select>
      </div>

  <div style={{ marginBottom: '1rem' }}>
    <input
      type="checkbox"
      checked={bHabilitado}
      onChange={(e) => setBHabilitado(e.target.checked)}
      id="habilitado"
    />
    <label htmlFor="habilitado">Habilitado</label>
  </div>

      {!bHabilitado && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Fecha de baja:</label>
          <input
            type="date"
            value={dFechaBaja}
            onChange={(e) => setDFechaBaja(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      )}

      <button onClick={handleGuardar} style={botonEstilo}>
        Guardar
      </button>
    </div>
  )
}

const botonEstilo: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#003B5C',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
}
