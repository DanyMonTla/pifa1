'use client';
import React, { useEffect, useState } from 'react';

interface Fuente {
  nid_fuente: number;
  cfuente: string;
  bhabilitado: boolean;
}

const API_URL = 'http://localhost:3001/fuentes';

export default function FuentesCrud() {
  const [lista, setLista] = useState<Fuente[]>([]);
  const [cfuente, setCFuente] = useState('');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [mostrarInhabilitados, setMostrarInhabilitados] = useState(false);

  useEffect(() => {
    obtenerFuentes();
  }, []);

  // Traer todas las fuentes
  const obtenerFuentes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Aseguramos array plano
      const arreglada =
        Array.isArray(data) ? data :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.result) ? data.result :
        Array.isArray(data.items) ? data.items : [];
      setLista(arreglada);
    } catch (e) {
      alert('Error al obtener fuentes');
      setLista([]);
    }
  };

  // Agregar nueva fuente
  const handleAgregar = async () => {
    if (!cfuente.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfuente }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCFuente('');
        await obtenerFuentes();
      } else {
        alert('Error al agregar\n' + (data.message || JSON.stringify(data)));
      }
    } catch (e) {
      alert('Error al agregar: ' + e);
    }
  };

  // Modificar fuente
  const handleModificar = async () => {
    if (seleccionado === null || !cfuente.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cfuente }),
      });
      if (res.ok) {
        setSeleccionado(null);
        setCFuente('');
        await obtenerFuentes();
      } else {
        alert('Error al modificar');
      }
    } catch {
      alert('Error al modificar');
    }
  };

  // Inhabilitar (eliminar lógico)
  const handleEliminar = async () => {
    if (seleccionado === null) return;
    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bhabilitado: false,
        }),
      });
      if (res.ok) {
        setSeleccionado(null);
        setCFuente('');
        await obtenerFuentes();
      } else {
        alert('Error al eliminar');
      }
    } catch {
      alert('Error al eliminar');
    }
  };

  // Seleccionar fila para editar
  const seleccionarFila = (item: Fuente) => {
    setSeleccionado(item.nid_fuente);
    setCFuente(item.cfuente);
  };

  // Filtrado según habilitado
  const listaFiltrada = lista.filter(
    item => mostrarInhabilitados ? !item.bhabilitado : item.bhabilitado
  );

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Catálogo Fuentes</h2>

      {/* Switch para mostrar inhabilitados */}
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button
          onClick={() => setMostrarInhabilitados(!mostrarInhabilitados)}
          style={{
            ...botonEstilo,
            backgroundColor: mostrarInhabilitados ? '#8B0000' : '#003B5C'
          }}
        >
          {mostrarInhabilitados ? 'Ver habilitados' : 'Ver inhabilitados'}
        </button>
      </div>

      {/* Formulario */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={cfuente}
          onChange={e => setCFuente(e.target.value)}
          placeholder="Nombre de la fuente"
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
            <th style={th}>Fuente</th>
            <th style={th}>Habilitado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map((item) => (
            <tr
              key={item.nid_fuente}
              style={{
                backgroundColor: item.nid_fuente === seleccionado ? '#f0f8ff' : 'white'
              }}
            >
              <td style={td}>{item.nid_fuente}</td>
              <td style={td}>{item.cfuente}</td>
              <td style={td}>{item.bhabilitado ? 'Sí' : 'No'}</td>
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
