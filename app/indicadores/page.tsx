
"use client";
import React from "react";
import ProgPresNumNom from "../components/progPresNumNom";
import IndicadorCard from "../components/Buton";
interface ProgPresNumNom {
  content: string;
}





export default function IndicadoresPage() {
    return (
      <div className="ProgPresNumNom">
        <h1>Página de Indicadores</h1>
        
        <IndicadorCard
        numero={10}
        texto="Educación de Licenciatura presencial"
      />
      <p>INDICADORES BLANCOS</p>
        
        <ProgPresNumNom content="¡Hola desde el prog pres nu!" />
      </div>
    );
  }
  