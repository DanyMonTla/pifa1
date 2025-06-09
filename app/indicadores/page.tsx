"use client";


import React, { useState, useEffect } from "react";
import ProgPresNumNomComponent from "../components/ProgPresNumNom";
import IndicadorCard from "../components/Buton";
import IndicadoresForm from "../components/IndicadoresForm";
import IndicadoresActions from '../components/IndicadoresActions';
import IndicadoresTabla from "../components/IndicadoresTabla";


export default function IndicadoresPage() {
  const [indicadores, setIndicadores] = useState([]);
  const [actualizar, setActualizar] = useState(0);
  const [mostrarSoloInhabilitados, setMostrarSoloInhabilitados] = useState(false);
  const recargarAction = () => setActualizar(a => a + 1);
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState(null);
  const [datosExcel, setDatosExcel] = useState<any[]>([]);
  const cargarIndicadores = async () => {
  try {
    const res = await fetch("http://localhost:3001/indicadores");
    const data = await res.json();
    const indicadoresLimpios = (Array.isArray(data) ? data : (data.data || data.result || data.items || [])).map((ind: { bhabilitado: { data: any[]; } | null; }) => ({
      ...ind,
      // Convierte bhabilitado de Buffer a número, si aplica:
      bhabilitado: typeof ind.bhabilitado === 'object' && ind.bhabilitado !== null
        ? ind.bhabilitado.data?.[0] ?? 0
        : ind.bhabilitado
    }));
    setIndicadores(indicadoresLimpios);
  } catch (e) {
    setIndicadores([]);
  }
};

  
  // Cargar indicadores al iniciar
  useEffect(() => { cargarIndicadores(); }, [actualizar]);
    
  return (
  <div className="ProgPresNumNom" style={{ paddingTop: 0, marginTop: 0 }}>
    <IndicadoresActions
      indicadores={indicadores}
      indicadorSeleccionado={indicadorSeleccionado}
      setIndicadorSeleccionadoAction={setIndicadorSeleccionado}
      datosExcel={datosExcel}
      recargarAction={() => setActualizar(a => a + 1)}
      mostrarSoloInhabilitados={mostrarSoloInhabilitados}
      setMostrarSoloInhabilitadosAction={setMostrarSoloInhabilitados}
    />
    <IndicadoresTabla
      setDatosExcelAction={setDatosExcel}
      indicadores={indicadores}
      onSeleccionarAction={setIndicadorSeleccionado}
      indicadorSeleccionado={indicadorSeleccionado}
      mostrarSoloInhabilitados={mostrarSoloInhabilitados}
    />
  </div>
);
}

