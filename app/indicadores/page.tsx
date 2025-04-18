"use client";

import React from "react";
import ProgPresNumNomComponent from "../components/ProgPresNumNom";
import IndicadorCard from "../components/Buton";
import IndicadoresForm from "../components/IndicadoresForm";
import IndicadoresActions from '../components/IndicadoresActions';
import IndicadoresTabla from "../components/IndicadoresTabla";


export default function IndicadoresPage() {
    return (
      <div className="ProgPresNumNom" style={{ paddingTop: 0, marginTop: 0 }}>
        <IndicadoresActions />
         <IndicadoresTabla />
      </div>
    );
}
