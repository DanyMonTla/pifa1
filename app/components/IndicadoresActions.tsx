'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import IndicadoresForm from "../components/IndicadoresForm";

const indicadoresEjemplo = [
  {
    nid_indicador: 1,
    cclave_indicador: 'A.1.1',
    cdesc_indicador: 'Tasa de graduación',
    cdefinicion_indicador: 'Porcentaje de alumnos que concluyen en tiempo',
    cfuente: 'Sistema Escolar',
    nid_frecuencia: 1,
    nid_tipo_calculo: 1,
    nid_tipo_indicador: 1,
    bhabilitado: 1
  },
  {
    nid_indicador: 2,
    cclave_indicador: 'A.3.2',
    cdesc_indicador: 'Participación en eventos culturales',
    cdefinicion_indicador: 'Número de alumnos que asisten a eventos culturales',
    cfuente: 'Departamento de Cultura',
    nid_frecuencia: 2,
    nid_tipo_calculo: 1,
    nid_tipo_indicador: 2,
    bhabilitado: 1
  }
];

export default function IndicadoresActions() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modo, setModo] = useState<'agregar' | 'modificar' | null>(null);
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState<any>(null);

  const exportarAExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(indicadoresEjemplo);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Indicadores');
    XLSX.writeFile(workbook, 'indicadores.xlsx');
  };

  const modificarIndicador = () => {
    // Simulamos que se selecciona el primer indicador
    setIndicadorSeleccionado(indicadoresEjemplo[0]);
    setModo('modificar');
    setMostrarFormulario(true);
  };

  const eliminarIndicador = async () => {
    const confirmar = confirm("¿Deseas marcar este indicador como inhabilitado?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3001/indicadores/estado/${indicadoresEjemplo[0].nid_indicador}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bhabilitado: 0 }),
      });
      alert("Indicador inhabilitado exitosamente");
    } catch (e) {
      alert("Error al inhabilitar");
    }
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
        <button onClick={exportarAExcel} style={{ ...botonEstilo, backgroundColor: '#2E8B57' }}>
          Descargar Excel
        </button>

        <button
          onClick={() => {
            setIndicadorSeleccionado(null);
            setModo('agregar');
            setMostrarFormulario(prev => !prev);
          }}
          style={botonEstilo}
        >
          {mostrarFormulario && modo === 'agregar' ? 'Ocultar formulario' : 'Agregar Indicador'}
        </button>

        <button onClick={modificarIndicador} style={botonEstilo}>
          Modificar Indicador
        </button>

        <button onClick={eliminarIndicador} style={{ ...botonEstilo, backgroundColor: '#8B0000' }}>
          Eliminar Indicador
        </button>
      </div>

      {mostrarFormulario && (
        <IndicadoresForm
          modo={modo}
          indicadorInicial={indicadorSeleccionado}
        />
      )}
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  padding: '0.75rem',
  backgroundColor: '#003B5C',
  color: '#fff',
  fontWeight: 'bold',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem'
};
