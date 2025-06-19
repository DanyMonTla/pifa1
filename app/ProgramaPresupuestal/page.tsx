'use client';

import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import FormularioProgramaPresupuestal from '../components/FormularioProgramaPresupuestal';
import TablaProgramasPresupuestales from '../components/TablaProgramasPresupuestales';
import BarraAcciones from '../components/BarraAccionesPrograPres';

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

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | 'visualizar' | null>(null);
  const [programas, setProgramas] = useState<ProgramaPresupuestal[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const obtenerProgramas = async () => {
      try {
        const res = await fetch('http://localhost:3001/programa-presupuestal');
        const data = await res.json();
        setProgramas(data);
      } catch {
        mostrarMensaje('Error al obtener los programas presupuestales', 'error');
      }
    };
    obtenerProgramas();
  }, []);

  const programaEncontrado = useMemo(() => {
    const id = Number(busquedaId.trim());
    if (isNaN(id)) return null;
    return programas.find(p => Number(p.nid_programa_presupuestal) === id) || null;
  }, [busquedaId, programas]);

 const handleBuscarPorId = () => {
  const idBuscado = Number(busquedaId.trim());
  if (isNaN(idBuscado)) {
    mostrarMensaje('Por favor, ingresa un ID válido', 'error');
    return;
  }

  if (!programaEncontrado) {
    mostrarMensaje('No se encontró un programa con ese ID', 'error');
    return;
  }

  // Cortamos la fecha para que sea compatible con el input[type="date"]
  setForm({
    ...programaEncontrado,
    dfecha_alta: programaEncontrado.dfecha_alta.split('T')[0],
    dfecha_baja: programaEncontrado.dfecha_baja
      ? programaEncontrado.dfecha_baja.split('T')[0]
      : '',
  });

  // ✅ Solo cambiamos a modo "visualizar" si no estás ya en "modificar" o "eliminar"
  if (modo !== 'modificar' && modo !== 'eliminar') {
    setModo('visualizar');
  }

  mostrarMensaje('Programa encontrado', 'success');
};


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const mostrarMensaje = (texto: string, tipo: 'success' | 'error' = 'success') => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const camposVacios = [
    form.nid_programa_presupuestal,
    form.cprograma_presupuestal,
    form.cdefinicion_programa_presupuestal,
    form.dfecha_alta,
  ].some(val => typeof val === 'string' && val.trim() === '');

  if (camposVacios) {
    mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
    return;
  }

  // ✅ Corrección: convertir los datos antes de enviarlos
  const datosParaEnviar = {
    ...form,
    nid_programa_presupuestal: Number(form.nid_programa_presupuestal),
    dfecha_alta: new Date(form.dfecha_alta),
    dfecha_baja: form.dfecha_baja ? new Date(form.dfecha_baja) : undefined,
  };

  try {
    if (modo === 'modificar') {
      if (!confirm('¿Deseas actualizar este programa presupuestal?')) return;
      await fetch(`http://localhost:3001/programa-presupuestal/${form.nid_programa_presupuestal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });
    } else if (modo === 'eliminar') {
      if (!confirm('¿Deseas desactivar este programa presupuestal?')) return;
      await fetch(`http://localhost:3001/programa-presupuestal/estado/${form.nid_programa_presupuestal}`, {
        method: 'PATCH',
      });
    } else if (modo === 'agregar') {
      if (!confirm('¿Deseas agregar este nuevo programa presupuestal?')) return;
      await fetch('http://localhost:3001/programa-presupuestal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaEnviar),
      });
    }

    const res = await fetch('http://localhost:3001/programa-presupuestal');
    const data = await res.json();
    setProgramas(data);
    mostrarMensaje('Operación exitosa', 'success');
  } catch {
    mostrarMensaje('Error en la operación. Verifica la conexión al servidor.', 'error');
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
    if (modo === 'eliminar') return 'Desactivar Programa Presupuestal';
    if (modo === 'visualizar') return 'Detalle de Programa Presupuestal';
    return 'Catálogo de Programas Presupuestales';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem' }}>
      

      {mensaje && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: mensaje.tipo === 'success' ? 'green' : 'darkred',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {mensaje.tipo === 'success' ? '✅' : '❌'} {mensaje.texto}
        </div>
      )}

      <BarraAcciones
        busquedaId={busquedaId}
        onChangeBusqueda={(e) => setBusquedaId(e.target.value)}
        onBuscar={handleBuscarPorId}
        onAgregar={() => {
          const hoy = new Date().toISOString().split('T')[0];
          setForm({
            nid_programa_presupuestal: '',
            cprograma_presupuestal: '',
            cdefinicion_programa_presupuestal: '',
            dfecha_alta: hoy, // 👈 se asigna automáticamente
            dfecha_baja: '',
            bhabilitado: true,
          });
          setModo('agregar');

        }}
        onModificar={() => {
          if (!form.bhabilitado) {
            mostrarMensaje('No se puede modificar un registro inactivo', 'error');
            return;
          }
          setModo('modificar');
        }}
        onEliminar={() => {
          if (!form.bhabilitado) {
            mostrarMensaje('El registro ya está inactivo', 'error');
            return;
          }
          setModo('eliminar');
        }}
        onReactivar={async () => {
          if (form.bhabilitado) {
            mostrarMensaje('El registro ya está activo', 'error');
            return;
          }

          if (!confirm('¿Deseas reactivar este programa presupuestal?')) return;

          try {
            await fetch(`http://localhost:3001/programa-presupuestal/reactivar/${form.nid_programa_presupuestal}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
            });

            const nuevos = await fetch('http://localhost:3001/programa-presupuestal').then(r => r.json());
            setProgramas(nuevos);

            setForm(prev => ({
              ...prev,
              bhabilitado: true,
              dfecha_baja: '',
            }));

            setModo('visualizar');
            mostrarMensaje('Programa reactivado correctamente', 'success');
          } catch {
            mostrarMensaje('Error al reactivar el programa', 'error');
          }
        }}
        mostrarInactivos={mostrarInactivos}
        onToggleInactivos={() => setMostrarInactivos(prev => !prev)}
        form={form}
      />



      <FormularioProgramaPresupuestal
        form={form}
        modo={modo}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <TablaProgramasPresupuestales
        programas={programas}
        mostrarInactivos={mostrarInactivos}
      />
    </div>
  );
}
