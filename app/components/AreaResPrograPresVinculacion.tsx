'use client';
import React, { useState, useEffect, useRef } from 'react';

export type AreaResponsable = {
  nid_area: string;
  cunidad_responsable: string;
};

export type ProgramaPresupuestal = {
  nid_programa_presupuestal: string;
  cprograma_presupuestal: string;
};

export type Vinculacion = {
  nid_area: number;
  nid_programa_presupuestal: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  areas: AreaResponsable[];
  programas: ProgramaPresupuestal[];
  vinculaciones: Vinculacion[];
  setVinculaciones: React.Dispatch<React.SetStateAction<Vinculacion[]>>;
};

export default function AreaResPrograPresVinculacion({
  visible,
  onClose,
  areas,
  programas,
  vinculaciones,
  setVinculaciones,
}: Props) {
  const [guardando, setGuardando] = useState(false);
  const [mensajeToast, setMensajeToast] = useState('');
  const [filtro, setFiltro] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [visible, onClose]);

  useEffect(() => {
    if (!visible) return;

    const el = modalRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) e.preventDefault();
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (el.scrollTop === 0) e.preventDefault();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('keydown', handleKeyDown, true);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [visible]);

  const toggleVinculacion = async (nid_area: number, nid_programa_presupuestal: number) => {
    const clave = `${nid_area}_${nid_programa_presupuestal}`;
    const vincSet = new Set(vinculaciones.map(v => `${v.nid_area}_${v.nid_programa_presupuestal}`));
    const yaMarcada = vincSet.has(clave);

    if (yaMarcada) {
      setVinculaciones(prev =>
        prev.filter(v => !(v.nid_area === nid_area && v.nid_programa_presupuestal === nid_programa_presupuestal))
      );

      try {
        const res = await fetch(
          `http://localhost:3001/vinculacion-area-programa/${nid_area}/${nid_programa_presupuestal}`,
          { method: 'DELETE' }
        );
        if (!res.ok) throw new Error('Error al eliminar vinculación');

        lanzarToast('❌ Vinculación eliminada');
      } catch (error) {
        lanzarToast('⚠️ Esta vinculación ya fue eliminada o no existe');
      }
    } else {
      setVinculaciones(prev => [...prev, { nid_area, nid_programa_presupuestal }]);
    }
  };

  const normalizar = (t: string) =>
    t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const areasFiltradas = areas.filter(a =>
    normalizar(a.cunidad_responsable).includes(normalizar(filtro))
  );

  const handleGuardar = async () => {
    if (!vinculaciones.length) {
      lanzarToast('❗ No hay vinculaciones seleccionadas');
      return;
    }

    const payload = vinculaciones.map(v => ({
      nid_area: v.nid_area,
      nid_programa_presupuestal: v.nid_programa_presupuestal,
    }));

    setGuardando(true);
    try {
      const res = await fetch('http://localhost:3001/vinculacion-area-programa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Backend respondió:', errorText);
        throw new Error('Error al guardar');
      }

      lanzarToast('✅ Vinculaciones guardadas correctamente');
    } catch (e) {
      console.error(e);
      lanzarToast('❌ Error al guardar las vinculaciones');
    } finally {
      setGuardando(false);
    }
  };

  const lanzarToast = (msg: string) => {
    setMensajeToast(msg);
    setTimeout(() => setMensajeToast(''), 2500);
  };

  if (!visible) return null;

  const vincSet = new Set(vinculaciones.map(v => `${v.nid_area}_${v.nid_programa_presupuestal}`));

  return (
    <div style={modalFondo}>
      <div ref={modalRef} style={modalContenido} tabIndex={0}>
        <div style={encabezado}>
          <h2 style={titulo}>Vincular Áreas Responsables con Programas Presupuestales</h2>

          <input
            placeholder="🔍 Buscar área..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            style={inputFiltro}
          />

          <button onClick={onClose} style={botonRojo}>✖ Cerrar</button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              ...botonAzul,
              opacity: guardando ? 0.5 : 1,
              cursor: guardando ? 'not-allowed' : 'pointer'
            }}
          >
            {guardando ? 'Guardando...' : '💾 Guardar'}
          </button>
        </div>

        <div style={contenedorTarjetas}>
          {areasFiltradas.map(area => (
            <div key={area.nid_area} style={card}>
              <h3 style={{ textAlign: 'center', color: '#000' }}>{area.cunidad_responsable}</h3>

              <div style={checkboxGrid}>
                {programas.map(p => {
                  const key = `${area.nid_area}_${p.nid_programa_presupuestal}`;
                  const checked = vincSet.has(key);
                  return (
                    <label key={key} style={{
                      ...checkboxLabel,
                      borderColor: checked ? '#0c5460' : '#ccc',
                      background: checked ? '#d1ecf1' : '#efefef'
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleVinculacion(Number(area.nid_area), Number(p.nid_programa_presupuestal))
                        }
                        style={{ marginRight: 6 }}
                      />
                      {p.cprograma_presupuestal}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {mensajeToast && (
          <div style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            backgroundColor: mensajeToast.startsWith('✅') ? '#2ecc71' : '#e67e22',
            color: '#fff', padding: '0.7rem 1.4rem', borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)', fontWeight: 'bold', zIndex: 9999
          }}>
            {mensajeToast}
          </div>
        )}
      </div>
    </div>
  );
}


const modalFondo = {
  position: 'fixed',
  inset: 0,
  backdropFilter: 'blur(1px)',
  backgroundColor: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999
} as React.CSSProperties;

const modalContenido = {
  backgroundColor: '#fff',
  width: '95%',
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: '1rem',
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
  position: 'relative',
  color: '#000'
} as React.CSSProperties;

const encabezado = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #ddd',
  paddingBottom: '0.5rem',
  backgroundColor: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  paddingTop: '0.5rem',
} as React.CSSProperties;


const titulo = {
  flex: 1,
  textAlign: 'center',
  margin: 0,
  color: '#000'
} as React.CSSProperties;

const inputFiltro = {
  width: 240,
  padding: '6px 10px',
  borderRadius: 8,
  border: '1px solid #ccc',
  background: '#f4f4f4',
  color: '#000'
} as React.CSSProperties;

const botonAzul = {
  padding: '6px 12px',
  backgroundColor: '#3498db',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  fontWeight: 'bold',
} as React.CSSProperties;

const botonRojo = {
  ...botonAzul,
  backgroundColor: '#e74c3c',
} as React.CSSProperties;

const card = {
  background: '#f9f9f9',
  padding: '1rem',
  borderRadius: 10,
  border: '1px solid #e0e0e0',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
} as React.CSSProperties;

const contenedorTarjetas = {
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 24
} as React.CSSProperties;

const checkboxGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  justifyContent: 'center'
} as React.CSSProperties;

const checkboxLabel = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 20,
  border: '1px solid',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: '#000'
} as React.CSSProperties;
