'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import IndicadoresForm from "../components/IndicadoresForm";

type IndicadoresActionsProps = {
  indicadores: any[];
  indicadorSeleccionado: any;
  setIndicadorSeleccionadoAction: (ind: any) => void;
  datosExcel: any[];
  recargarAction: () => void;
  mostrarSoloInhabilitados: boolean;
  setMostrarSoloInhabilitadosAction: (b: boolean) => void;
};
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

export default function IndicadoresActions({
  indicadores,
  indicadorSeleccionado,
  setIndicadorSeleccionadoAction,
  datosExcel,
  recargarAction,
  mostrarSoloInhabilitados,
  setMostrarSoloInhabilitadosAction
}: IndicadoresActionsProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modo, setModo] = useState<'agregar' | 'modificar' | null>(null);

  // Exporta solo los datos visibles (sin IDs)
  const exportarAExcel = () => {
    if (!datosExcel.length) return alert('No hay indicadores para exportar');
    const worksheet = XLSX.utils.json_to_sheet(datosExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Indicadores');
    XLSX.writeFile(workbook, 'indicadores.xlsx');
  };

  // Modificar
  const modificarIndicador = () => {
    if (!indicadorSeleccionado) return alert('Selecciona un indicador haciendo click en la tabla');
    if (mostrarFormulario && modo === 'modificar') {
    setMostrarFormulario(false);
    setModo(null);
    return;
  }
  setModo('modificar');
  setMostrarFormulario(true);
  //recargarAction();
  };

  // Eliminar
 const eliminarIndicador = async () => {
  if (!indicadorSeleccionado) return alert('Selecciona un indicador haciendo click en la tabla');
  const confirmar = confirm("¿Deseas marcar este indicador como inhabilitado?");
  if (!confirmar) return;
  try {
    const res = await fetch(`http://localhost:3001/indicadores/estado/${indicadorSeleccionado.nid_indicador}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bhabilitado: 0 }),
    });
    if (res.ok) {
      alert("Indicador inhabilitado exitosamente");
      setIndicadorSeleccionadoAction(null);    // Limpia selección
      setMostrarFormulario && setMostrarFormulario(false); // Cierra form si existe
      setModo && setModo(null); // Resetea modo si existe
      //recargarAction(); // Refresca la tabla
    } else {
      alert("Error al inhabilitar (status no OK)");
    }
  } catch (e) {
    alert("Error al inhabilitar: " + e);
  }
};

  // Mostrar formulario para agregar
  const mostrarAgregar = () => {
    setIndicadorSeleccionadoAction(null);
    setModo('agregar');
    setMostrarFormulario(prev => !prev);
    //recargarAction();
  };

  // Al guardar, cierra formulario y recarga
  const handleGuardado = () => {
    setMostrarFormulario(false);
   // recargarAction();
    setIndicadorSeleccionadoAction(null);
  };
  // Al cancelar, cierra formulario
   const handleGuardadoOCancelado = () => {
    setMostrarFormulario(false);
    setIndicadorSeleccionadoAction(null);
   // recargarAction();
  };

return (
  <div style={{ padding: '2px' }}>
    {/* Checkbox para mostrar solo inhabilitados */}
    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
      <label style={{ fontWeight: 600 }}>
        <input
          type="checkbox"
          checked={mostrarSoloInhabilitados}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMostrarSoloInhabilitadosAction(e.target.checked)}
          style={{ marginRight: 6 }}
        />
        Mostrar solo inhabilitados
      </label>
    </div>
    {/* Botones de acciones */}
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '0',
        flexWrap: 'wrap'
      }}
    >
      <button onClick={exportarAExcel} style={{ ...botonEstilo, backgroundColor: '#2E8B57' }}>
        Descargar Excel
      </button>
      <button onClick={mostrarAgregar} style={botonEstilo}
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
    {/* Formulario (solo cuando corresponde) */}
    {mostrarFormulario && (
      <IndicadoresForm
        modo={modo === 'modificar' ? 'modificar' : 'agregar'}
        indicadorInicial={modo === 'modificar' ? indicadorSeleccionado : null}
        onGuardado={handleGuardadoOCancelado}
        onCancelar={handleGuardadoOCancelado}
      />
      
    )}
  </div>
);

}     