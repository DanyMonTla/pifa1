'use client';

import React, { useEffect, useState } from 'react';
import IndicadoresAsignacionTabla from './IndicadoresAsignacionTabla';
import { useRouter } from 'next/navigation';
// Estados para la tabla de referencia de indicadores
// (deben ir dentro del componente, no fuera)

type Usuario = {
  cid_usuario: number;
  cnombre_usuario: string;
  capellido_p_usuario: string;
  capellido_m_usuario: string;
};

type Indicador = {
  nid_indicador: number;
  cclave_indicador: string;
  cdesc_indicador: string;
};

type Asignacion = {
  nid_indicador: number;
  cid_usuario: number;
};

export default function AsignacionIndicadoresPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  // Para la tabla de referencia de indicadores
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState<Indicador | null>(null);
  const [datosExcel, setDatosExcel] = useState<any[]>([]);

  useEffect(() => {
    // Cargar indicadores desde el backend real
    fetch('http://localhost:3001/indicadores')
      .then((res) => res.json())
      .then(setIndicadores)
      .catch(() => setIndicadores([]));
  }, []);

  // Búsqueda de usuarios con debounce y selección
  const [busqueda, setBusqueda] = useState('');
  useEffect(() => {
    const handler = setTimeout(async () => {
      const query = busqueda.trim();
      const url = query.length === 0
        ? 'http://localhost:3001/usuarios'
        : `http://localhost:3001/usuarios?nombre=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      setUsuarios(data);
    }, 350);
    return () => clearTimeout(handler);
  }, [busqueda]);

  // Cargar asignaciones del usuario y reflejar en los checkboxes
  const cargarAsignaciones = async (cid_usuario: number) => {
    // Cambia la URL a la de tu backend real si es necesario
const res = await fetch(`http://localhost:3001/indicador-usuario/usuario/${cid_usuario}`);    const data = await res.json();
    setAsignaciones(Array.isArray(data) ? data : []);
    // Reflejar en los checkboxes, soportando ambos formatos de respuesta
    const checked: { [key: number]: boolean } = {};
    if (Array.isArray(data)) {
      data.forEach((a: any) => {
        const id = a.nid_indicador ?? a.indicador?.nid_indicador;
        if (id) checked[id] = true;
      });
    }
    setCheckedRows(checked);
  };

  const toggleAsignacion = (nid_indicador: number) => {
    if (!usuarioSeleccionado) return;
    const yaAsignado = asignaciones.some(
      (a) => a.nid_indicador === nid_indicador && a.cid_usuario === usuarioSeleccionado.cid_usuario
    );

    if (yaAsignado) {
      setAsignaciones((prev) =>
        prev.filter(
          (a) =>
            !(
              a.nid_indicador === nid_indicador &&
              a.cid_usuario === usuarioSeleccionado.cid_usuario
            )
        )
      );
    } else {
      setAsignaciones((prev) => [
        ...prev,
        {
          nid_indicador,
          cid_usuario: usuarioSeleccionado.cid_usuario,
        },
      ]);
    }
  };

  // Guardar asignaciones solo cuando el usuario confirma
  const guardarAsignaciones = async () => {
    setShowConfirm(true);
  };

  // Lógica para confirmar y guardar en backend
  const confirmarGuardar = async () => {
    if (!usuarioSeleccionado) return;
    setSaving(true);
    setShowConfirm(false);
    setFeedbackMsg(null);
    try {
      // Obtener asignaciones actuales desde el backend
      const resActuales = await fetch(`http://localhost:3001/indicador-usuario/usuario/${usuarioSeleccionado.cid_usuario}`);
      const actualesRaw = await resActuales.json();
      const actualesIds: number[] = Array.isArray(actualesRaw)
        ? actualesRaw.map((a: any) => a.nid_indicador ?? a.indicador?.nid_indicador).filter((id: any) => typeof id === 'number')
        : [];
      const actualesSet = new Set<number>(actualesIds);
      const seleccionadosSet = new Set<number>(Object.keys(checkedRows).filter(nid => checkedRows[Number(nid)]).map(Number));

      // Calcular asignaciones a agregar y quitar
      const aAgregar = [...seleccionadosSet].filter(nid => !actualesSet.has(nid));
      const aQuitar = [...actualesSet].filter((nid) => !seleccionadosSet.has(nid));

      // Realizar peticiones
      let ok = true;
      for (const nid of aAgregar) {
        const res = await fetch('http://localhost:3001/indicador-usuario/asignar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nid_indicador: nid,
            cid_usuario: usuarioSeleccionado.cid_usuario
          })
        });
        if (!res.ok) {
          ok = false;
          setFeedbackMsg('Error al asignar indicadores.');
          break;
        }
      }
      for (const nid of aQuitar) {
        const res = await fetch(`http://localhost:3001/indicador-usuario/quitar/${nid}/${usuarioSeleccionado.cid_usuario}`, {
          method: 'DELETE'
        });
        if (!res.ok) {
          ok = false;
          setFeedbackMsg('Error al quitar asignaciones.');
          break;
        }
      }
      if (ok) {
        setFeedbackMsg('¡Asignaciones guardadas exitosamente!');
        await cargarAsignaciones(usuarioSeleccionado.cid_usuario);
      }
    } catch (e) {
      setFeedbackMsg('Error de red o backend al guardar.');
    } finally {
      setSaving(false);
    }
  };

  // Estado para checkboxes
  const [checkedRows, setCheckedRows] = useState<{[key:number]: boolean}>({});
  // Estado para el diálogo de confirmación y feedback
  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string|null>(null);
  const [saving, setSaving] = useState(false);

  // Cuando seleccionas usuario, checkedRows se actualiza en cargarAsignaciones
  // El checkbox depende de checkedRows, que se llena con las asignaciones del usuario
  // Si el usuario cambia, checkedRows se actualiza correctamente
  // Ahora solo actualiza el estado local, no el backend
  const handleCheckboxChange = (nid_indicador: number) => {
    setCheckedRows(prev => ({
      ...prev,
      [nid_indicador]: !prev[nid_indicador]
    }));
  };

  // Cuando cambia el usuario seleccionado, consulta las asignaciones y actualiza checkedRows
  useEffect(() => {
    if (usuarioSeleccionado) {
      cargarAsignaciones(usuarioSeleccionado.cid_usuario);
    } else {
      setCheckedRows({});
    }
  }, [usuarioSeleccionado]);

  // Catálogos para mostrar valores descriptivos
  const [frecuencias, setFrecuencias] = useState<any[]>([]);
  const [tiposCalculo, setTiposCalculo] = useState<any[]>([]);
  const [tiposIndicador, setTiposIndicador] = useState<any[]>([]);
  const [clasificaciones, setClasificaciones] = useState<any[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/frecuencias').then(r => r.json()),
      fetch('http://localhost:3001/tipo-calculo').then(r => r.json()),
      fetch('http://localhost:3001/tipo-indicador').then(r => r.json()),
      fetch('http://localhost:3001/clasificacion').then(r => r.json()),
      fetch('http://localhost:3001/programa-presupuestal').then(r => r.json()),
    ]).then(([frec, calc, tipoInd, clas, prog]) => {
      setFrecuencias(Array.isArray(frec) ? frec : frec.data || []);
      setTiposCalculo(Array.isArray(calc) ? calc : calc.data || []);
      setTiposIndicador(Array.isArray(tipoInd) ? tipoInd : tipoInd.data || []);
      setClasificaciones(Array.isArray(clas) ? clas : clas.data || []);
      setProgramas(Array.isArray(prog) ? prog : prog.data || []);
    });
  }, []);

  // Columnas y filtros
  const defaultColumns = [
    { key: 'cclave_indicador', label: 'Clave' },
    { key: 'cdesc_indicador', label: 'Descripción' },
    { key: 'cdefinicion_indicador', label: 'Definición' },
    { key: 'clasificacion', label: 'Clasificación' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'cfuente', label: 'Fuente' },
    { key: 'tipo_calculo', label: 'Tipo Cálculo' },
    { key: 'tipo_indicador', label: 'Tipo Indicador' },
    { key: 'programa', label: 'Programa Presupuestal' },
    { key: 'bhabilitado', label: 'Eliminado' },
  ];
  const [filters, setFilters] = useState<{ [k: string]: string }>({});

  const getColValue = (ind: any, key: string) => {
    if (key === 'bhabilitado') return ind.bhabilitado ? 'No' : 'Sí';
    if (key === 'clasificacion') return clasificaciones.find(c => c.nid_clasificacion === ind.nid_clasificacion)?.cnombre_clasificacion || '';
    if (key === 'frecuencia') return frecuencias.find(f => Number(f.nid_frecuencia) === Number(ind.nid_frecuencia))?.cfrecuencia || '';
    if (key === 'tipo_calculo') return tiposCalculo.find(tc => tc.nid_tipo_calculo === ind.nid_tipo_calculo)?.ctipo_calculo || '';
    if (key === 'tipo_indicador') return tiposIndicador.find(ti => ti.nid_tipo_indicador === ind.nid_tipo_indicador)?.ccolor_indicador || '';
    if (key === 'programa') return programas.find(p => Number(p.nid_programa_presupuestal) === Number(ind.nid_programa_presupuestal))?.cprograma_presupuestal || '';
    return ind[key] ?? '';
  };

  // Filtrado
  const filteredIndicadores = indicadores.filter(ind =>
    defaultColumns.every(col =>
      !filters[col.key] || String(getColValue(ind, col.key)).toLowerCase().includes(filters[col.key].toLowerCase())
    )
  );

  // Estado para controlar si el usuario fue seleccionado de la lista
  const [usuarioValido, setUsuarioValido] = useState(false);

  // Cambia la búsqueda: solo permite seleccionar usuarios de la lista
  const handleUsuarioInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    setUsuarioValido(false);
    setUsuarioSeleccionado(null);
  };

  // Permitir seleccionar usuario con Enter si hay coincidencia exacta
  const handleUsuarioKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && usuarios.length === 1) {
      handleUsuarioSelect(usuarios[0]);
    }
  };

  const handleUsuarioSelect = (u: Usuario) => {
    setUsuarioSeleccionado(u);
    setUsuarioValido(true);
    cargarAsignaciones(u.cid_usuario);
    setBusqueda(`${u.cnombre_usuario} ${u.capellido_p_usuario} ${u.capellido_m_usuario}`);
    setUsuarios([]);
  };

  // Mostrar sugerencia aunque solo haya un usuario y la búsqueda esté vacía
  const usuariosParaMostrar = busqueda.trim().length === 0 && usuarios.length === 1
    ? usuarios
    : usuarios.filter(u => {
        const nombreCompleto = `${u.cnombre_usuario} ${u.capellido_p_usuario} ${u.capellido_m_usuario}`.toLowerCase();
        return nombreCompleto.includes(busqueda.trim().toLowerCase());
      });

  // Estilos similares a IndicadoresTabla
  const tablaStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    minWidth: 900,
    tableLayout: 'fixed',
    userSelect: 'text',
    fontFamily: 'inherit',
    fontSize: '1rem',
    boxShadow: '0 2px 8px #0002',
    borderRadius: 8,
    overflow: 'hidden',
  };
  const thStyle = {
    padding: '0.7rem',
    border: '1px solid #d0d0d0',
    background: '#003B5C',
    color: '#fff',
    fontWeight: 700,
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
  };
  const tdStyle = {
    border: '1px solid #d0d0d0',
    padding: '0.5rem',
    background: 'transparent',
    userSelect: 'text' as const,
    fontSize: '1rem',
    whiteSpace: 'nowrap' as const,
  };
  const filterInputStyle = {
    width: '95%', fontSize: 13, padding: 2, margin: 1, border: '1px solid #ddd', borderRadius: 4
  };
  const btnStyle =
    'bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-6 rounded transition-colors duration-200';
  const btnSecStyle =
    'bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mb-4 font-bold';
  const usuarioBtnStyle = (selected: boolean) =>
    `px-3 py-2 rounded mb-1 mr-2 border font-semibold cursor-pointer transition-colors duration-150 ${selected ? 'bg-blue-700 text-white border-blue-900' : 'bg-white text-blue-900 border-blue-700 hover:bg-blue-100'}`;
  const checkboxStyle = {
    width: 22,
    height: 22,
    accentColor: '#003B5C',
    cursor: 'pointer',
  };

  return (
    <div className="p-6 space-y-4">
      {!usuarioValido && (
        <div style={{color: 'red', fontWeight: 600, marginBottom: 12, fontSize: 18}}>
          Selecciona un usuario antes de asignar indicadores.
        </div>
      )}
      <div className="flex items-center gap-2" style={{position: 'relative'}}>
        <div className="flex-1 flex items-center gap-2">
          <input
            className="border rounded px-2 py-1 w-full"
            placeholder="Buscar usuario por nombre..."
            value={busqueda}
            onChange={handleUsuarioInput}
            onKeyDown={handleUsuarioKeyDown}
            autoFocus
            autoComplete="off"
          />
          <button
            className={btnSecStyle}
            onClick={() => { setBusqueda(''); setUsuarioValido(false); setUsuarioSeleccionado(null); }}
            type="button"
            title="Limpiar búsqueda"
          >
            Limpiar
          </button>
        </div>
        <button
          style={{position: 'absolute', right: 0, background: '#003B5C', color: 'white', fontWeight: 700, padding: '0.5rem 1.5rem', borderRadius: 8, fontSize: '1rem', transition: 'background 0.2s', border: 'none', boxShadow: '0 2px 8px #0002'}}
          className="hover:bg-blue-900"
          onClick={() => router.push('/indicadores')}
          type="button"
        >
          ← Regresar a Indicadores
        </button>
      </div>
      {usuariosParaMostrar.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {usuariosParaMostrar.map((u) => (
            <button
              key={u.cid_usuario}
              className={usuarioBtnStyle(usuarioSeleccionado?.cid_usuario === u.cid_usuario) + ' shadow-sm'}
              onClick={() => handleUsuarioSelect(u)}
              type="button"
              style={{marginRight: 6, marginBottom: 6}}
            >
              {u.cnombre_usuario} {u.capellido_p_usuario} {u.capellido_m_usuario}
            </button>
          ))}
        </div>
      )}
      <div className="mt-8">
        <IndicadoresAsignacionTabla
          defaultColumns={defaultColumns}
          filteredIndicadores={filteredIndicadores}
          filters={filters}
          setFilters={setFilters}
          usuarioValido={usuarioValido}
          checkedRows={checkedRows}
          handleCheckboxChange={handleCheckboxChange}
          getColValue={getColValue}
          filterInputStyle={filterInputStyle}
          thStyle={thStyle}
          tdStyle={tdStyle}
          checkboxStyle={checkboxStyle}
          btnSecStyle={btnSecStyle}
          btnStyle={btnStyle}
          guardarAsignaciones={guardarAsignaciones}
        />
      </div>

      {/* Diálogo de confirmación */}
      {showConfirm && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'#0008', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div style={{background:'#fff', padding:32, borderRadius:12, minWidth:320, boxShadow:'0 4px 24px #0004', textAlign:'center'}}>
            <div style={{fontSize:20, fontWeight:700, marginBottom:16}}>¿Estás seguro de hacer cambios?</div>
            <div style={{marginBottom:24}}>Se actualizarán las asignaciones de indicadores para el usuario seleccionado.</div>
            <button className={btnStyle} style={{marginRight:16}} onClick={confirmarGuardar} disabled={saving}>Confirmar</button>
            <button className={btnSecStyle} onClick={()=>setShowConfirm(false)} disabled={saving}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Mensaje de feedback */}
      {feedbackMsg && (
        <div style={{position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#003B5C', color:'#fff', padding:'16px 32px', borderRadius:8, fontSize:18, fontWeight:600, zIndex:1001, boxShadow:'0 2px 8px #0004'}}>
          {feedbackMsg}
          <button style={{marginLeft:24, background:'#fff', color:'#003B5C', border:'none', borderRadius:6, padding:'4px 16px', fontWeight:700, cursor:'pointer'}} onClick={()=>setFeedbackMsg(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
