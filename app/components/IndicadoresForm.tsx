'use client';
import React, { useState, useEffect } from 'react';

<<<<<<< Updated upstream
export default function IndicadoresForm() {
  const [formData, setFormData] = useState({
    clave_indicador: '',
    indicador_descripcion: '',
    definicion: '',
    frecuencia: '',
    fuente: '',
    id_indicador: '',
    id_proyecto_inves: '',
    id_act_programa: '',
    id_act_cedetec: '',
    id_act_cultural: '',
  });
=======
// Tipos para cada catálogo
type Frecuencia = { nid_frecuencia: number; cfrecuencia: string; };
type Fuente = { nid_fuente: number; cfuente: string; };
type TipoCalculo = { nid_tipo_calculo: number; ctipo_calculo: string; };
type TipoIndicador = { nid_tipo_indicador: number; ccolor_indicador: string; };
>>>>>>> Stashed changes

// Formulario tipo
interface IndicadorForm {
  cclave_indicador: string;
  cdesc_indicador: string;
  cdefinicion_indicador: string;
  nid_frecuencia?: number;
  nid_fuente?: number;
  nid_tipo_calculo?: number;
  nid_tipo_indicador?: number;
}

const API = {
  frecuencias: 'http://localhost:3001/frecuencia',
  fuentes: 'http://localhost:3001/fuente',
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

export default function IndicadoresForm({ onNuevo }: { onNuevo?: () => void }) {
  const [form, setForm] = useState<IndicadorForm>({
    cclave_indicador: '',
    cdesc_indicador: '',
    cdefinicion_indicador: '',
    nid_frecuencia: undefined,
    nid_fuente: undefined,
    nid_tipo_calculo: undefined,
    nid_tipo_indicador: undefined,
  });

  const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<TipoCalculo[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<TipoIndicador[]>([]);

  // Carga de catálogos: extrae arrays de cualquier formato de respuesta
  useEffect(() => {
    fetch(API.frecuencias)
    .then(r => r.json())
    .then(data => {
      const arr = Array.isArray(data) ? data :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.result) ? data.result :
        Array.isArray(data.items) ? data.items : [];
      setFrecuencias(arr);
      console.log('Frecuencias cargadas:', arr);});
    fetch(API.fuentes)
      .then(r => r.json())
      .then(data => setFuentes(extraeLista<Fuente>(data)));
    fetch(API.tiposCalculo)
      .then(r => r.json())
      .then(data => setTiposCalculo(extraeLista<TipoCalculo>(data)));
    fetch(API.tiposIndicador)
      .then(r => r.json())
      .then(data => setTiposIndicador(extraeLista<TipoIndicador>(data)));
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
          nid_fuente: undefined,
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

<<<<<<< Updated upstream
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.4rem',
    backgroundColor: '#A57E22',
    color: '#000000',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '0.95rem'
  };

  const labelStyle: React.CSSProperties = {
    width: '220px',
    fontWeight: 'bold',
    color: '#000000',
    fontSize: '0.95rem'
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.5rem'
  };
=======
  const inputStyle: React.CSSProperties = { padding: '0.4rem', marginBottom: '0.5rem', width: '100%' };
>>>>>>> Stashed changes

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 12, boxShadow: '0 0 8px #ccc' }}>
      <h2>Registrar nuevo indicador</h2>
      <input style={inputStyle} name="cclave_indicador" placeholder="Clave" value={form.cclave_indicador} onChange={handleChange} required />
      <input style={inputStyle} name="cdesc_indicador" placeholder="Descripción" value={form.cdesc_indicador} onChange={handleChange} required />
      <textarea style={inputStyle} name="cdefinicion_indicador" placeholder="Definición" value={form.cdefinicion_indicador} onChange={handleChange} required />

      <select style={inputStyle} name="nid_frecuencia" value={form.nid_frecuencia ?? ''} onChange={handleChange} required>
        <option value="">-- Selecciona frecuencia --</option>
        {Array.isArray(frecuencias) && frecuencias.map(f => (
          <option key={f.nid_frecuencia} value={f.nid_frecuencia}>{f.cfrecuencia}</option>
        ))}
      </select>

      <select style={inputStyle} name="nid_fuente" value={form.nid_fuente ?? ''} onChange={handleChange} required>
        <option value="">-- Selecciona fuente --</option>
        {Array.isArray(fuentes) && fuentes.map(f => (
          <option key={f.nid_fuente} value={f.nid_fuente}>{f.cfuente}</option>
        ))}
      </select>

      <select style={inputStyle} name="nid_tipo_calculo" value={form.nid_tipo_calculo ?? ''} onChange={handleChange} required>
        <option value="">-- Selecciona tipo cálculo --</option>
        {Array.isArray(tiposCalculo) && tiposCalculo.map(tc => (
          <option key={tc.nid_tipo_calculo} value={tc.nid_tipo_calculo}>{tc.ctipo_calculo}</option>
        ))}
      </select>

      <select style={inputStyle} name="nid_tipo_indicador" value={form.nid_tipo_indicador ?? ''} onChange={handleChange} required>
        <option value="">-- Selecciona tipo indicador --</option>
        {Array.isArray(tiposIndicador) && tiposIndicador.map(ti => (
          <option key={ti.nid_tipo_indicador} value={ti.nid_tipo_indicador}>{ti.ccolor_indicador}</option>
        ))}
      </select>

      <button type="submit" style={{ ...inputStyle, background: '#003B5C', color: '#fff', fontWeight: 600, borderRadius: 6 }}>Guardar indicador</button>
    </form>
  );
}
