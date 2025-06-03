'use client';
import React, { useEffect, useState } from 'react';

interface TipoIndicador {
  nid_tipo_indicador: number;
  ccolor_indicador: string;
  bhabilitado: boolean;
  dfecha_alta?: string;
  dfecha_baja?: string | null;
}

const API_URL = 'http://localhost:3001/tipo-indicador';

export default function TipoIndicadorCrud() {
  const [lista, setLista] = useState<TipoIndicador[]>([]);
  const [ccolor_indicador, setCcolorIndicador] = useState('');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [mostrarInhabilitados, setMostrarInhabilitados] = useState(false);

  useEffect(() => {
    obtenerIndicadores();
  }, []);

  // Traer todos los tipos de indicador
  const obtenerIndicadores = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // Asegura que lista siempre sea array
      const arreglada =
        Array.isArray(data) ? data :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.result) ? data.result :
        Array.isArray(data.items) ? data.items : [];

      setLista(arreglada);
    } catch (e) {
      alert('Error al obtener tipos de indicador');
      setLista([]);
    }
  };

  // Agregar nuevo tipo de indicador
  const handleAgregar = async () => {
    if (!ccolor_indicador.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccolor_indicador }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCcolorIndicador('');
        await obtenerIndicadores();
      } else {
        alert('Error al agregar\n' + (data.message || JSON.stringify(data)));
      }
    } catch (e) {
      alert('Error al agregar: ' + e);
    }
  };

  // Modificar tipo de indicador
  const handleModificar = async () => {
    if (seleccionado === null || !ccolor_indicador.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ccolor_indicador }),
      });
      if (res.ok) {
        setSeleccionado(null);
        setCcolorIndicador('');
        await obtenerIndicadores();
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
    const dfecha_baja = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bhabilitado: false,
          dfecha_baja,
        }),
      });
      if (res.ok) {
        setSeleccionado(null);
        setCcolorIndicador('');
        await obtenerIndicadores();
      } else {
        alert('Error al eliminar');
      }
    } catch {
      alert('Error al eliminar');
    }
  };

  // Seleccionar fila para editar
  const seleccionarFila = (item: TipoIndicador) => {
    setSeleccionado(item.nid_tipo_indicador);
    setCcolorIndicador(item.ccolor_indicador);
  };

  // Filtrado según habilitado
  const listaFiltrada = lista.filter(
    item => mostrarInhabilitados ? !item.bhabilitado : item.bhabilitado
  );

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Catálogo Tipo Indicador</h2>

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
          value={ccolor_indicador}
          onChange={e => setCcolorIndicador(e.target.value)}
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
            <th style={th}>Habilitado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map((item) => (
            <tr
              key={item.nid_tipo_indicador}
              style={{
                backgroundColor: item.nid_tipo_indicador === seleccionado ? '#f0f8ff' : 'white'
              }}
            >
              <td style={td}>{item.nid_tipo_indicador}</td>
              <td style={td}>{item.ccolor_indicador}</td>
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
