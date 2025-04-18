'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';

interface Indicador {
  clave_indicador: string;
  indicador_descricpion: string;
  definicion: string;
  frecuencia: string;
  fuente: string;
  id_indicador: number;
  id_proyecto_inves?: number;
  id_act_programa?: number;
  id_act_cedetec?: number;
  id_act_cultral?: number;
}
const exportarAExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(indicadoresEjemplo);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Indicadores');
  XLSX.writeFile(workbook, 'indicadores.xlsx');
};
<button
  onClick={exportarAExcel}
  style={{
    marginBottom: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#2E8B57',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  Descargar Excel
</button>


const indicadoresEjemplo: Indicador[] = [
  {
    clave_indicador: 'A.1.1',
    indicador_descricpion: 'Tasa de graduación',
    definicion: 'Porcentaje de alumnos que concluyen en tiempo',
    frecuencia: 'Anual',
    fuente: 'Sistema Escolar',
    id_indicador: 1,
    id_proyecto_inves: 10,
    id_act_programa: 5
  },
  {
    clave_indicador: 'A.3.2',
    indicador_descricpion: 'Participación en eventos culturales',
    definicion: 'Número de alumnos que asisten a eventos culturales',
    frecuencia: 'Semestral',
    fuente: 'Departamento de Cultura',
    id_indicador: 2,
    id_act_cultral: 8
  }
];

// Columnas disponibles con sus llaves
const columnasIniciales = [
  { key: 'clave_indicador', label: 'Clave' },
  { key: 'indicador_descricpion', label: 'Descripción' },
  { key: 'definicion', label: 'Definición' },
  { key: 'frecuencia', label: 'Frecuencia' },
  { key: 'fuente', label: 'Fuente' },
  { key: 'id_indicador', label: 'ID' },
  { key: 'id_proyecto_inves', label: 'Proyecto' },
  { key: 'id_act_programa', label: 'Programa' },
  { key: 'id_act_cedetec', label: 'Cedetec' },
  { key: 'id_act_cultral', label: 'Cultural' }
];

export default function IndicadoresTabla() {
  const [columnas, setColumnas] = useState(columnasIniciales);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const moverColumna = (fromIndex: number, toIndex: number) => {
    const actualizadas = [...columnas];
    const [moved] = actualizadas.splice(fromIndex, 1);
    actualizadas.splice(toIndex, 0, moved);
    setColumnas(actualizadas);
  };

  const toggleSeleccion = (id: number) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ overflowX: 'auto', margin: '2rem auto', maxWidth: '95%' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        color: '#000',
        fontSize: '0.95rem'
      }}>
        <thead style={{ backgroundColor: '#003B5C', color: '#fff' }}>
          <tr>
            <th style={th}>✔</th>
            {columnas.map((col, idx) => (
              <th
                key={col.key}
                draggable
                onDragStart={e => e.dataTransfer.setData('colIndex', idx.toString())}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const from = parseInt(e.dataTransfer.getData('colIndex'));
                  moverColumna(from, idx);
                }}
                style={th}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indicadoresEjemplo.map((ind) => (
            <tr key={ind.id_indicador}>
              <td style={td}>
                <input
                  type="checkbox"
                  checked={seleccionados.includes(ind.id_indicador)}
                  onChange={() => toggleSeleccion(ind.id_indicador)}
                />
              </td>
              {columnas.map(col => (
                <td key={col.key} style={td}>
                  {((ind as any)[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '0.6rem',
  border: '1px solid #ccc',
  textAlign: 'left',
  cursor: 'move'
};

const td: React.CSSProperties = {
  padding: '0.1rem',
  border: '1px solid #ccc'
};