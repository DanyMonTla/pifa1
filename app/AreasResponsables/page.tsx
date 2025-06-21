'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import AreasRespFormulario      from '../components/AreasRespFormulario';
import AreasRespTabla           from '../components/AreasRespTabla';
import AreasRespAcciones        from '../components/AreasRespAcciones';
import AreaResPrograPresVinculacion from '../components/AreaResPrograPresVinculacion';

/* ────────────────────
   🗄️ Tipos de datos
────────────────────── */
type AreaResponsable = {
  nid_area:              string;
  cunidad_responsable:    string;
  creporta_a:             string;
  ccorreo_electronico_ur: string;
  bhabilitado:            boolean;
  dfecha_alta:            string;
  dfecha_baja:            string;
};

type ProgramaPresupuestal = {
  nid_programa_presupuestal:  string;
  cprograma_presupuestal:     string;
};

type Vinculacion = {
  nid_area: string;
  nid_programa_presupuestal: string; // ✅ este es el nombre correcto usado en el backend
};


/* ────────────────────
   🚀 Componente principal
────────────────────── */
export default function AreasResponsablesCrud() {

  /* ╭──────────────────────────────╮
     │ Estados y valores iniciales  │
     ╰──────────────────────────────╯ */
  const [form, setForm] = useState<AreaResponsable>({
    nid_area: '',
    cunidad_responsable: '',
    creporta_a: '',
    ccorreo_electronico_ur: '',
    bhabilitado: true,
    dfecha_alta: '',
    dfecha_baja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [areas, setAreas] = useState<AreaResponsable[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [verInactivos, setVerInactivos] = useState(false);
  const [soloVisualizacion, setSoloVisualizacion] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [idBuscadoMostrado, setIdBuscadoMostrado] = useState<string | null>(null);

  /* 🗂 Modal y vinculaciones */
  const [modalVisible, setModalVisible] = useState(false);
  const [vinculaciones, setVinculaciones] = useState<Vinculacion[]>([]);
  const [programasPresupuestales, setProgramasPresupuestales] = useState<ProgramaPresupuestal[]>([]);

  /* 🔗 End-points */
  const API_URL = 'http://localhost:3001/areas-responsables';

  /* Encabezados para la tabla */
  const encabezados: Record<string, string> = {
    nid_area:              'ID Área',
    cunidad_responsable:   'Unidad Responsable',
    creporta_a:            'Reporta A',
    ccorreo_electronico_ur:'Correo Electrónico',
    dfecha_alta:           'Fecha Alta',
    bhabilitado:           'Activo',
    dfecha_baja:           'Fecha Baja',
  };

  /* ─────────────────────────────
     1️⃣  Cargar áreas al iniciar
  ────────────────────────────── */
  useEffect(() => { obtenerAreas(); }, []);

  const obtenerAreas = async () => {
    try {
      const res  = await fetch(API_URL);
      const data = await res.json();

      const areasConvertidas = (Array.isArray(data) ? data : data.areas || []).map((a: any) => ({
        ...a,
        bhabilitado:
          typeof a.bhabilitado === 'object'
            ? a.bhabilitado?.data?.[0] === 1
            : Boolean(a.bhabilitado),
      }));

      setAreas(areasConvertidas);
    } catch (err) {
      console.error(err);
      alert('No se pudieron cargar las áreas desde el servidor.');
    }
  };

  /* ─────────────────────────────
     2️⃣  Cargar programas al iniciar
  ────────────────────────────── */
  useEffect(() => {
    const obtenerProgramas = async () => {
      try {
        const res  = await fetch('http://localhost:3001/programa-presupuestal');
        const data = await res.json();
        const activos = data.filter((p: any) => p.bhabilitado);
        setProgramasPresupuestales(activos);
      } catch (error) {
        console.error('Error al cargar programas presupuestales:', error);
        alert('No se pudieron cargar los programas presupuestales.');
      }
    };
    obtenerProgramas();
  }, []);

  /* 3️⃣ Cargar vinculaciones actuales desde el backend */
useEffect(() => {
  const obtenerVinculaciones = async () => {
    try {
      const res = await fetch('http://localhost:3001/vinculacion-area-programa');
      const data = await res.json();
      const normalizadas = data.map((v: any) => ({
      nid_area: String(v.nid_area),
      nid_programa_presupuestal: String(v.nid_programa_presupuestal),
    }));

      setVinculaciones(normalizadas);
    } catch (err) {
      console.error('Error al cargar vinculaciones:', err);
      alert('No se pudieron cargar las vinculaciones existentes.');
    }
  };

  obtenerVinculaciones();
}, []);


  /* ─────────────────────────────
     3️⃣  Manejadores de formulario
  ────────────────────────────── */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Validar campos */
    const camposVacios = Object.entries(form)
      .filter(([key]) => key !== 'bhabilitado' && key !== 'dfecha_baja')
      .some(([, val]) => typeof val === 'string' && val.trim() === '');

    if (camposVacios) return alert('Por favor, completa todos los campos.');

    try {
      if (modo === 'modificar') {
        if (!confirm('¿Deseas actualizar esta área responsable?')) return;

        const { nid_area, ...restoForm } = form;
        await fetch(`${API_URL}/${Number(nid_area)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restoForm),
        });
        setMensaje('Área modificada exitosamente');

      } else if (modo === 'eliminar') {
        if (!form.bhabilitado) {
          setError('Esta área ya está inactiva.');
          setTimeout(() => setError(''), 2000);
          return;
        }
        if (!confirm('¿Deseas marcar como inactiva esta área responsable?')) return;

        const fechaBaja = new Date().toISOString().slice(0, 10);
        await fetch(`${API_URL}/estado/${form.nid_area}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bhabilitado: false, dfecha_baja: fechaBaja }),
        });
        setMensaje('Área marcada como inactiva');

      } else if (modo === 'agregar') {
        const formAEnviar = {
          ...form,
          nid_area: Number(form.nid_area),
          dfecha_alta: new Date(form.dfecha_alta),
          dfecha_baja: null,
        };
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formAEnviar),
        });
        setMensaje('Área agregada exitosamente');
      }

      /* Refrescar lista y limpiar */
      await obtenerAreas();
      resetForm();
      setModo(null);
      setSoloVisualizacion(false);
      setIdBuscadoMostrado(null);
      setTimeout(() => setMensaje(''), 3000);

    } catch (err) {
      console.error(err);
      alert('Error al realizar la operación.');
    }
  };

  /* ─────────────────────────────
     4️⃣  Reactivar área
  ────────────────────────────── */
  const reactivarArea = async () => {
    if (!form.nid_area) {
      setError('No hay área seleccionada.'); return;
    }
    if (form.bhabilitado) {
      setError('El área ya está activa.');
      setTimeout(() => setError(''), 3000); return;
    }
    if (!confirm('¿Deseas reactivar esta área responsable?')) return;

    try {
      const res = await fetch(`${API_URL}/reactivar/${form.nid_area}`, { method: 'PATCH' });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Error al reactivar');
      }
      setMensaje('Área reactivada exitosamente');
      await obtenerAreas();
      setForm(prev => ({ ...prev, bhabilitado: true, dfecha_baja: '' }));
      setModo(null);
      setSoloVisualizacion(false);
      setIdBuscadoMostrado(null);
      setTimeout(() => setMensaje(''), 3000);

    } catch (err: any) {
      console.error('Error al reactivar:', err);
      setError(err.message || 'Error inesperado al reactivar');
      setTimeout(() => setError(''), 3000);
    }
  };

  /* ─────────────────────────────
     5️⃣  Reset y búsqueda
  ────────────────────────────── */
  const resetForm = () => {
    const hoy = new Date().toISOString().split('T')[0];
    setForm({
      nid_area: '',
      cunidad_responsable: '',
      creporta_a: '',
      ccorreo_electronico_ur: '',
      bhabilitado: true,
      dfecha_alta: hoy,
      dfecha_baja: '',
    });
    setModo(null);
    setSoloVisualizacion(false);
    setIdBuscadoMostrado(null);
    setBusquedaId('');
  };

  const handleBuscarPorId = () => {
    const idBuscado = parseInt(busquedaId.trim());
    const areaSeleccionada = areas.find(a => parseInt(a.nid_area) === idBuscado);

    if (areaSeleccionada) {
      setForm({ ...areaSeleccionada, nid_area: String(areaSeleccionada.nid_area) });
      if (modo === 'modificar' || modo === 'eliminar') {
        setSoloVisualizacion(false);
      } else {
        setModo(null);
        setSoloVisualizacion(true);
      }
      setIdBuscadoMostrado(busquedaId.trim());
    } else {
      alert('No se encontró un área con ese ID');
      setIdBuscadoMostrado(null);
    }
  };

  /* ╭──────────────────────────────╮
     │         Renderizado          │
     ╰──────────────────────────────╯ */
  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem' }}>

      {/* Mensajes de éxito y error */}
      {mensaje && (
        <div style={{
          backgroundColor: 'green',
          padding: '1rem',
          borderRadius: 8,
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✅ {mensaje}
        </div>
      )}
      {error && (
        <div style={{
          backgroundColor: '#8B0000',
          padding: '1rem',
          borderRadius: 8,
          marginBottom: '1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Botón para abrir el modal de vinculación */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setModalVisible(true)}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#006699', color: 'white', borderRadius: 5 }}
        >
          AreaResponsables-ProgramaPresupuestal
        </button>
      </div>

      {/* Barra de acciones */}
      <AreasRespAcciones
        form={form}
        setModo={setModo}
        resetForm={resetForm}
        setSoloVisualizacion={setSoloVisualizacion}
        setError={setError}
        verInactivos={verInactivos}
        setVerInactivos={setVerInactivos}
        handleBuscar={handleBuscarPorId}
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        puedeReactivar={verInactivos && !form.bhabilitado}
        reactivarArea={reactivarArea}
      />

      {/* Formulario */}
      <AreasRespFormulario
        form={form}
        modo={modo}
        soloVisualizacion={soloVisualizacion}
        encabezados={encabezados}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        areasRegistradas={areas}
      />

      {/* Tabla */}
      <AreasRespTabla
        areas={areas}
        verInactivos={verInactivos}
        encabezados={encabezados}
      />

      {/* Modal de vinculación (versión NUEVA) */}
      <AreaResPrograPresVinculacion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        areas={areas}
        programas={programasPresupuestales}
        vinculaciones={vinculaciones}
        setVinculaciones={setVinculaciones}
      />
    </div>
  );
}
