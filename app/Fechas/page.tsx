
"use client";
//import ProgPresNumNom from "../components/progPresNumNom";
import IndicadorCard from "../components/Buton";
import './fechas.css';
import React, { useState } from 'react';

interface Periodo {
  inicio: string;
  termino: string;
}

const PeriodoIndicadores: React.FC = () => {
  // Estado para el año seleccionado
  const [anio, setAnio] = useState<string>('2024');
  
  // Estados para los períodos
  const [grises, setGrises] = useState<Periodo>({ inicio: '', termino: '' });
  const [blancos, setBlancos] = useState<Periodo>({ inicio: '', termino: '' });
  
  // Estados para los trimestres
  const [trimestresGrises, setTrimestresGrises] = useState<string[]>(['', '', '', '']);
  const [trimestresBlancos, setTrimestresBlancos] = useState<string[]>(['', '', '', '']);
  
  // Opciones de años
  const anosDisponibles = ['2022', '2023', '2024', '2025', '2026'];
  
  // Manejar cambios en fechas
  const handleFechaChange = (
    tipo: 'grises' | 'blancos', 
    campo: 'inicio' | 'termino',
    valor: string
  ) => {
    if (tipo === 'grises') {
      setGrises({ ...grises, [campo]: valor });
    } else {
      setBlancos({ ...blancos, [campo]: valor });
    }
  };
  
  // Manejar cambios en trimestres
  const handleTrimestreChange = (
    tipo: 'grises' | 'blancos',
    index: number,
    valor: string
  ) => {
    if (tipo === 'grises') {
      const nuevosTrimestres = [...trimestresGrises];
      nuevosTrimestres[index] = valor;
      setTrimestresGrises(nuevosTrimestres);
    } else {
      const nuevosTrimestres = [...trimestresBlancos];
      nuevosTrimestres[index] = valor;
      setTrimestresBlancos(nuevosTrimestres);
    }
  };

  return (
    <div className="periodo-container">
      <div className="header">
        <h1>AÑO</h1>
        <select 
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
          className="anio-select"
        >
          {anosDisponibles.map((ano) => (
            <option key={ano} value={ano}>{ano}</option>
          ))}
        </select>
      </div>
      
      {/* Sección Indicadores Grises */}
      <div className="seccion-indicadores">
        <h2>INDICADORES GRISES</h2>
        
        {/* <div className="fechas-container">
          <div className="fecha-input">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={grises.inicio}
              onChange={(e) => handleFechaChange('grises', 'inicio', e.target.value)}
            />
          </div>
          
          <div className="fecha-input">
            <label>Fecha término</label>
            <input
              type="date"
              value={grises.termino}
              onChange={(e) => handleFechaChange('grises', 'termino', e.target.value)}
            />
          </div>
        </div> */}
        
        <div className="trimestres-container">
          {trimestresGrises.map((trimestre, index) => (
            <div key={`gris-${index}`} className="trimestre-input">
              <label>{['1er', '2do', '3ro', '4to'][index]} Trimestre</label>
              <input
                type="date"
                value={trimestre}
                onChange={(e) => handleTrimestreChange('grises', index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Sección Indicadores Blancos */}
      <div className="seccion-indicadores">
        <h2>INDICADORES BLANCOS</h2>
        
        {/* <div className="fechas-container">
          <div className="fecha-input">
            <label>Fecha Inicio</label>
            <input
              type="date"
              value={blancos.inicio}
              onChange={(e) => handleFechaChange('blancos', 'inicio', e.target.value)}
            />
          </div>
          
          <div className="fecha-input">
            <label>Fecha término</label>
            <input
              type="date"
              value={blancos.termino}
              onChange={(e) => handleFechaChange('blancos', 'termino', e.target.value)}
            />
          </div>
        </div> */}
        
        <div className="trimestres-container">
          {trimestresBlancos.map((trimestre, index) => (
            <div key={`blanco-${index}`} className="trimestre-input">
              <label>{['1er', '2do', '3ro', '4to'][index]} Trimestre</label>
              <input
                type="date"
                value={trimestre}
                onChange={(e) => handleTrimestreChange('blancos', index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="botones-container">
        <button className="boton-guardar">Guardar</button>
        <button className="boton-editar">Editar</button>
      </div>
    </div>
  );
};

export default PeriodoIndicadores;