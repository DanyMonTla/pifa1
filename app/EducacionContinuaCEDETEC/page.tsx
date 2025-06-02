"use client";
import React, { useState, ChangeEvent } from "react";

export default function EducacionContinuaCedetecPage() {
  const [actividades, setActividades] = useState<any[]>([]);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [form, setForm] = useState({
    nombre: '', tipo: '', modalidad: '', alcance: '', proyecto: '',
    area: '', modalidadAcademica: '', genero: '', inicio: '', fin: '', h: '', m: '', t: ''
  });
  const [busquedaNombre, setBusquedaNombre] = useState('');

  const th = {
    padding: "12px",
    border: "1px solid #ccc",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorNombre = () => {
    const actividad = actividades.find(a => a.nombre.toLowerCase() === busquedaNombre.toLowerCase().trim());
    if (actividad) setForm(actividad);
    else alert("No se encontró la actividad");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vacios = Object.values(form).some(val => val.trim() === '');
    if (vacios) return alert("Completa todos los campos.");

    if (modo === 'agregar') {
      setActividades(prev => [...prev, form]);
    } else if (modo === 'modificar') {
      setActividades(prev => prev.map(a => a.nombre === form.nombre ? form : a));
    } else if (modo === 'eliminar') {
      setActividades(prev => prev.filter(a => a.nombre !== form.nombre));
    }

    setForm({ nombre: '', tipo: '', modalidad: '', alcance: '', proyecto: '', area: '', modalidadAcademica: '', genero: '', inicio: '', fin: '', h: '', m: '', t: '' });
    setModo(null);
  };

  return (
    <main style={{ padding: "2rem", backgroundColor: "#1e1e1e" }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Buscar por NOMBRE"
          value={busquedaNombre}
          onChange={(e) => setBusquedaNombre(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscarPorNombre} style={{ backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' }}>Buscar</button>
        <button onClick={() => setModo('agregar')} style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={{ backgroundColor: '#0d47a1', color: 'white', padding: '0.5rem 1rem' }}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={{ backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' }}>Eliminar</button>
      </div>

      {modo && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          {Object.keys(form).map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.toUpperCase()}
              value={(form as any)[field]}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
              readOnly={modo === 'eliminar'}
            />
          ))}
          <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6', color: 'white', border: 'none' }}>
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Eliminar' : 'Guardar'}
          </button>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "white",
            color: "#000",
            fontSize: "14px",
          }}
        >
          <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
            <tr>
              <th style={th}>No.</th>
              <th style={th}>Nombre de la actividad</th>
              <th style={th}>Tipo</th>
              <th style={th}>Modalidad</th>
              <th style={th}>Alcance</th>
              <th style={th}>Tipo de Proyecto</th>
              <th style={th}>Área de conocimiento</th>
              <th style={th}>Modalidad académica</th>
              <th style={th}>Equidad de género</th>
              <th style={th}>Fecha inicio</th>
              <th style={th}>Fecha fin</th>
              <th style={th}>H</th>
              <th style={th}>M</th>
              <th style={th}>T</th>
            </tr>
          </thead>
          <tbody>
            {actividades.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f0f0" }}>
                  No hay actividades registradas aún.
                </td>
              </tr>
            ) : (
              actividades.map((a, i) => (
                <tr key={i}>
                  <td style={td}>{i + 1}</td>
                  <td style={td}>{a.nombre}</td>
                  <td style={td}>{a.tipo}</td>
                  <td style={td}>{a.modalidad}</td>
                  <td style={td}>{a.alcance}</td>
                  <td style={td}>{a.proyecto}</td>
                  <td style={td}>{a.area}</td>
                  <td style={td}>{a.modalidadAcademica}</td>
                  <td style={td}>{a.genero}</td>
                  <td style={td}>{a.inicio}</td>
                  <td style={td}>{a.fin}</td>
                  <td style={td}>{a.h}</td>
                  <td style={td}>{a.m}</td>
                  <td style={td}>{a.t}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
