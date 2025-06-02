"use client";
import React, { useState, ChangeEvent } from "react";

export default function ActividadesCulturalesPage() {
  const [actividades, setActividades] = useState<any[]>([]);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [form, setForm] = useState({
    nombre: '', categoria: '', tipo: '', funcion: '', modalidad: '', genero: '', realizadas: '', sesiones: '', asistentes: '', inicio: '', fin: ''
  });
  const [busquedaNombre, setBusquedaNombre] = useState('');

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

    setForm({ nombre: '', categoria: '', tipo: '', funcion: '', modalidad: '', genero: '', realizadas: '', sesiones: '', asistentes: '', inicio: '', fin: '' });
    setModo(null);
  };

  return (
    <main style={{ padding: "2rem" }}>
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

      <table border={1} cellPadding={8} style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
          <tr>
            <th>#</th>
            <th>Nombre de la actividad</th>
            <th>Categoría</th>
            <th>Tipo Actividad</th>
            <th>Actividad por función</th>
            <th>Modalidad</th>
            <th>Género</th>
            <th>Realizadas</th>
            <th>Sesiones</th>
            <th>Asistentes</th>
            <th>Fecha inicio</th>
            <th>Fecha final</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan={12} style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f0f0" }}>
                No hay actividades registradas aún.
              </td>
            </tr>
          ) : (
            actividades.map((a, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{a.nombre}</td>
                <td>{a.categoria}</td>
                <td>{a.tipo}</td>
                <td>{a.funcion}</td>
                <td>{a.modalidad}</td>
                <td>{a.genero}</td>
                <td>{a.realizadas}</td>
                <td>{a.sesiones}</td>
                <td>{a.asistentes}</td>
                <td>{a.inicio}</td>
                <td>{a.fin}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
