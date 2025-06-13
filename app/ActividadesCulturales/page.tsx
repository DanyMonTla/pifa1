"use client";
import React, { useState, ChangeEvent } from "react";

export default function ActividadesCulturalesPage() {
  const [actividades, setActividades] = useState<any[]>([]);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [form, setForm] = useState({
    actividad: '',
    categoria: '',
    funcion: '',
    modalidad: '',
    genero: '',
    inicio: '',
    fin: ''
  });
  const [busquedaNombre, setBusquedaNombre] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBuscarPorNombre = () => {
    const actividad = actividades.find(a => a.actividad.toLowerCase() === busquedaNombre.toLowerCase().trim());
    if (actividad) setForm(actividad);
    else alert("No se encontró la actividad");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vacios = Object.values(form).some(val => val.trim() === '');
    if (vacios) return alert("Completa todos los campos.");

if (modo === 'agregar') {
  setActividades(prev => [...prev, form]);

  const payload = {
    NID_ACTIVIDAD_CULTURAL: Date.now(),
    NID_TIPO_ACTIVIDAD_CULTURAL: parseInt(form.categoria),
    NID_MODALIDAD: parseInt(form.modalidad),
    NID_FUNCION: parseInt(form.funcion),
    CNOMBRE_ACTIVIDAD_CULTURAL: form.actividad,
    BTEMATICA_GENERO: form.genero.toLowerCase() === 'sí' ? 1 : 0,
    DFECHA_INICIO: form.inicio,
    DFECHA_FIN: form.fin
  };

  console.log(' Enviando al backend:', payload); // <-- Aquí

  fetch('http://localhost:3001/actividades-culturales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => {
      console.log(' Respuesta status:', res.status);
      return res.json();
    })
    .then(data => console.log(' Actividad guardada en BD:', data))
    .catch(err => console.error(' Error al guardar en BD:', err));
}

    else if (modo === 'modificar') {
      setActividades(prev =>
        prev.map(a => a.actividad === form.actividad ? form : a)
      );
    }

    else if (modo === 'eliminar') {
      setActividades(prev =>
        prev.filter(a => a.actividad !== form.actividad)
      );
    }

    setForm({
      actividad: '', categoria: '', funcion: '',
      modalidad: '', genero: '', inicio: '', fin: ''
    });
    setModo(null);
  };

  const inputStyle = { width: '100%', marginBottom: '0.5rem', padding: '0.5rem' };

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          placeholder="Buscar por ACTIVIDAD"
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
          <input name="actividad" placeholder="ACTIVIDAD" value={form.actividad} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="categoria" placeholder="CATEGORÍA (ID)" value={form.categoria} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="funcion" placeholder="FUNCIÓN (ID)" value={form.funcion} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="modalidad" placeholder="MODALIDAD (ID)" value={form.modalidad} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="genero" placeholder="¿GÉNERO? (Sí/No)" value={form.genero} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="inicio" placeholder="FECHA INICIO (YYYY-MM-DD)" value={form.inicio} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />
          <input name="fin" placeholder="FECHA FIN (YYYY-MM-DD)" value={form.fin} onChange={handleChange} style={inputStyle} readOnly={modo === 'eliminar'} />

          <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: modo === 'eliminar' ? '#8B0000' : '#0077b6', color: 'white', border: 'none' }}>
            {modo === 'modificar' ? 'Actualizar' : modo === 'eliminar' ? 'Eliminar' : 'Guardar'}
          </button>
        </form>
      )}

      <table border={1} cellPadding={8} style={{ marginTop: "1rem", borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#003366", color: "#fff" }}>
          <tr>
            <th>N°</th>
            <th>Actividad</th>
            <th>Categoría</th>
            <th>Función</th>
            <th>Modalidad</th>
            <th>Género</th>
            <th>Inicio</th>
            <th>Fin</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f0f0f0" }}>
                No hay actividades registradas aún.
              </td>
            </tr>
          ) : (
            actividades.map((a, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{a.actividad}</td>
                <td>{a.categoria}</td>
                <td>{a.funcion}</td>
                <td>{a.modalidad}</td>
                <td>{a.genero}</td>
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
