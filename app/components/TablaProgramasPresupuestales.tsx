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
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, width: '60px' }}>ID</th>
            <th style={{ ...thStyle, width: '220px' }}>Programa Presupuestal</th>
            <th style={{ ...thStyle }}>Objetivo</th>
            <th style={{ ...thStyle, width: '120px', whiteSpace: 'nowrap' }}>Fecha Alta</th>
            <th style={{ ...thStyle, width: '80px' }}>Activo</th>
            {mostrarInactivos && (
              <th style={{ ...thStyle, width: '120px', whiteSpace: 'nowrap' }}>Fecha Baja</th>
            )}
          </tr>
        </thead>
        <tbody>
          {programas
            .filter(p => mostrarInactivos || p.bhabilitado)
            .map(p => (
              <tr
                key={p.nid_programa_presupuestal}
                style={{
                  backgroundColor: p.bhabilitado ? 'white' : '#bbb',
                  color: '#000',
                }}
              >
                <td style={tdStyle}>{p.nid_programa_presupuestal}</td>
                <td style={tdStyle}>{p.cprograma_presupuestal}</td>
                <td style={{ ...tdStyle, textAlign: 'justify', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {p.cdefinicion_programa_presupuestal}
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{p.dfecha_alta?.split('T')[0]}</td>
                <td style={{ ...tdStyle, color: p.bhabilitado ? 'green' : 'red' }}>
                  {p.bhabilitado ? 'Sí' : 'No'}
                </td>
                {mostrarInactivos && (
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                    {p.dfecha_baja ? p.dfecha_baja.split('T')[0] : '-'}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
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
  textAlign: 'center',
  verticalAlign: 'top',
};
