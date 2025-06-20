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
  type Indicador = {
    nid_indicador: number;
    [key: string]: any;
  };
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState<Indicador | null>(null);
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
    
  const seleccionarIndicador = (ind: any) => {
  setIndicadorSeleccionado(ind);
  console.log("✅ Indicador seleccionado:", ind);
};



  return (
  <div className="ProgPresNumNom" style={{ paddingTop: 0, marginTop: 0 }}>
    <IndicadoresActions
        indicadores={indicadores}
        indicadorSeleccionado={indicadorSeleccionado}
        setIndicadorSeleccionadoAction={setIndicadorSeleccionado}
        datosExcel={datosExcel}
        //recargarAction={() => setActualizar(a => a + 1)}
        recargarAction={recargarAction} // <-- ESTA ES LA BUENA
        mostrarSoloInhabilitados={mostrarSoloInhabilitados}
        setMostrarSoloInhabilitadosAction={setMostrarSoloInhabilitados}
      />
    <IndicadoresTabla
      setDatosExcelAction={setDatosExcel}
      indicadores={indicadores}
      onSeleccionarAction={seleccionarIndicador} // ✅ usa la función definida arriba
      indicadorSeleccionado={indicadorSeleccionado}
      mostrarSoloInhabilitados={mostrarSoloInhabilitados}
    />
  </div>
);
}

