'use client';
import React, { useState, useEffect } from 'react';

// Tipos para cada catálogo
type Frecuencia = { nid_frecuencia: number; cfrecuencia: string };
type TipoCalculo = { nid_tipo_calculo: number; ctipo_calculo: string };
type TipoIndicador = { nid_tipo_indicador: number; ccolor_indicador: string };
type Clasificacion = { nid_clasificacion: number; cnombre_clasificacion: string };
type IndicadoresFormProps = {
  modo?: 'agregar' | 'modificar';
  indicadorInicial?: any;
  onGuardado?: () => void;
  onCancelar?: () => void;
};
// Formulario tipo
interface IndicadorForm {
  cclave_indicador: string;
  cdesc_indicador: string;
  cdefinicion_indicador: string;
  nid_frecuencia?: number;
  cfuente?: string;
  nid_tipo_calculo?: number;
  nid_tipo_indicador?: number;
  nid_clasificacion?: number;
}

const API = {
  frecuencias: 'http://localhost:3001/frecuencias',
  tiposCalculo: 'http://localhost:3001/tipo-calculo',
  tiposIndicador: 'http://localhost:3001/tipo-indicador',
  clasificaciones: 'http://localhost:3001/clasificacion',
  indicadores: 'http://localhost:3001/indicadores',
};

function extraeLista<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

export default function IndicadoresForm({
  modo = 'agregar',
  indicadorInicial,
  onGuardado,
  onCancelar
}: IndicadoresFormProps) {

  // Estado del formulario
  const [form, setForm] = useState<IndicadorForm>({
    cclave_indicador: '',
    cdesc_indicador: '',
    cdefinicion_indicador: '',
    nid_frecuencia: undefined,
    cfuente: '',
    nid_tipo_calculo: undefined,
    nid_tipo_indicador: undefined,
    nid_clasificacion: undefined,
  });

  // Estados para los catálogos
  const [frecuencias, setFrecuencias] = useState<Frecuencia[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<TipoCalculo[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<TipoIndicador[]>([]);
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]);

  // Cargar catálogos al montar
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

  // Cargar datos del indicador a modificar, o limpiar si es nuevo
  useEffect(() => {
    if (modo === "modificar" && indicadorInicial) {
      setForm({
        cclave_indicador: indicadorInicial.cclave_indicador,
        cdesc_indicador: indicadorInicial.cdesc_indicador,
        cdefinicion_indicador: indicadorInicial.cdefinicion_indicador,
        nid_frecuencia: indicadorInicial.nid_frecuencia,
        cfuente: indicadorInicial.cfuente,
        nid_tipo_calculo: indicadorInicial.nid_tipo_calculo,
        nid_tipo_indicador: indicadorInicial.nid_tipo_indicador,
        nid_clasificacion: indicadorInicial.nid_clasificacion,
      });
    } else {
      setForm({
        cclave_indicador: '',
        cdesc_indicador: '',
        cdefinicion_indicador: '',
        nid_frecuencia: undefined,
        cfuente: '',
        nid_tipo_calculo: undefined,
        nid_tipo_indicador: undefined,
        nid_clasificacion: undefined,
      });
    }
  }, [modo, indicadorInicial]);

  // Manejo de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name.startsWith('nid_') && value !== '' ? Number(value) : value,
    }));
  };

  // Guardar/agregar o modificar
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body: Record<string, any> = { ...form };
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);
      let res: Response;
      if (modo === "modificar" && indicadorInicial) {
        // Modificar
        res = await fetch(`${API.indicadores}/${indicadorInicial.nid_indicador}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        // Agregar
        res = await fetch(API.indicadores, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
     if (res.ok) {
                alert(modo === 'modificar' ? 'Indicador actualizado' : 'Indicador registrado');
                // Limpia el formulario SIEMPRE después de guardar
                setForm({
                  cclave_indicador: '',
                  cdesc_indicador: '',
                  cdefinicion_indicador: '',
                  nid_frecuencia: undefined,
                  cfuente: '',
                  nid_tipo_calculo: undefined,
                  nid_tipo_indicador: undefined,
                  nid_clasificacion: undefined,
                });
                // Llama SIEMPRE a onGuardado (ya sea alta o modificación)
                onGuardado && onGuardado();
                } else {
                alert('Error al guardar');
               }
            } catch (e) {
              alert('Error al enviar: ' + e);
            }
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
      <h2 style={{
        textAlign: 'center',
        color: '#003B5C',
        marginBottom: '2rem',
        letterSpacing: 1,
        fontWeight: 900
      }}>
        {modo === 'modificar' ? 'Modificar indicador' : 'Registrar nuevo indicador'}
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
          fontWeight: 500,
          marginBottom: 16,
          width: '100%',
        }}
        name="nid_clasificacion"
        value={form.nid_clasificacion ?? ''}
        onChange={handleChange}
        required
      >
        <option value="">-- Selecciona clasificación --</option>
        {clasificaciones.map(cl => (
          <option key={cl.nid_clasificacion} value={cl.nid_clasificacion}>
            {cl.cnombre_clasificacion}
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
          fontWeight: 500,
          marginBottom: 16,
          width: '100%',
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
    {modo === 'modificar' ? 'Guardar cambios' : 'Guardar indicador'}
  </button>
      <button
        type="button"
        onClick={onCancelar}
        style={{
          width: '100%',
          padding: '0.8rem',
          background: '#aaa',
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
        Cancelar cambios
      </button>
    </form>
);
};