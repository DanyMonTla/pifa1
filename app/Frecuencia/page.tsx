'use client';
import React, { useEffect, useState } from 'react';

type Frecuencia = {
  nid_frecuencia: number;
  cfrecuencia: string;
  bhabilitado?: boolean;
};

const API_URL = 'http://localhost:3001/frecuencias';

export default function FrecuenciaPage() {
  const [lista, setLista] = useState<Frecuencia[]>([]);
  const [cfrecuencia, setCFrecuencia] = useState('');
  const [seleccionado, setSeleccionado] = useState<Frecuencia | null>(null);
  const [loading, setLoading] = useState(false);

  // Obtener frecuencias al montar el componente
  useEffect(() => {
    obtenerFrecuencias();
  }, []);

  const obtenerFrecuencias = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setLista(data);
    } catch (error) {
      alert('Error al obtener frecuencias');
    }
    setLoading(false);
  };

  // Agregar frecuencia
  const handleAgregar = async () => {
    if (!cfrecuencia.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfrecuencia }),
      });
      if (!res.ok) throw new Error('No se pudo agregar');
      setCFrecuencia('');
      await obtenerFrecuencias();
    } catch (error) {
      alert('Error al agregar frecuencia');
    } finally {
      setLoading(false);
      setSeleccionado(null);
    }
  };

  // Modificar frecuencia
  const handleModificar = async () => {
    if (!seleccionado || !cfrecuencia.trim()) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${seleccionado.nid_frecuencia}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfrecuencia }),
      });
      if (!res.ok) throw new Error('No se pudo modificar');
      setCFrecuencia('');
      await obtenerFrecuencias();
    } catch (error) {
      alert('Error al modificar frecuencia');
    } finally {
      setLoading(false);
      setSeleccionado(null);
    }
  };

  // Eliminar frecuencia (elimina de la BD)
  const handleEliminar = async () => {
    if (!seleccionado) return;
    if (!window.confirm('¿Estás seguro de eliminar esta frecuencia?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${seleccionado.nid_frecuencia}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('No se pudo eliminar');
      setCFrecuencia('');
      await obtenerFrecuencias();
    } catch (error) {
      alert('Error al eliminar frecuencia');
    } finally {
      setLoading(false);
      setSeleccionado(null);
    }
  };

  const seleccionarFila = (item: Frecuencia) => {
    setSeleccionado(item);
    setCFrecuencia(item.cfrecuencia);
  };

  const cancelarEdicion = () => {
    setSeleccionado(null);
    setCFrecuencia('');
  };

  // --- ESTILOS IGUAL A TU FORMULARIO DE INDICADORES ---
  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '0.4rem',
    backgroundColor: '#A57E22',
    color: '#fff',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize: '0.95rem'
  };

  const labelStyle: React.CSSProperties = {
    width: '220px',
    fontWeight: 'bold',
    color: '#000',
    fontSize: '0.95rem'
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.5rem'
  };

  const th: React.CSSProperties = {
    padding: '0.5rem',
    border: '1px solid #ccc',
    textAlign: 'left'
  };

  const td: React.CSSProperties = {
    padding: '0.5rem',
    border: '1px solid #ccc'
  };

  // --- FIN ESTILOS ---

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          seleccionado === null ? handleAgregar() : handleModificar();
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          color: '#000'
        }}
      >
        <h2 style={{
          textAlign: 'center',
          color: '#000',
          marginBottom: '1rem'
        }}>
          Catálogo de Frecuencia
        </h2>

        <div style={rowStyle}>
          <label htmlFor="cfrecuencia" style={labelStyle}>
            Nombre de la Frecuencia
          </label>
          <input
            id="cfrecuencia"
            type="text"
            value={cfrecuencia}
            onChange={e => setCFrecuencia(e.target.value)}
            style={inputStyle}
            placeholder="Ejemplo: Mensual"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', margin: '0.7rem 0 1rem 0', alignSelf: 'center' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 2.5rem',
              backgroundColor: '#003B5C',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold'
            }}
          >
            {seleccionado === null ? 'Agregar' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={handleEliminar}
            disabled={!seleccionado || loading}
            style={{
              padding: '0.75rem 2.5rem',
              backgroundColor: '#8B0000',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold'
            }}
          >
            Eliminar
          </button>
          {seleccionado && (
            <button
              type="button"
              onClick={cancelarEdicion}
              style={{
                padding: '0.75rem 2.5rem',
                backgroundColor: '#bbb',
                color: '#333',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de frecuencias */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1.5rem'
        }}
      >
        <thead style={{ backgroundColor: '#003B5C', color: 'white' }}>
          <tr>
            <th style={th}>Frecuencia</th>
            <th style={th}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item) => (
            <tr
              key={item.nid_frecuencia}
              style={{
                backgroundColor: item.nid_frecuencia === seleccionado?.nid_frecuencia ? '#f0f8ff' : 'white'
              }}
            >
              <td style={td}>{item.cfrecuencia}</td>
              <td style={td}>
                <button
                  type="button"
                  onClick={() => seleccionarFila(item)}
                  style={{
                    cursor: 'pointer',
                    background: '#A57E22',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '0.3rem 1rem',
                    fontWeight: 'bold'
                  }}
                  disabled={loading}
                >
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <div style={{ textAlign: 'center', marginTop: '1rem' }}>Cargando...</div>}
    </div>
  );
}
