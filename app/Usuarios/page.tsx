'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import UsuariosFormulario from '../components/UsuariosFormulario';
import UsuariosTabla from '../components/UsuariosTabla';
import { Usuario, Area, Rol } from '../components/tiposUsuarios';

export default function UsuariosCrud() {
  const [form, setForm] = useState<Usuario>({
  cid_usuario: '',cnombre_usuario: '',rfc: '',capellido_p_usuario: '',capellido_m_usuario: '',ccargo_usuario: '',chashed_password: '',
  nid_area: '', nid_rol: '', btitulo_usuario: '', bhabilitado: true, dfecha_alta: '', dfecha_baja: '',});



  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [contrasenaOriginal, setContrasenaOriginal] = useState('');

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
        ? data
            .map((u: any) => ({
              ...u,
              rfc: u.rfc ?? '',
              bhabilitado: String(u.bhabilitado).toLowerCase() === 'true' || u.bhabilitado === true || u.bhabilitado === 1,
            }))
            .sort((a, b) => parseInt(a.cid_usuario) - parseInt(b.cid_usuario)) // 👈 aquí se ordenan por ID numérico
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


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const confirmMsg =
    modo === 'agregar'
      ? '¿Agregar usuario?'
      : modo === 'modificar'
      ? '¿Actualizar usuario?'
      : '¿Desactivar usuario?';

  if (!confirm(confirmMsg)) return;

  const longitudes = [

    { campo: 'cnombre_usuario', valor: form.cnombre_usuario, max: 50 },
    { campo: 'capellido_p_usuario', valor: form.capellido_p_usuario, max: 25 },
    { campo: 'capellido_m_usuario', valor: form.capellido_m_usuario, max: 25 },
    { campo: 'ccargo_usuario', valor: form.ccargo_usuario, max: 20 },
    { campo: 'chashed_password', valor: form.chashed_password, max: 255 },
    { campo: 'btitulo_usuario', valor: form.btitulo_usuario, max: 10 },
    { campo: 'rfc', valor: form.rfc, max: 13 },
  ];

 for (const campo of longitudes) {
  if (typeof campo.valor === 'string' && campo.valor.length > campo.max) {
    setMensaje(`❌ El campo "${campo.campo}" excede el límite de ${campo.max} caracteres.`);
    setEsError(true);
    return;
  }
}


  if (modo === 'agregar') {
    if (!form.chashed_password || form.chashed_password.length !== 15) {
      setMensaje('❌ La contraseña debe tener exactamente 15 caracteres.');
      setEsError(true);
      return;
    }
  }

  if (modo === 'modificar') {
    const haCambiado = form.chashed_password !== contrasenaOriginal;
    if (haCambiado && form.chashed_password.length !== 15) {
      setMensaje('❌ La nueva contraseña debe tener exactamente 15 caracteres.');
      setEsError(true);
      return;
    }
  }

  const parsedArea = parseInt(form.nid_area);
  const parsedRol = parseInt(form.nid_rol);

  if (isNaN(parsedArea) || isNaN(parsedRol)) {
    setMensaje('❌ Selecciona un área y un rol válidos.');
    setEsError(true);
    return;
  }

  const datos = {
    cnombre_usuario: form.cnombre_usuario,
    rfc: form.rfc,
    capellido_p_usuario: form.capellido_p_usuario,
    capellido_m_usuario: form.capellido_m_usuario,
    ccargo_usuario: form.ccargo_usuario,
    chashed_password: form.chashed_password,
    nid_area: parsedArea,
    nid_rol: parsedRol,
    btitulo_usuario: form.btitulo_usuario,
    dfecha_alta: form.dfecha_alta || new Date().toISOString().slice(0, 10),
    dfecha_baja: modo === 'eliminar' ? new Date().toISOString().slice(0, 10) : form.dfecha_baja || null,
    bhabilitado: modo === 'eliminar' ? false : true,
  };



  try {
    if (modo === 'agregar') {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error al agregar usuario:', errorText);
        setMensaje('Error al agregar usuario (ID duplicado o inválido)');
        setEsError(true);
        return;
      }

      setMensaje('✅ Usuario agregado');
      setEsError(false);
    } else if (modo === 'modificar') {
      const res = await fetch(`${API_URL}/${form.cid_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error al actualizar usuario:', errorText);
        setMensaje('Error al actualizar usuario');
        setEsError(true);
        return;
      }

      setMensaje('✅ Usuario actualizado');
      setEsError(false);
    } else if (modo === 'eliminar') {
      const res = await fetch(`${API_URL}/estado/${form.cid_usuario}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bhabilitado: false,
          dfecha_baja: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Error al desactivar usuario:', errorText);
        setMensaje('Error al desactivar usuario');
        setEsError(true);
        return;
      }

      setMensaje('✅ Usuario desactivado');
      setEsError(false);
    }

    await fetchUsuarios();
    resetForm();
    setTimeout(() => setMensaje(''), 3000);
  } catch (err) {
    console.error("❌ Error en la operación:", err);
    setMensaje('Error inesperado al procesar la operación');
    setEsError(true);
  }
};

  const handleReactivar = async () => {
    if (!form.cid_usuario) return;
    if (!confirm('¿Deseas reactivar este usuario?')) return;
    try {
      const res = await fetch(`${API_URL}/reactivar/${form.cid_usuario}`, {
        method: 'PATCH',
      });
      if (!res.ok) throw new Error(await res.text());
      setMensaje('✅ Usuario reactivado');
      setEsError(false);
      await fetchUsuarios();
      resetForm();
    } catch (err) {
      console.error('❌ Error al reactivar:', err);
      setMensaje('Error al reactivar usuario');
      setEsError(true);
    }
    setTimeout(() => setMensaje(''), 2000);
  };

  const resetForm = () => {
  setForm({
    cid_usuario: '',cnombre_usuario: '',rfc: '',capellido_p_usuario: '',capellido_m_usuario: '',
    ccargo_usuario: '',chashed_password: '',nid_area: '',nid_rol: '',btitulo_usuario: '',bhabilitado: true, dfecha_alta: '', dfecha_baja: '',
  });
  setContrasenaOriginal('');
  setModo(null);
  setBusquedaNombre('');
};


  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
    

      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: esError ? 'darkred' : 'green',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000,
        }}>
          {esError ? '⚠️' : '✅'} {mensaje}
        </div>
      )}
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const coincidencia = usuarios.find(
        (u) => u.cnombre_usuario.toLowerCase() === busquedaNombre.toLowerCase()
      );
      if (coincidencia) {
        setForm({
          ...coincidencia,
          nid_area: coincidencia.nid_area.toString(),
          nid_rol: coincidencia.nid_rol.toString(),
          dfecha_alta: coincidencia.dfecha_alta ?? '',
          dfecha_baja: coincidencia.dfecha_baja ?? '',
        });
        setContrasenaOriginal(coincidencia.chashed_password);
        setMensaje('✅ Usuario encontrado');
        setEsError(false);
      } else {
        setMensaje('❌ Usuario no encontrado');
        setEsError(true);
      }
      setTimeout(() => setMensaje(''), 2000);
    }}
    style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1.5rem',
      alignItems: 'center',
    }}
  >
    <input
      list="lista-nombres"
      placeholder="Buscar por nombre"
      value={busquedaNombre}
      onChange={(e) => setBusquedaNombre(e.target.value)}
      style={{ flex: 1, padding: '0.5rem' }}
    />

    <datalist id="lista-nombres">
      {usuarios
        .filter((u) =>
          busquedaNombre.length > 0 &&
          u.cnombre_usuario.toLowerCase().includes(busquedaNombre.toLowerCase())
        )
        .map((u, i) => (
          <option key={i} value={u.cnombre_usuario} />
        ))}
    </datalist>

    <button type="submit" style={{ backgroundColor: '#0077b6', color: 'white', padding: '0.5rem 1rem' }}>
      Buscar
    </button>

    <button
      onClick={() => {
        resetForm();
        setModo('agregar');
      }}
      type="button"
      style={{ backgroundColor: '#004c75', color: 'white', padding: '0.5rem 1rem' }}
    >
      Agregar
    </button>

    <button
      type="button"
      onClick={() => setModo('modificar')}
      disabled={form.cid_usuario !== '' && form.bhabilitado === false}
      style={{
        backgroundColor: '#004c75',
        color: 'white',
        padding: '0.5rem 1rem',
        opacity: form.cid_usuario !== '' && form.bhabilitado === false ? 0.5 : 1,
        cursor: form.cid_usuario !== '' && form.bhabilitado === false ? 'not-allowed' : 'pointer',
      }}
    >
      Modificar
    </button>

    <button
      type="button"
      onClick={() => setModo('eliminar')}
      disabled={form.cid_usuario !== '' && form.bhabilitado === false}
      style={{
        backgroundColor: '#8B0000',
        color: 'white',
        padding: '0.5rem 1rem',
        opacity: form.cid_usuario !== '' && form.bhabilitado === false ? 0.5 : 1,
        cursor: form.cid_usuario !== '' && form.bhabilitado === false ? 'not-allowed' : 'pointer',
      }}
    >
      Desactivar
    </button>

    {form.cid_usuario && form.bhabilitado === false && (
      <button
        type="button"
        onClick={handleReactivar}
        style={{
          backgroundColor: '#006400',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
        }}
      >
        Reactivar
      </button>
    )}

    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
      <input
        type="checkbox"
        checked={mostrarInactivos}
        onChange={() => setMostrarInactivos((p) => !p)}
      />
      Ver inhabilitados
    </label>
  </form>



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

      <UsuariosTabla usuarios={usuarios} areas={areas} roles={roles} mostrarInactivos={mostrarInactivos} busquedaNombre={busquedaNombre}/>
    </div>
  );
}
