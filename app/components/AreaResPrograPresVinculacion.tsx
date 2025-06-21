'use client';
import React, { useMemo, useState, useEffect } from 'react';

type AreaResponsable = {
  nid_area: string;
  cunidad_responsable: string;
};

type ProgramaPresupuestal = {
  nid_programa_presupuestal: string;
  cprograma_presupuestal: string;
};

type Vinculacion = {
  nid_area: string;
  nid_programa: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  areas: AreaResponsable[];
  programas: ProgramaPresupuestal[];
  vinculaciones: Vinculacion[];
  toggleVinculacion: (nid_area: string, nid_programa: string) => void;
  onGuardar: () => Promise<void>;
};

export default function AreaResPrograPresVinculacion({
  visible,
  onClose,
  areas,
  programas,
  vinculaciones,
  toggleVinculacion,
  onGuardar,
}: Props) {
  const [guardando, setGuardando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [filtro, setFiltro] = useState('');

  // Bloquea scroll + cierre con ESC
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [visible, onClose]);

  const vinculacionSet = useMemo(() => {
    return new Set((vinculaciones ?? []).map(v => `${v.nid_area}_${v.nid_programa}`));
  }, [vinculaciones]);

  const normalizarTexto = (txt: string) =>
    txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const areasFiltradas = useMemo(() => {
    const texto = normalizarTexto(filtro);
    return areas.filter(a =>
      normalizarTexto(a.cunidad_responsable).includes(texto)
    );
  }, [filtro, areas]);

  const handleGuardar = async () => {
    if (vinculaciones.length === 0) {
      setMensajeExito("❗ No hay vinculaciones seleccionadas");
      setTimeout(() => setMensajeExito(''), 2000);
      return;
    }

    setGuardando(true);
    try {
      await onGuardar(); // No hay alert aquí
      setMensajeExito('✅ Vinculaciones guardadas en memoria');
      setTimeout(() => setMensajeExito(''), 2000);
    } catch {
      setMensajeExito('❌ Error al guardar las vinculaciones');
      setTimeout(() => setMensajeExito(''), 2000);
    } finally {
      setGuardando(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
      touchAction: 'none'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '1rem',
        width: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: 12,
        color: '#000',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        {/* Header con búsqueda y botones */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #ddd',
          paddingBottom: '0.5rem',
          paddingTop: '0.5rem',
          position: 'sticky',
          top: 0,
          backgroundColor: '#fff',
          zIndex: 10,
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <h2 style={{ flex: 1, textAlign: 'center', fontSize: '1.6rem', margin: 0 }}>
            Vincular Áreas con Programas Presupuestales
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="🔍 Buscar área..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #ccc',
                fontSize: '0.95rem',
                backgroundColor: '#f4f4f4',
                color: '#333',
                width: 240
              }}
            />

            <button
              onClick={onClose}
              style={{
                padding: '6px 12px',
                backgroundColor: '#e74c3c',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold'
              }}>
              ✖ Cerrar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              style={{
                padding: '6px 12px',
                backgroundColor: guardando ? '#aaa' : '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 'bold',
                cursor: guardando ? 'not-allowed' : 'pointer'
              }}>
              {guardando ? 'Guardando...' : '💾 Guardar'}
            </button>
          </div>
        </div>

        {/* Contenido de áreas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 16 }}>
          {areasFiltradas.map(area => (
            <div key={area.nid_area} style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: 10,
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem' }}>
                {area.cunidad_responsable}
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'center'
              }}>
                {programas.map(programa => {
                  const clave = `${area.nid_area}_${programa.nid_programa_presupuestal}`;
                  const isChecked = vinculacionSet.has(clave);
                  return (
                    <label key={clave} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: isChecked ? '#d1ecf1' : '#efefef',
                      border: `1px solid ${isChecked ? '#0c5460' : '#ccc'}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleVinculacion(area.nid_area, programa.nid_programa_presupuestal)}
                        style={{ marginRight: 8 }}
                      />
                      {programa.cprograma_presupuestal}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Notificación de éxito */}
        {mensajeExito && (
          <div style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: mensajeExito.startsWith("✅") ? '#2ecc71' : '#f39c12',
            color: 'white',
            padding: '0.8rem 1.5rem',
            borderRadius: 8,
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 9999,
            textAlign: 'center',
            transition: 'opacity 0.3s ease'
          }}>
            {mensajeExito}
          </div>
        )}
      </div>
    </div>
  );
}
