'use client';

import React from 'react';
import { Usuario, Area, Rol } from '../components/tiposUsuarios';

type Props = {
  usuarios: Usuario[];
  areas: Area[];
  roles: Rol[];
  mostrarInactivos: boolean;
};

export default function UsuariosTabla({ usuarios, areas, roles, mostrarInactivos }: Props) {
  const usuariosFiltrados = mostrarInactivos
  ? usuarios
  : usuarios.filter(u => String(u.bhabilitado).toLowerCase() === 'true');


  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '2rem',
      backgroundColor: 'white',
    }}>
      <thead>
        <tr>
          {[
            'ID', 'Nombre', 'Apellido P', 'Apellido M', 'Cargo', 'Área',
            'Rol', 'Título', 'Alta', 'Baja', 'Habilitado'
          ].map(col => (
            <th key={col} style={{
              border: '1px solid #ccc',
              padding: '10px',
              backgroundColor: '#003B5C',
              color: 'white',
              textAlign: 'center'
            }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {usuariosFiltrados.map((u) => {
          const areaTexto = areas.find(a => a.idArea === u.nid_area)?.unidad || u.nid_area;
          const rolTexto = roles.find(r => r.id_rol === u.nid_rol)?.rol || u.nid_rol;

          return (
            <tr
              key={u.cid_usuario}
              style={{
                backgroundColor: u.bhabilitado ? 'white' : '#f8d7da',
                
              }}
            >
              <td style={tdStyle}>{u.cid_usuario}</td>
              <td style={tdStyle}>{u.cnombre_usuario}</td>
              <td style={tdStyle}>{u.capellido_p_usuario}</td>
              <td style={tdStyle}>{u.capellido_m_usuario}</td>
              <td style={tdStyle}>{u.ccargo_usuario}</td>
              <td style={tdStyle}>{areaTexto}</td>
              <td style={tdStyle}>{rolTexto}</td>
              <td style={tdStyle}>{u.btitulo_usuario}</td>
              <td style={tdStyle}>{u.dfecha_alta?.slice(0, 10)}</td>
              <td style={tdStyle}>{u.dfecha_baja ? u.dfecha_baja.slice(0, 10) : '-'}</td>
              <td style={{
                ...tdStyle,
                color: u.bhabilitado ? 'green' : 'red',
              }}>
                {u.bhabilitado ? 'Sí' : 'No'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  backgroundColor: 'white',
  color: 'black',
};
