'use client';
import React, { useEffect, useState } from 'react';

interface TipoCalculo {
  nid_tipo_calculo: number;
  ctipo_calculo: string;
  bhabilitado: boolean;
  dfecha_alta?: string;
  dfecha_baja?: string | null;
}

const API_URL = 'http://localhost:3001/tipo-calculo';

export default function TipoCalculoCrud() {
  const [lista, setLista] = useState<TipoCalculo[]>([]);
  const [ctipo_calculo, setCtipoCalculo] = useState('');
  const [seleccionado, setSeleccionado] = useState<number | null>(null);
  const [mostrarInhabilitados, setMostrarInhabilitados] = useState(false);

  useEffect(() => {
    obtenerCalculos();
  }, []);

  // Traer todos los tipos de cálculo
  const obtenerCalculos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("Respuesta del backend:", data);

      // Aseguramos que lista siempre sea array
      const arreglada =
        Array.isArray(data) ? data :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.result) ? data.result :
        Array.isArray(data.items) ? data.items : [];

      setLista(arreglada);
    } catch (e) {
      alert('Error al obtener cálculos');
      setLista([]);
    }
  };

  // Agregar nuevo tipo de cálculo
  const handleAgregar = async () => {
    if (!ctipo_calculo.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctipo_calculo }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setCtipoCalculo('');
        await obtenerCalculos();
      } else {
        alert('Error al agregar\n' + (data.message || JSON.stringify(data)));
      }
    } catch (e) {
      alert('Error al agregar: ' + e);
    }
  };

  // Modificar tipo de cálculo
  const handleModificar = async () => {
    if (seleccionado === null || !ctipo_calculo.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${seleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ctipo_calculo }),
      });
      if (res.ok) {
        setSeleccionado(null);
        setCtipoCalculo('');
        await obtenerCalculos();
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
        setCtipoCalculo('');
        await obtenerCalculos();
      } else {
        alert('Error al eliminar');
      }
    } catch {
      alert('Error al eliminar');
    }
  };

  // Seleccionar fila para editar
  const seleccionarFila = (item: TipoCalculo) => {
    setSeleccionado(item.nid_tipo_calculo);
    setCtipoCalculo(item.ctipo_calculo);
  };

  // Filtrado según habilitado
  const listaFiltrada = lista.filter(
    item => mostrarInhabilitados ? !item.bhabilitado : item.bhabilitado
  );

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Catálogo Tipo Cálculo</h2>

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
          value={ctipo_calculo}
          onChange={e => setCtipoCalculo(e.target.value)}
          placeholder="Nombre del cálculo"
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
            <th style={th}>Tipo Cálculo</th>
            {/* Si tienes fechas, descomenta */}
            {/* <th style={th}>Fecha Alta</th>
            <th style={th}>Fecha Baja</th> */}
            <th style={th}>Habilitado</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrada.map((item) => (
            <tr
              key={item.nid_tipo_calculo}
              style={{
                backgroundColor: item.nid_tipo_calculo === seleccionado ? '#f0f8ff' : 'white'
              }}
            >
              <td style={td}>{item.nid_tipo_calculo}</td>
              <td style={td}>{item.ctipo_calculo}</td>
              {/* Si tienes fechas, descomenta */}
              {/* <td style={td}>{item.dfecha_alta ? item.dfecha_alta.slice(0, 10) : '-'}</td>
              <td style={td}>{item.dfecha_baja ? item.dfecha_baja.slice(0, 10) : '-'}</td> */}
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
