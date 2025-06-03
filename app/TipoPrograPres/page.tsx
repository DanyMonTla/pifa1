'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import TipoProgramaFormulario from '../components/TipoProgramaFormulario';
import TipoProgramaBarraAcciones from '../components/TipoProgramaBarraAcciones';

type TipoPrograma = {
  nid_tipo_programa: string;
  ctipo_programa: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja?: string;
};

export default function TipoProgramaCrud() {
  const [form, setForm] = useState<TipoPrograma>({
    nid_tipo_programa: '',
    ctipo_programa: '',
    bhabilitado: true,
    dfecha_alta: '',
    dfecha_baja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | 'visualizar' | null>(null);
  const [programas, setProgramas] = useState<TipoPrograma[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerProgramas();
  }, []);

  const obtenerProgramas = async () => {
    try {
      const res = await fetch('http://localhost:3001/tipo-programa');
      const data = await res.json();
      setProgramas(data);
    } catch (err) {
      console.error('❌ Error al cargar programas:', err);
      setProgramas([]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = async () => {
    const id = busquedaId.trim();
    if (!id) return alert('Por favor, escribe un ID');

    try {
      const res = await fetch(`http://localhost:3001/tipo-programa/${id}`);
      if (!res.ok) {
        alert('No se encontró un tipo de programa con ese ID');
        return;
      }

      const data = await res.json();
      setForm({
        nid_tipo_programa: String(data.nid_tipo_programa),
        ctipo_programa: data.ctipo_programa,
        bhabilitado: data.bhabilitado,
        dfecha_alta: data.dfecha_alta.slice(0, 10),
        dfecha_baja: data.dfecha_baja ? data.dfecha_baja.slice(0, 10) : '',
      });
      setModo('visualizar'); // 👈 solo visual
    } catch (error) {
      console.error('❌ Error al buscar tipo de programa', error);
      alert('Error al conectar con el servidor');
    }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const camposVacios = [form.nid_tipo_programa, form.ctipo_programa, form.dfecha_alta].some(val => val.trim() === '');
  if (camposVacios) return alert('Por favor, completa todos los campos.');

  try {
    if (modo === 'modificar') {
      if (!confirm('¿Actualizar tipo de programa?')) return;

      const { nid_tipo_programa, ...restoDelFormulario } = form; // 🔥 separar ID

      await fetch(`http://localhost:3001/tipo-programa/${nid_tipo_programa}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restoDelFormulario), // ✅ solo los campos del DTO
      });

      mostrarMensaje('Actualizado correctamente');
    }

    else if (modo === 'eliminar') {
      if (!confirm('¿Inactivar tipo de programa?')) return;
      const fechaActual = new Date().toISOString().split('T')[0];

      await fetch(`http://localhost:3001/tipo-programa/estado/${form.nid_tipo_programa}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bhabilitado: false, dfecha_baja: fechaActual }),
      });

      mostrarMensaje('Inactivado correctamente');
    }

    else if (modo === 'agregar') {
      if (!confirm('¿Agregar nuevo tipo de programa?')) return;

      await fetch('http://localhost:3001/tipo-programa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      mostrarMensaje('Agregado correctamente');
    }
  } catch (err) {
    console.error('❌ Error al realizar operación:', err);
    alert('Error al conectar con el servidor');
  }

  await obtenerProgramas();
  setForm({ nid_tipo_programa: '', ctipo_programa: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '' });
  setModo(null);
};


  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar Tipo de Programa';
    if (modo === 'modificar') return 'Modificar Tipo de Programa';
    if (modo === 'eliminar') return 'Eliminar Tipo de Programa';
    if (modo === 'visualizar') return 'Visualizar Tipo de Programa';
    return 'Catálogo de Tipos de Programa';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{obtenerTitulo()}</h2>

      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'green',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          ✅ {mensaje}
        </div>
      )}

      <TipoProgramaBarraAcciones
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        setModo={setModo}
        mostrarInactivos={mostrarInactivos}
        setMostrarInactivos={setMostrarInactivos}
        handleBuscarPorId={handleBuscarPorId}
      />

      {modo && (
        <TipoProgramaFormulario
          form={form}
          modo={modo}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Tipo de Programa</th>
            <th style={thStyle}>Habilitado</th>
            <th style={thStyle}>Fecha Alta</th>
            <th style={thStyle}>Fecha Baja</th>
          </tr>
        </thead>
        <tbody>
          {programas
            .filter(p => mostrarInactivos || p.bhabilitado)
            .map(p => (
              <tr key={p.nid_tipo_programa} style={{ opacity: p.bhabilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{p.nid_tipo_programa}</td>
                <td style={tdStyle}>{p.ctipo_programa}</td>
                <td style={{ ...tdStyle, color: p.bhabilitado ? 'green' : 'red' }}>
                  {p.bhabilitado ? 'Activo' : 'Inactivo'}
                </td>
                <td style={tdStyle}>{p.dfecha_alta}</td>
                <td style={tdStyle}>{p.dfecha_baja || '-'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#003B5C',
  color: 'white',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#fff',
  color: '#000',
};
