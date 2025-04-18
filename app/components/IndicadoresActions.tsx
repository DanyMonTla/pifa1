'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import IndicadoresForm from "../components/IndicadoresForm";

const indicadoresEjemplo = [
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

export default function IndicadoresActions() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const exportarAExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(indicadoresEjemplo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Indicadores');
    XLSX.writeFile(workbook, 'indicadores.xlsx');
  };

  return (
    <div style={{ padding: '2px' }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '0',
        flexWrap: 'wrap'
      }}>
        {/* ✅ Botón verde a la izquierda */}
        <button
          onClick={exportarAExcel}
          style={{ ...botonEstilo, backgroundColor: '#2E8B57' }}
        >
          Descargar Excel
        </button>

        <button
          onClick={() => setMostrarFormulario(prev => !prev)}
          style={botonEstilo}
        >
          {mostrarFormulario ? 'Ocultar formulario' : 'Agregar Indicador'}
        </button>

        <button style={botonEstilo}>
          Modificar Indicador
        </button>

        <button style={{ ...botonEstilo, backgroundColor: '#8B0000' }}>
          Eliminar Indicador
        </button>
      </div>

      {mostrarFormulario && <IndicadoresForm />}
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  padding: '0.75rem ',
  backgroundColor: '#003B5C',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem'
};
