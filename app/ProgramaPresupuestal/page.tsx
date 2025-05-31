'use client';

import React, { useState, ChangeEvent } from 'react';

type ProgramaPresupuestal = {
  nid_programa_presupuestal: string;
  cprograma_presupuestal: string;
  cdefinicion_programa_presupuestal: string;
  bhabilitado: boolean;
  dfecha_alta: string;
  dfecha_baja?: string;
};

export default function ProgramasPresupuestalesCrud() {
  const [form, setForm] = useState<ProgramaPresupuestal>({
    nid_programa_presupuestal: '',
    cprograma_presupuestal: '',
    cdefinicion_programa_presupuestal: '',
    bhabilitado: true,
    dfecha_alta: '',
    dfecha_baja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [programas, setProgramas] = useState<ProgramaPresupuestal[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorId = () => {
    const encontrado = programas.find(p =>
      p.nid_programa_presupuestal === busquedaId.trim() ||
      p.nid_programa_presupuestal === form.nid_programa_presupuestal
    );
    if (encontrado) {
      setForm(encontrado);
    } else {
      alert('No se encontró un programa con ese ID');
    }
  };

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camposVacios = [form.nid_programa_presupuestal, form.cprograma_presupuestal, form.cdefinicion_programa_presupuestal, form.dfecha_alta].some(val => val.trim() === '');
    if (camposVacios) return alert('Por favor, completa todos los campos obligatorios.');

    if (modo === 'modificar') {
      if (!confirm('¿Deseas actualizar este programa presupuestal?')) return;
      setProgramas(prev =>
        prev.map(p =>
          p.nid_programa_presupuestal === form.nid_programa_presupuestal
            ? { ...form, bhabilitado: true }
            : p
        )
      );
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'eliminar') {
      if (!confirm('¿Deseas desactivar este programa presupuestal?')) return;
      setProgramas(prev =>
        prev.map(p =>
          p.nid_programa_presupuestal === form.nid_programa_presupuestal
            ? { ...p, bhabilitado: false, dfecha_baja: new Date().toISOString().split('T')[0] }
            : p
        )
      );
      mostrarMensaje('Operación exitosa');
    } else if (modo === 'agregar') {
      if (!confirm('¿Deseas agregar este nuevo programa presupuestal?')) return;
      setProgramas(prev => [...prev, { ...form, bhabilitado: true, dfecha_baja: '' }]);
      mostrarMensaje('Operación exitosa');
    }

    setForm({
      nid_programa_presupuestal: '',
      cprograma_presupuestal: '',
      cdefinicion_programa_presupuestal: '',
      bhabilitado: true,
      dfecha_alta: '',
      dfecha_baja: '',
    });
    setModo(null);
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo Programa Presupuestal';
    if (modo === 'modificar') return 'Modificar Programa Presupuestal';
    if (modo === 'eliminar') return 'Eliminar Programa Presupuestal';
    return 'Catálogo de Programas Presupuestales';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem' }}>
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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscarPorId} style={btnBuscar}>Buscar</button>
        <button onClick={() => setModo('agregar')} style={btnAgregar}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={btnModificar}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={btnEliminar}>Eliminar</button>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={mostrarInactivos}
            onChange={() => setMostrarInactivos(prev => !prev)}
          />
          Ver inactivos
        </label>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <input
            name="nid_programa_presupuestal"
            placeholder="ID Programa"
            value={form.nid_programa_presupuestal}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <input
            name="cprograma_presupuestal"
            placeholder="Nombre del Programa"
            value={form.cprograma_presupuestal}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />
          <textarea
            name="cdefinicion_programa_presupuestal"
            placeholder="Definición del Programa"
            value={form.cdefinicion_programa_presupuestal}
            onChange={handleChange}
            style={{ ...inputStyle, height: '80px' }}
            readOnly={modo === 'eliminar'}
          />
          <input
            type="date"
            name="dfecha_alta"
            placeholder="Fecha de Alta"
            value={form.dfecha_alta}
            onChange={handleChange}
            style={inputStyle}
            readOnly={modo === 'eliminar'}
          />

          <button type="submit" style={{
            marginTop: '1rem',
            padding: '0.75rem 2rem',
            backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6',
            color: 'white',
            border: 'none'
          }}>
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Desactivar' : 'Guardar'}
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Programa Presupuestal</th>
            <th style={thStyle}>Definición</th>
            <th style={thStyle}>Alta</th>
            <th style={thStyle}>Baja</th>
            <th style={thStyle}>Habilitado</th>
          </tr>
        </thead>
        <tbody>
          {programas
            .filter(p => mostrarInactivos || p.bhabilitado)
            .map(p => (
              <tr key={p.nid_programa_presupuestal} style={{ opacity: p.bhabilitado ? 1 : 0.5 }}>
                <td style={tdStyle}>{p.nid_programa_presupuestal}</td>
                <td style={tdStyle}>{p.cprograma_presupuestal}</td>
                <td style={tdStyle}>{p.cdefinicion_programa_presupuestal}</td>
                <td style={tdStyle}>{p.dfecha_alta}</td>
                <td style={tdStyle}>{p.dfecha_baja || ''}</td>
                <td style={{ ...tdStyle, color: p.bhabilitado ? 'green' : 'red' }}>
                  {p.bhabilitado ? 'Sí' : 'No'}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}

// Estilos
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

const inputStyle: React.CSSProperties = {
  width: '100%',
  marginBottom: '0.5rem',
  padding: '0.5rem',
};

const btnBuscar = { backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' };
const btnAgregar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnModificar = { backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' };
const btnEliminar = { backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' };
