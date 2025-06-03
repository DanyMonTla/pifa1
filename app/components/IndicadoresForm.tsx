'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

// Tipos para cada catálogo
type Frecuencia = { nid_frecuencia: number; cfrecuencia: string; };
type Fuente = { nid_fuente: number; cfuente: string; };
type TipoCalculo = { nid_tipo_calculo: number; ctipo_calculo: string; };
type TipoIndicador = { nid_tipo_indicador: number; ccolor_indicador: string; };

// Formulario tipo
interface IndicadorForm {
  cclave_indicador: string;
  cdesc_indicador: string;
  cdefinicion_indicador: string;
  nid_frecuencia?: number;
  cfuente?: string;
  nid_tipo_calculo?: number;
  nid_tipo_indicador?: number;
}


const API = {
  frecuencias: 'http://localhost:3001/frecuencias',
  fuentes: 'http://localhost:3001/fuentes',
  tiposCalculo: 'http://localhost:3001/tipo-calculo',
  tiposIndicador: 'http://localhost:3001/tipo-indicador',
  indicadores: 'http://localhost:3001/indicadores',
};


// Función robusta para obtener arrays desde distintos formatos
function extraeLista<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export default function IndicadoresForm({
  onNuevo,
  modo,
  indicadorInicial
}: {
  onNuevo?: () => void;
  modo?: 'agregar' | 'modificar';
  indicadorInicial?: any; // puedes definir un tipo más estricto si lo tienes
}) {
  const [form, setForm] = useState<IndicadorForm>({
    cclave_indicador: '',
    cdesc_indicador: '',
    cdefinicion_indicador: '',
    nid_frecuencia: undefined,
    cfuente: "",
    nid_tipo_calculo: undefined,
    nid_tipo_indicador: undefined,
  });
// Nuevo estado para la fuente seleccionada (usando ID para el submit)
const [fuenteSeleccionada, setFuenteSeleccionada] = useState<{value: number, label: string} | null>(null);

  const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<TipoCalculo[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<TipoIndicador[]>([]);
// Convierte tus fuentes para react-select
const opcionesFuente = fuentes.map(f => ({
  value: f.nid_fuente,
  label: f.cfuente,
}));

  // Carga de catálogos: extrae arrays de cualquier formato de respuesta
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

  fetch(API.fuentes)
    .then(r => r.json())
    .then(data => {
      console.log('Respuesta de /fuente:', data); // <-- AGREGA ESTA LÍNEA
      setFuentes(extraeLista<Fuente>(data));
    });
}, []);
 

  // Manejador de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.startsWith('nid_') && value !== '' ? Number(value) : value,
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: Record<string, any> = { ...form };
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
      const res = await fetch(API.indicadores, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert('Indicador registrado');
        setForm({
          cclave_indicador: '',
          cdesc_indicador: '',
          cdefinicion_indicador: '',
          nid_frecuencia: undefined,
          cfuente: undefined,
          nid_tipo_calculo: undefined,
          nid_tipo_indicador: undefined,
        });
        if (onNuevo) onNuevo();
      } else {
        alert('Error al registrar');
      }
    } catch (e) {
      alert('Error al enviar: ' + e);
    }
  };
const handleFuenteChange = (opcion: any) => {
  setFuenteSeleccionada(opcion);
  setForm(prev => ({
    ...prev,
    nid_fuente: opcion ? opcion.value : undefined,
  }));
};
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.4rem',
    backgroundColor: '#A57E22',
    color: '#000000',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '0.95rem',
    marginBottom: '0.5rem'
  };

  return (
    <form
  onSubmit={handleSubmit}
  style={{
    maxWidth: 600,
    margin: '2rem auto',
    background: '#fff',
    padding: '2.5rem 2rem 2rem 2rem',
    borderRadius: 16,
    boxShadow: '0 4px 24px #003B5C33',
    border: '1.5px solid #003B5C'
  }}
>
  <h2 style={{ textAlign: 'center', color: '#003B5C', marginBottom: '2rem', letterSpacing: 1, fontWeight: 900 }}>
    Registrar nuevo indicador
  </h2>

  <div style={{ display: 'flex', gap: '1.2rem', marginBottom: 16 }}>
    <input
      style={{
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="cclave_indicador"
      placeholder="Clave"
      value={form.cclave_indicador}
      onChange={handleChange}
      required
    />
    <input
      style={{
        flex: 2,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="cdesc_indicador"
      placeholder="Descripción"
      value={form.cdesc_indicador}
      onChange={handleChange}
      required
    />
  </div>

  <div style={{ marginBottom: 16 }}>
    <textarea
      style={{
        width: '100%',
        minHeight: 50,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="cdefinicion_indicador"
      placeholder="Definición"
      value={form.cdefinicion_indicador}
      onChange={handleChange}
      required
    />
  </div>

  
    <select
      style={{
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="nid_frecuencia"
      value={form.nid_frecuencia ?? ''}
      onChange={handleChange}
      required
    >
      <option value="">-- Selecciona frecuencia --</option>
      {frecuencias.map(f => (
        <option key={f.nid_frecuencia} value={f.nid_frecuencia}>
          {f.cfrecuencia}
        </option>
      ))}
    </select>

  <input
  style={{ width: '100%', padding: '0.7rem', borderRadius: 8, marginBottom: 16, border: '1.5px solid #003B5C99' }}
  name="cfuente"
  placeholder="Fuente"
  value={form.cfuente || ""}
  onChange={handleChange}
  required
/>



  <div style={{ display: 'flex', gap: '1.2rem', marginBottom: 20 }}>
    <select
      style={{
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="nid_tipo_calculo"
      value={form.nid_tipo_calculo ?? ''}
      onChange={handleChange}
      required
    >
      <option value="">-- Selecciona tipo cálculo --</option>
      {tiposCalculo.map(tc => (
        <option key={tc.nid_tipo_calculo} value={tc.nid_tipo_calculo}>
          {tc.ctipo_calculo}
        </option>
      ))}
    </select>
    <select
      style={{
        flex: 1,
        padding: '0.7rem',
        backgroundColor: '#f7fafc',
        color: '#222',
        border: '1.5px solid #003B5C99',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 500
      }}
      name="nid_tipo_indicador"
      value={form.nid_tipo_indicador ?? ''}
      onChange={handleChange}
      required
    >
      <option value="">-- Selecciona tipo indicador --</option>
      {tiposIndicador.map(ti => (
        <option key={ti.nid_tipo_indicador} value={ti.nid_tipo_indicador}>
          {ti.ccolor_indicador}
        </option>
      ))}
    </select>
  </div>

  <button
    type="submit"
    style={{
      width: '100%',
      padding: '0.8rem',
      background: '#003B5C',
      color: '#fff',
      fontWeight: 700,
      borderRadius: 8,
      fontSize: '1.08rem',
      border: 'none',
      letterSpacing: 1,
      boxShadow: '0 2px 8px #003b5c20',
      transition: 'background 0.2s'
    }}
  >
    Guardar indicador
  </button>
</form>

  );
}
