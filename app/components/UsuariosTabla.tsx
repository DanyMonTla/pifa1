'use client';

import React from 'react';
import { Usuario, Area, Rol } from '../components/tiposUsuarios';

type Props = {
  usuarios: Usuario[];
  areas: Area[];
  roles: Rol[];
  mostrarInactivos: boolean;
  busquedaNombre: string;
};

export default function UsuariosTabla({ usuarios, areas, roles, mostrarInactivos, busquedaNombre }: Props) {
  const usuariosFiltrados = usuarios
    .filter(u => mostrarInactivos || u.bhabilitado)
    .filter(u =>
      (u.cnombre_usuario ?? '').toLowerCase().includes((busquedaNombre ?? '').toLowerCase())
    );


  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '2rem',
      backgroundColor: 'white',
    }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>RFC</th>
          <th style={thStyle}>Nombre</th>
          <th style={thStyle}>Apellido P</th>
          <th style={thStyle}>Apellido M</th>
          <th style={thStyle}>Cargo</th>
          <th style={thStyle}>Área</th>
          <th style={thStyle}>Rol</th>
          <th style={thStyle}>Título</th>
          <th style={thStyle}>Activo</th>
          {mostrarInactivos && <th style={thStyle}>Fecha Baja</th>}
        </tr>
      </thead>
      <tbody>
        {usuariosFiltrados.map((u) => {
          const areaNombre = areas.find(a => a.idArea === String(u.nid_area))?.rawUnidad || 'Área desconocida';
          const rolNombre = roles.find(r => r.id_rol === String(u.nid_rol))?.rawRol || 'Rol desconocido';
          return (
            <tr key={u.cid_usuario} style={{ backgroundColor: u.bhabilitado ? 'white' : '#d3d3d3' }}>
              <td style={tdStyle}>{u.cid_usuario}</td>
              <td style={tdStyle}>{u.rfc}</td>
              <td style={tdStyle}>{u.cnombre_usuario}</td>
              <td style={tdStyle}>{u.capellido_p_usuario}</td>
              <td style={tdStyle}>{u.capellido_m_usuario}</td>
              <td style={tdStyle}>{u.ccargo_usuario}</td>
              <td style={tdStyle}>{areaNombre}</td>
              <td style={tdStyle}>{rolNombre}</td>
              <td style={tdStyle}>{u.btitulo_usuario}</td>
              <td style={{ ...tdStyle, color: u.bhabilitado ? 'green' : 'red' }}>
                {u.bhabilitado ? 'Sí' : 'No'}
              </td>
              {mostrarInactivos && (
                <td style={tdStyle}>
                  {u.dfecha_baja ? u.dfecha_baja.slice(0, 10) : '-'}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '10px',
  backgroundColor: '#003B5C',
  color: 'white',
  textAlign: 'center'
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  color: 'black',
};
