'use client';

import React from 'react';

type ProgramaPresupuestal = {
  nid_programa_presupuestal: string;
  cprograma_presupuestal: string;
  cdefinicion_programa_presupuestal: string;
  dfecha_alta: string;
  dfecha_baja?: string;
  bhabilitado: boolean;
};

type Props = {
  programas: ProgramaPresupuestal[];
  mostrarInactivos: boolean;
};

export default function TablaProgramasPresupuestales({ programas, mostrarInactivos }: Props) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>Programa Presupuestal</th>
          <th style={thStyle}>Definición</th>
          <th style={thStyle}> Fecha Alta</th>
          <th style={thStyle}>Activo</th>
          {mostrarInactivos && <th style={thStyle}>Fecha Baja</th>}
        </tr>
      </thead>
      <tbody>
        {programas
          .filter(p => mostrarInactivos || p.bhabilitado)
          .map(p => (
            <tr key={p.nid_programa_presupuestal} style={{ opacity: p.bhabilitado ? 1 : 0.5 }}>
              <td style={tdStyle}>{p.nid_programa_presupuestal}</td>
              <td style={tdStyle}>{p.cprograma_presupuestal}</td>
              <td style={tdStyle}>{p.cdefinicion_programa_presupuestal}</td>
              <td style={tdStyle}>{p.dfecha_alta?.split('T')[0]}</td>
              <td style={{ ...tdStyle, color: p.bhabilitado ? 'green' : 'red' }}>
                {p.bhabilitado ? 'Sí' : 'No'}
              </td>
              {mostrarInactivos && (
                <td style={tdStyle}>
                  {p.dfecha_baja ? p.dfecha_baja.split('T')[0] : ''}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#003B5C',
  color: 'white',
  textAlign: 'center',
};

const tdStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center',
};
