'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import UsuariosFormulario from '../components/UsuariosFormulario';
import UsuariosTabla from '../components/UsuariosTabla';
import { Usuario, Area, Rol } from '../components/tiposUsuarios';

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
    cid_usuario: '', cnombre_usuario: '', capellido_p_usuario: '', capellido_m_usuario: '',
    ccargo_usuario: '', chashed_password: '', nid_area: '', nid_rol: '',
    btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '',
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [mensaje, setMensaje] = useState('');

  const API_URL = "http://localhost:3001/usuarios";
  const AREAS_URL = "http://localhost:3001/areas-responsables";
  const ROLES_URL = "http://localhost:3001/roles";

  useEffect(() => {
    fetchUsuarios();
    fetchAreas();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const normalizados = Array.isArray(data)
        ? data.map((u: any) => ({
            ...u,
            bhabilitado: u.bhabilitado?.data ? u.bhabilitado.data[0] === 1 : Boolean(u.bhabilitado),
          }))
        : [];
      setUsuarios(normalizados);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await fetch(AREAS_URL);
      const data = await res.json();
      setAreas(data.map((a: any) => ({
        idArea: a.nid_area.toString(),
        unidad: `${a.nid_area} - ${a.cunidad_responsable}`,
        rawUnidad: a.cunidad_responsable,
      })));
    } catch (err) {
      console.error("Error al cargar áreas:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(ROLES_URL);
      const data = await res.json();
      setRoles(data.map((r: any) => ({
        id_rol: r.nidRol.toString(),
        rol: `${r.nidRol} - ${r.crol}`,
        rawRol: r.crol,
      })));
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: Usuario) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = () => {
    const encontrado = usuarios.find(u => u.cid_usuario === busquedaId.trim());

    if (encontrado) {
      setForm({
        ...encontrado,
        dfecha_alta: encontrado.dfecha_alta?.slice(0, 10) || '',
        dfecha_baja: encontrado.dfecha_baja?.slice(0, 10) || '',
      });
      setModo(null);
    } else {
      alert("No se encontró un usuario con ese ID");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const confirmMsg =
      modo === 'agregar'
        ? '¿Agregar usuario?'
        : modo === 'modificar'
        ? '¿Actualizar usuario?'
        : '¿Desactivar usuario?';

    if (!confirm(confirmMsg)) return;

    try {
      const datos = {
        ...form,
        nid_area: parseInt(form.nid_area),
        nid_rol: parseInt(form.nid_rol),
        bhabilitado: modo === 'eliminar' ? false : true,
        dfecha_baja:
          modo === 'eliminar'
            ? new Date().toISOString().slice(0, 10)
            : form.dfecha_baja || '',
      };

      if (modo === 'agregar') {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        setMensaje('Usuario agregado');
      } else if (modo === 'modificar') {
        await fetch(`${API_URL}/${form.cid_usuario}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
        });
        setMensaje('Usuario actualizado');
      } else if (modo === 'eliminar') {
        await fetch(`${API_URL}/estado/${form.cid_usuario}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dfecha_baja: datos.dfecha_baja }),
        });
        setMensaje('Usuario desactivado');
      }

      await fetchUsuarios();
      resetForm();
      setTimeout(() => setMensaje(''), 3000);
    } catch (err) {
      console.error("Error en la operación:", err);
    }
  };

  const resetForm = () => {
    setForm({
      cid_usuario: '', cnombre_usuario: '', capellido_p_usuario: '', capellido_m_usuario: '',
      ccargo_usuario: '', chashed_password: '', nid_area: '', nid_rol: '',
      btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: ''
    });
    setModo(null);
    setBusquedaId('');
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Catálogo de Usuarios</h2>

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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <input
          placeholder="Buscar por ID"
          value={busquedaId}
          onChange={(e) => setBusquedaId(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleBuscar} style={{ backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' }}>Buscar</button>
        <button onClick={() => { resetForm(); setModo('agregar'); }} style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}>Agregar</button>
        <button onClick={() => setModo('modificar')} style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}>Modificar</button>
        <button onClick={() => setModo('eliminar')} style={{ backgroundColor: '#8B0000', color: 'white', padding: '0.5rem 1rem' }}>Desactivar</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <input type="checkbox" checked={mostrarInactivos} onChange={() => setMostrarInactivos(p => !p)} />
          Ver inhabilitados
        </label>
      </div>

      {(modo !== null || form.cid_usuario !== '') && (
        <UsuariosFormulario
          form={form}
          modo={modo}
          areas={areas}
          roles={roles}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}

      <UsuariosTabla usuarios={usuarios} areas={areas} roles={roles} mostrarInactivos={mostrarInactivos} />
    </div>
  );
}
