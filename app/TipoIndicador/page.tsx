'use client';
import React, { useState } from 'react';

interface TipoIndicador {
  id: number;
  color: string;
}

export default function TipoIndicadorABC() {
  const [lista, setLista] = useState<TipoIndicador[]>([]);
  const [color, setColor] = useState('');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  const handleAgregar = () => {
    if (!color.trim()) return;
    const nuevo: TipoIndicador = {
      id: Date.now(), // ID simulado
      color,
    };
    setLista([...lista, nuevo]);
    setColor('');
  };

  const handleModificar = () => {
    if (seleccionado === null || !color.trim()) return;
    setLista(prev =>
      prev.map(item =>
        item.id === seleccionado ? { ...item, color } : item
      )
    );
    setSeleccionado(null);
    setColor('');
  };

  const handleEliminar = () => {
    if (seleccionado === null) return;
    setLista(prev => prev.filter(item => item.id !== seleccionado));
    setSeleccionado(null);
    setColor('');
  };

  const seleccionarFila = (item: TipoIndicador) => {
    setSeleccionado(item.id);
    setColor(item.color);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Catálogo Tipo Indicador</h2>

      {/* Formulario */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          placeholder="Color del indicador"
          style={{ flex: 1, padding: '0.5rem' }}
        />

        <button onClick={handleAgregar} style={botonEstilo}>
          Agregar
        </button>
        <button onClick={handleModificar} style={botonEstilo}>
          Modificar
        </button>
        <button
          onClick={handleEliminar}
          style={{ ...botonEstilo, backgroundColor: '#8B0000' }}
        >
          Eliminar
        </button>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem'
        }}
      >
        <thead style={{ backgroundColor: '#003B5C', color: 'white' }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Color Indicador</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((item) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: item.id === seleccionado ? '#f0f8ff' : 'white'
              }}
            >
              <td style={td}>{item.id}</td>
              <td style={td}>{item.color}</td>
              <td style={td}>
                <button onClick={() => seleccionarFila(item)} style={{ cursor: 'pointer' }}>
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const botonEstilo: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#003B5C',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
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
