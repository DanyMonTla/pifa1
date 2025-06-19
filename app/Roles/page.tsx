'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import RolesFormulario from '../components/RolesFormulario';
import RolesAcciones from '../components/RolesAcciones';

type Rol = {
  nidRol: string;
  crol: string;
  bhabilitado: boolean;
  dfechaAlta: string;
  dfechaBaja?: string;
};

export default function RolesCrud() {
  const [form, setForm] = useState<Rol>({
    nidRol: '',
    crol: '',
    bhabilitado: true,
    dfechaAlta: '',
    dfechaBaja: '',
  });

  const [modo, setModo] = useState<'agregar' | 'modificar' | 'eliminar' | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [busquedaId, setBusquedaId] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [buscando, setBuscando] = useState(false);

  const API_URL = 'http://localhost:3001/roles';

  useEffect(() => {
    obtenerRoles();
  }, []);

  const obtenerRoles = async () => {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const rolesBool = Array.isArray(data)
      ? data.map((r: any) => ({
          ...r,
          nidRol: String(r.nidRol),
          bhabilitado: r.bhabilitado?.data
            ? r.bhabilitado.data[0] === 1
            : Boolean(r.bhabilitado),
        }))
      : [];

    setRoles(rolesBool);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    setMensaje('❌ Error al obtener los roles');
  }
};

  const cargarRolEnFormulario = (rol: Rol) => {
    setForm({
      ...rol,
      dfechaAlta: rol.dfechaAlta ? rol.dfechaAlta.substring(0, 10) : '',
      dfechaBaja: rol.dfechaBaja ? rol.dfechaBaja.substring(0, 10) : '',
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
      };

      const mostrarMensaje = (texto: string, duracion = 2000) => {
        setMensaje(texto);
        setTimeout(() => setMensaje(''), duracion);
      };

      const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const { nidRol, crol, dfechaAlta, bhabilitado, dfechaBaja } = form;
      if (!String(nidRol).trim() || !crol || !dfechaAlta) return alert('Completa todos los campos');

      try {
        if (modo === 'modificar') {
          if (!confirm('¿Actualizar este rol?')) return;
          const res = await fetch(`${API_URL}/${Number(nidRol)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
            nidRol: Number(nidRol), // ✅ conversión obligatoria
            crol,
            bhabilitado,
            dfechaAlta,
            ...(dfechaBaja ? { dfechaBaja } : {}),
          }),

          });
          if (!res.ok) throw new Error(await res.text());
          mostrarMensaje('Rol actualizado');
        } else if (modo === 'eliminar') {
          if (!confirm('¿Inactivar este rol?')) return;
          await fetch(`${API_URL}/estado/${Number(nidRol)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: false }),
          });
          mostrarMensaje('Rol inactivado');
        } else if (modo === 'agregar') {
          if (!confirm('¿Agregar nuevo rol?')) return;

          const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nidRol: Number(nidRol), // ✅ obligatorio para pasar validación
              crol,
              bhabilitado,
              dfechaAlta,
              ...(dfechaBaja ? { dfechaBaja } : {}),
            }),
          });

          if (!res.ok) throw new Error(await res.text());
          mostrarMensaje('Rol agregado');
        }


        await obtenerRoles();
        resetForm();
      } catch (err: any) {
        alert('Error en la operación: ' + err.message);
      }
    };


  const resetForm = () => {
  const hoy = new Date().toISOString().split('T')[0]; // ✅ Fecha automática

    setForm({
      nidRol: '',
      crol: '',
      bhabilitado: true,
      dfechaAlta: hoy, // ✅ Se asigna automáticamente
      dfechaBaja: '',
    });

    setModo(null);
    setBusquedaId('');
  };

  const buscarRol = async () => {
    const id = busquedaId.trim();
    if (!id) return alert('Ingresa un ID para buscar');

    setBuscando(true);

    const encontrado = roles.find(r => String(r.nidRol) === id);

    if (encontrado) {
      cargarRolEnFormulario(encontrado);
    } else {
      mostrarMensaje('❌ No se encontró un rol con ese ID', 2000);
    }

    setTimeout(() => setBuscando(false), 500);
  };

  const reactivarRol = async () => {
    if (!confirm('¿Deseas reactivar este rol?')) return;
    try {
      await fetch(`${API_URL}/reactivar/${Number(form.nidRol)}`, {
        method: 'PATCH',
      });
      mostrarMensaje('Rol reactivado');
      await obtenerRoles();
      setForm(prev => ({ ...prev, bhabilitado: true, dfechaBaja: '' }));
      setModo(null);
    } catch {
      mostrarMensaje('Error al reactivar', 3000);
    }
  };

  const obtenerTitulo = () => {
    if (modo === 'agregar') return 'Agregar nuevo rol';
    if (modo === 'modificar') return 'Modificar rol';
    if (modo === 'eliminar') return 'Eliminar rol';
    return 'Catálogo de Roles';
  };

  return (
    <div style={{ backgroundColor: '#222', color: 'white', padding: '2rem', position: 'relative' }}>
      

      {mensaje && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: mensaje.includes('❌') ? '#d32f2f' : 'green',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '8px',
            zIndex: 1000,
          }}
        >
          {mensaje}
        </div>
      )}

      <RolesAcciones
        form={form} // ✅ esta línea es necesaria
        busquedaId={busquedaId}
        setBusquedaId={setBusquedaId}
        buscarRol={buscarRol}
        setModo={setModo}
        resetForm={resetForm}
        mostrarInactivos={mostrarInactivos}
        setMostrarInactivos={setMostrarInactivos}
        puedeReactivar={mostrarInactivos && !form.bhabilitado}
        reactivarRol={reactivarRol}
      />


      {(modo !== null || form.nidRol !== '') && (
        <RolesFormulario
          form={form}
          modo={modo}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={headerEstilo}>ID Rol</th>
            <th style={headerEstilo}>Rol</th>
            {/* <th style={headerEstilo}>Fecha Alta</th> 👈 Eliminado */}
            <th style={headerEstilo}>Activo</th>
            {mostrarInactivos && (
              <th style={headerEstilo}>Fecha Baja</th>
            )}
          </tr>
        </thead>
        <tbody>
          {roles
            .filter(r => mostrarInactivos || r.bhabilitado)
            .map(r => (
              <tr key={r.nidRol} style={{ backgroundColor: r.bhabilitado ? 'white' : '#888', color: '#000' }}>
                <td style={celdaEstilo}>{r.nidRol}</td>
                <td style={celdaEstilo}>{r.crol}</td>
                {/* <td style={celdaEstilo}>{r.dfechaAlta?.substring(0, 10)}</td> 👈 Eliminado */}
                <td style={{ ...celdaEstilo, color: r.bhabilitado ? 'green' : 'red' }}>
                  {r.bhabilitado ? 'Sí' : 'No'}
                </td>
                {mostrarInactivos && (
                  <td style={celdaEstilo}>
                    {r.dfechaBaja ? r.dfechaBaja.substring(0, 10) : '-'}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

const headerEstilo: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#003B5C',
  color: 'white',
  textAlign: 'center',
};

const celdaEstilo: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
};
