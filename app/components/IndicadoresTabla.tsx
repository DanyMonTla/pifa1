'use client';
import React, { useEffect, useState } from 'react';

type Frecuencia = { nid_frecuencia: number; cfrecuencia: string; };
type Fuente = { nid_fuente: number; cfuente: string; };
type TipoCalculo = { nid_tipo_calculo: number; ctipo_calculo: string; };
type TipoIndicador = { nid_tipo_indicador: number; ccolor_indicador: string; };

type Indicador = {
  nid_indicador: number;
  cclave_indicador: string;
  cdesc_indicador: string;
  cdefinicion_indicador: string;
  nid_frecuencia: number;
  cfuente: string;
  nid_tipo_calculo: number;
  nid_tipo_indicador: number;
  // ...agrega más campos si quieres
};

const API = {
  frecuencias: 'http://localhost:3001/frecuencia',
  fuentes: 'http://localhost:3001/fuente',
  tiposCalculo: 'http://localhost:3001/tipo-calculo',
  tiposIndicador: 'http://localhost:3001/tipo-indicador',
  indicadores: 'http://localhost:3001/indicadores',
};

export default function IndicadoresTabla() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<TipoCalculo[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<TipoIndicador[]>([]);

  // Carga de catálogos y lista
  useEffect(() => { fetch(API.indicadores).then(r => r.json()).then(setIndicadores); }, []);
  useEffect(() => { fetch(API.frecuencias).then(r => r.json()).then(setFrecuencias); }, []);
  useEffect(() => { fetch(API.tiposCalculo).then(r => r.json()).then(setTiposCalculo); }, []);
  useEffect(() => { fetch(API.tiposIndicador).then(r => r.json()).then(setTiposIndicador); }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2>Indicadores registrados</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead style={{ background: '#003B5C', color: '#fff' }}>
          <tr>
            <th>ID</th>
            <th>Clave</th>
            <th>Descripción</th>
            <th>Definición</th>
            <th>Frecuencia</th>
            <th>Fuente</th>
            <th>Tipo Cálculo</th>
            <th>Tipo Indicador</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(indicadores) && indicadores.map(ind => (
    <tr key={ind.nid_indicador}>
      <td>{ind.nid_indicador}</td>
      <td>{ind.cclave_indicador}</td>
      <td>{ind.cdesc_indicador}</td>
      <td>{ind.cdefinicion_indicador}</td>
<td>
  {Array.isArray(frecuencias)
    ? (frecuencias.find(f => f.nid_frecuencia === ind.nid_frecuencia)?.cfrecuencia ?? ind.nid_frecuencia)
    : ind.nid_frecuencia}
</td>
      <td>{ind.cfuente}</td>
      <td>{tiposCalculo.find(tc => tc.nid_tipo_calculo === ind.nid_tipo_calculo)?.ctipo_calculo ?? ind.nid_tipo_calculo}</td>
      <td>{tiposIndicador.find(ti => ti.nid_tipo_indicador === ind.nid_tipo_indicador)?.ccolor_indicador ?? ind.nid_tipo_indicador}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}
