import React from 'react';

type Indicador = any;

type Props = {
  defaultColumns: { key: string; label: string }[];
  filteredIndicadores: Indicador[];
  filters: { [k: string]: string };
  setFilters: React.Dispatch<React.SetStateAction<{ [k: string]: string }>>;
  usuarioValido: boolean;
  checkedRows: { [key: number]: boolean };
  handleCheckboxChange: (nid_indicador: number) => void;
  getColValue: (ind: Indicador, key: string) => React.ReactNode;
  filterInputStyle: React.CSSProperties;
  thStyle: React.CSSProperties;
  tdStyle: React.CSSProperties;
  checkboxStyle: React.CSSProperties;
  btnSecStyle: string;
  btnStyle: string;
};


const tablaStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  minWidth: 900,
  tableLayout: 'auto', // Cambiado de 'fixed' a 'auto' para evitar encimado
  userSelect: 'text' as const,
  fontFamily: 'inherit',
  fontSize: '1rem',
  boxShadow: '0 2px 8px #0002',
  borderRadius: 8,
  overflow: 'hidden',
};

const IndicadoresAsignacionTabla: React.FC<Props & { guardarAsignaciones: () => void }> = ({
  defaultColumns,
  filteredIndicadores,
  filters,
  setFilters,
  usuarioValido,
  checkedRows,
  handleCheckboxChange,
  getColValue,
  filterInputStyle,
  thStyle,
  tdStyle,
  checkboxStyle,
  btnSecStyle,
  btnStyle,
  guardarAsignaciones,
}) => (
  <div style={{overflowX: 'auto', marginBottom: 24, opacity: usuarioValido ? 1 : 0.5, pointerEvents: usuarioValido ? 'auto' : 'none'}}>
    <div className="flex justify-end mb-2">
      <button
        className={btnSecStyle}
        type="button"
        onClick={() => setFilters({})}
        disabled={!usuarioValido}
      >
        Quitar filtros
      </button>
    </div>
    <table style={tablaStyle}>
      <colgroup>
        <col style={{ width: '70px' }} />
        {defaultColumns.map((_, idx) => (
          <col key={idx} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: 70, textAlign: 'center' as const }}>Seleccionar</th>
          {defaultColumns.map(col => (
            <th key={col.key} style={thStyle}>{col.label}</th>
          ))}
        </tr>
        <tr>
          <th></th>
          {defaultColumns.map(col => (
            <th key={col.key} style={thStyle}>
              <input
                type="text"
                placeholder={`Filtrar ${col.label}`}
                value={filters[col.key] || ''}
                onChange={e => setFilters(f => ({ ...f, [col.key]: e.target.value }))}
                style={filterInputStyle}
                disabled={!usuarioValido}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredIndicadores.map(ind => (
          <tr key={ind.nid_indicador}>
            <td style={{ textAlign: 'center' as const, ...tdStyle, width: 70, minWidth: 70, maxWidth: 70, padding: '0.2rem 0.5rem' }}>
              <input
                type="checkbox"
                checked={!!checkedRows[ind.nid_indicador]}
                onChange={() => handleCheckboxChange(ind.nid_indicador)}
                disabled={!usuarioValido}
                style={{ ...checkboxStyle, width: 28, height: 28 }}
              />
            </td>
            {defaultColumns.map(col => (
          <td key={col.key} style={{...tdStyle, whiteSpace: 'normal', wordBreak: 'break-word'}}>{getColValue(ind, col.key)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <button
      className={btnStyle}
      onClick={guardarAsignaciones}
      disabled={!usuarioValido}
      style={{marginTop: 16}}
    >
      Guardar selección
    </button>
  </div>
);

export default IndicadoresAsignacionTabla;
