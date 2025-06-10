'use client';
import React, { useState } from 'react';

interface TipoEducacionContinua {
    id: number;
    tipo: string;
}

export default function TipoEducacionContinuaABC() {
    const [lista, setLista] = useState<TipoEducacionContinua[]>([]);
    const [tipo, setTipo] = useState('');
    const [seleccionado, setSeleccionado] = useState<number | null>(null);

    const handleAgregar = () => {
    if (!tipo.trim()) return;
    const nuevo: TipoEducacionContinua = {
        id: Date.now(),
        tipo,
    };
    setLista([...lista, nuevo]);
    setTipo('');
    };

    const handleModificar = () => {
    if (seleccionado === null || !tipo.trim()) return;
    setLista(prev =>
        prev.map(item =>
        item.id === seleccionado ? { ...item, tipo } : item
        )
    );
    setSeleccionado(null);
    setTipo('');
    };

    const handleEliminar = () => {
    if (seleccionado === null) return;
    setLista(prev => prev.filter(item => item.id !== seleccionado));
    setSeleccionado(null);
    setTipo('');
    };

    const seleccionarFila = (item: TipoEducacionContinua) => {
    setSeleccionado(item.id);
    setTipo(item.tipo);
    };

    return (
    <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center' }}>Catálogo Tipo Educación Continua</h2>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
            type="text"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            placeholder="Nombre del tipo"
            style={{ flex: 1, padding: '0.5rem' }}
        />

        <button onClick={handleAgregar} style={botonEstilo}>Agregar</button>
        <button onClick={handleModificar} style={botonEstilo}>Modificar</button>
        <button onClick={handleEliminar} style={{ ...botonEstilo, backgroundColor: '#8B0000' }}>Eliminar</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead style={{ backgroundColor: '#003B5C', color: 'white' }}>
            <tr>
            <th style={th}>ID</th>
            <th style={th}>Tipo</th>
            <th style={th}>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {lista.map(item => (
            <tr key={item.id} style={{ backgroundColor: item.id === seleccionado ? '#f0f8ff' : 'white' }}>
                <td style={td}>{item.id}</td>
                <td style={td}>{item.tipo}</td>
                <td style={td}>
                <button onClick={() => seleccionarFila(item)} style={{ cursor: 'pointer' }}>
                    Seleccionar
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    );
}

const botonEstilo: React.CSSProperties = {
    padding: '0.5rem 1rem',
    backgroundColor: '#003B5C',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold'
};

const th: React.CSSProperties = {
    padding: '0.5rem',
    border: '1px solid #ccc',
    textAlign: 'left'
};

const td: React.CSSProperties = {
    padding: '0.5rem',
    border: '1px solid #ccc'
};
