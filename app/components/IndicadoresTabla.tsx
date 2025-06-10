'use client';
import React, { useEffect, useState, useRef } from 'react';

type Frecuencia = { nid_frecuencia: number; cfrecuencia: string; };
type TipoCalculo = { nid_tipo_calculo: number; ctipo_calculo: string; };
type TipoIndicador = { nid_tipo_indicador: number; ccolor_indicador: string; };
type Clasificacion = { nid_clasificacion: number; cnombre_clasificacion: string; };

type IndicadoresTablaProps = {
  indicadores: any[];
  onSeleccionarAction: (ind: any) => void;
  setDatosExcelAction: (datos: any[]) => void;
  indicadorSeleccionado: any;
  mostrarSoloInhabilitados: boolean;
};

const defaultColumns = [
  { key: "cclave_indicador", label: "Clave", width: 110 },
  { key: "cdesc_indicador", label: "Descripción", width: 140 },
  { key: "cdefinicion_indicador", label: "Definición", width: 220 },
  { key: "clasificacion", label: "Clasificación", width: 120 },
  { key: "frecuencia", label: "Frecuencia", width: 120 },
  { key: "cfuente", label: "Fuente", width: 100 },
  { key: "tipo_calculo", label: "Tipo Cálculo", width: 120 },
  { key: "tipo_indicador", label: "Tipo Indicador", width: 130 },
  { key: "bhabilitado", label: "Eliminado", width: 110 },
];

const API = {
  frecuencias: 'http://localhost:3001/frecuencias',
  tiposCalculo: 'http://localhost:3001/tipo-calculo',
  tiposIndicador: 'http://localhost:3001/tipo-indicador',
  clasificaciones: 'http://localhost:3001/clasificacion',
};

function extraeLista<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export default function IndicadoresTabla({
  indicadores,
  onSeleccionarAction,
  setDatosExcelAction,
  indicadorSeleccionado,
  mostrarSoloInhabilitados
}: IndicadoresTablaProps) {
  // Catálogos
  const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<TipoCalculo[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<TipoIndicador[]>([]);
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);

  // Columnas y filtros
  const [columns] = useState(defaultColumns);
  const [columnWidths, setColumnWidths] = useState<{ [k: string]: number }>(
    Object.fromEntries(defaultColumns.map(c => [c.key, c.width]))
  );
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{ [k: string]: string }>({});

  // Cargar catálogos
  useEffect(() => {
    fetch(API.tiposCalculo)
      .then(r => r.json())
      .then(data => setTiposCalculo(extraeLista<TipoCalculo>(data)));
    fetch(API.tiposIndicador)
      .then(r => r.json())
      .then(data => setTiposIndicador(extraeLista<TipoIndicador>(data)));
    fetch(API.frecuencias)
      .then(r => r.json())
      .then(data => setFrecuencias(extraeLista<Frecuencia>(data)));
    fetch(API.clasificaciones)
      .then(r => r.json())
      .then(data => setClasificaciones(extraeLista<Clasificacion>(data)));
  }, []);

  // Resize columnas
  const resizingCol = useRef<string | null>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleResizeMouseDown = (colKey: string, e: React.MouseEvent<HTMLDivElement>) => {
    resizingCol.current = colKey;
    startX.current = e.clientX;
    startWidth.current = columnWidths[colKey];
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingCol.current) return;
    const diff = e.clientX - startX.current;
    setColumnWidths(widths => ({
      ...widths,
      [resizingCol.current!]: Math.max(70, startWidth.current + diff)
    }));
  };

  const handleMouseUp = () => {
    resizingCol.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Filtros y valores de columna
  const getColValue = (ind: any, key: string) => {
    if (key === "bhabilitado")
    return ind.bhabilitado ? "No" : "Sí"; // O muestra un ícono/check/cross
    if (key === "clasificacion")
      return clasificaciones.find(c => c.nid_clasificacion === ind.nid_clasificacion)?.cnombre_clasificacion ?? "";
    if (key === "frecuencia")
      return frecuencias.find(f => Number(f.nid_frecuencia) === Number(ind.nid_frecuencia))?.cfrecuencia ?? "";
    if (key === "tipo_calculo")
      return tiposCalculo.find(tc => tc.nid_tipo_calculo === ind.nid_tipo_calculo)?.ctipo_calculo ?? "";
    if (key === "tipo_indicador")
      return tiposIndicador.find(ti => ti.nid_tipo_indicador === ind.nid_tipo_indicador)?.ccolor_indicador ?? "";
    return (ind as any)[key] ?? "";
  };

  // Filtrado
  const indicadoresFiltrados = mostrarSoloInhabilitados
  ? indicadores.filter(ind => ind.bhabilitado === 0)
  : indicadores.filter(ind => ind.bhabilitado !== 0); // <--- SOLO los activos por default


 // Filtrado de indicadores
const filteredIndicadores = indicadoresFiltrados.filter(ind =>
  columns.every(col =>
    !filters[col.key] ||
    String(getColValue(ind, col.key)).toLowerCase().includes(filters[col.key].toLowerCase())
  )
);
  // Exportación: mapea los datos visibles (sin IDs)
useEffect(() => {
  console.log('USEEFFECT: Exportando datos limpios');
  const datosLimpios = filteredIndicadores.map(ind => ({
    Clave: ind.cclave_indicador,
    Descripción: ind.cdesc_indicador,
    Definición: ind.cdefinicion_indicador,
    Clasificación: getColValue(ind, 'clasificacion'),
    Frecuencia: getColValue(ind, 'frecuencia'),
    Fuente: ind.cfuente,
    "Tipo Cálculo": getColValue(ind, 'tipo_calculo'),
    "Tipo Indicador": getColValue(ind, 'tipo_indicador'),
  }));
  setDatosExcelAction(datosLimpios);
}, [
  filteredIndicadores,
  clasificaciones,
  frecuencias,
  tiposCalculo,
  tiposIndicador,
]);


  // Estilos
  const thtdStyle: React.CSSProperties = {
    border: '1px solid #d0d0d0',
    padding: '0.5rem',
    textAlign: 'left',
    background: '#f7fafc'
  };

  // Render tabla
  return (
    <div style={{ maxWidth: 1200, margin: '2rem auto' }}>
      <h2>Indicadores registrados</h2>
      <button
        onClick={() => setShowFilters(f => !f)}
        style={{
          marginBottom: 10,
          background: '#003B5C',
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          padding: '8px 18px',
          borderRadius: 8,
          fontSize: '1rem'
        }}
      >
        Filtros
      </button>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff',  tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
               style={{
                ...thtdStyle,
                width: `${columnWidths[col.key]}px`,      // Siempre en px
                minWidth: `${columnWidths[col.key]}px`,   // Siempre en px
                maxWidth: `${columnWidths[col.key]}px`,   // Opcional, para forzar
                position: 'relative',
                background: '#003B5C',
                color: '#fff'
              }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ flex: 1 }}>{col.label}</span>
                  <div
                    onMouseDown={e => handleResizeMouseDown(col.key, e)}
                    style={{
                      width: 8,
                      height: "100%",
                      cursor: "col-resize",
                      position: "absolute",
                      right: 0,
                      top: 0,
                      zIndex: 2,
                      background: "#fff6"
                    }}
                  />
                </div>
              </th>
            ))}
          </tr>
          {showFilters && (
            <tr>
              {columns.map(col => (
                <th key={col.key} style={thtdStyle}>
                  <input
                    type="text"
                    placeholder={`Filtrar ${col.label}`}
                    value={filters[col.key] || ""}
                    onChange={e =>
                      setFilters(f => ({ ...f, [col.key]: e.target.value }))
                    }
                    style={{
                      width: "95%",
                      fontSize: 13,
                      padding: 2,
                      margin: 1,
                    }}
                  />
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
        {filteredIndicadores.map(ind => (
          <tr
            key={ind.nid_indicador}
            style={{
              cursor: "pointer",
              background: indicadorSeleccionado && indicadorSeleccionado.nid_indicador === ind.nid_indicador
                ? "#ffe082"
                : ""
            }}
            onClick={() => onSeleccionarAction(ind)}
          >
            {columns.map(col => (
              <td key={col.key} style={thtdStyle}>
                {getColValue(ind, col.key)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      </table>
    </div>
  );
}
