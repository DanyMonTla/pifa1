'use client';

import React, { useState, ChangeEvent } from 'react';

// Tipos auxiliares
type Vista = 'menu' | 'registrar' | 'ingresar' | 'modificar' | 'eliminar';
type AccionPendiente = 'registrar' | 'modificar' | 'eliminar' | null;

export default function UsuariosPage() {
  const [vista, setVista] = useState<Vista>('menu');
  const [confirmarAccion, setConfirmarAccion] = useState<AccionPendiente>(null);

  const [form, setForm] = useState({
    nombre_usuario: '',
    apellidoP: '',
    apellidoM: '',
    cargoUsuario: '',
    hashed_password: '',
    id_area: '',
    id_rol: '',
  });

  const [login, setLogin] = useState({ nombre_usuario: '', hashed_password: '' });
  const [eliminar, setEliminar] = useState({ nombre_usuario: '', hashed_password: '' });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showEliminarPassword, setShowEliminarPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin(prev => ({ ...prev, [name]: value }));
  };

  const handleEliminarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEliminar(prev => ({ ...prev, [name]: value }));
  };

  const confirmarYProcesar = () => {
    if (confirmarAccion === 'registrar') {
      alert('Usuario registrado correctamente');
      setForm({ nombre_usuario: '', apellidoP: '', apellidoM: '', cargoUsuario: '', hashed_password: '', id_area: '', id_rol: '' });
    } else if (confirmarAccion === 'modificar') {
      alert('Usuario modificado correctamente');
    } else if (confirmarAccion === 'eliminar') {
      alert(`Cuenta eliminada: ${eliminar.nombre_usuario}`);
      setEliminar({ nombre_usuario: '', hashed_password: '' });
    }
    setConfirmarAccion(null);
    setVista('menu');
  };

  const cancelarConfirmacion = () => setConfirmarAccion(null);

  return (
    <div style={pageWrapperStyle}>
      {confirmarAccion && <div style={backdropStyle} />}
      {confirmarAccion && (
        <div style={modalStyle}>
          <h3>¿Estás segur@ de hacer esos cambios?</h3>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={confirmarYProcesar} style={{ ...formSubmitBtnStyle, marginRight: '1rem' }}>Sí</button>
            <button onClick={cancelarConfirmacion} style={volverBtn}>No</button>
          </div>
        </div>
      )}

      <div style={panelStyle}>
        <h2 style={panelTitleStyle}>Gestión de Usuarios</h2>

        {vista === 'menu' && (
          <>
            <button style={menuBtnStyle} onClick={() => setVista('registrar')}>Registrar nuevo usuario</button>
            <button style={menuBtnStyle} onClick={() => setVista('ingresar')}>Ingresar</button>
            <button style={menuBtnStyle} onClick={() => setVista('modificar')}>Modificar usuario</button>
            <button style={menuBtnStyle} onClick={() => setVista('eliminar')}>Eliminar usuario</button>
          </>
        )}

        {vista === 'registrar' && !confirmarAccion && (
          <form onSubmit={(e) => { e.preventDefault(); setConfirmarAccion('registrar'); }} style={{ textAlign: 'left' }}>
            {renderInput('Usuario', 'nombre_usuario', form.nombre_usuario, handleChange)}
            {renderInput('Apellido paterno', 'apellidoP', form.apellidoP, handleChange)}
            {renderInput('Apellido materno', 'apellidoM', form.apellidoM, handleChange)}
            {renderInput('Cargo', 'cargoUsuario', form.cargoUsuario, handleChange)}
            {renderInput('Contraseña', 'hashed_password', form.hashed_password, handleChange, 'password')}
            {renderInput('ID Área', 'id_area', form.id_area, handleChange, 'number')}
            {renderInput('ID Rol', 'id_rol', form.id_rol, handleChange, 'number')}
            <button type="submit" style={{ ...formSubmitBtnStyle, marginTop: '1rem' }}>Registrar</button>
            <button type="button" onClick={() => setVista('menu')} style={volverBtn}>Volver al menú</button>
          </form>
        )}

        {vista === 'ingresar' && (
          <form onSubmit={(e) => { e.preventDefault(); alert(`Bienvenido, ${login.nombre_usuario}`); setLogin({ nombre_usuario: '', hashed_password: '' }); setVista('menu'); }} style={{ textAlign: 'left' }}>
            {renderLoginInput('Usuario', 'nombre_usuario', login.nombre_usuario, handleLoginChange)}
            <div style={fieldStyle}>
              <label>Contraseña:</label><br />
              <div style={passwordWrapperStyle}>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  name="hashed_password"
                  value={login.hashed_password}
                  onChange={handleLoginChange}
                  required
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                />
                <button type="button" onClick={() => setShowLoginPassword(prev => !prev)} style={eyeBtnStyle}>
                  {showLoginPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" style={{ ...formSubmitBtnStyle, marginTop: '1rem' }}>Ingresar</button>
            <button type="button" onClick={() => setVista('menu')} style={volverBtn}>Volver al menú</button>
          </form>
        )}

        {vista === 'modificar' && !confirmarAccion && (
          <form onSubmit={(e) => { e.preventDefault(); setConfirmarAccion('modificar'); }} style={{ textAlign: 'left' }}>
            {renderInput('Usuario', 'nombre_usuario', form.nombre_usuario, handleChange)}
            {renderInput('Apellido paterno', 'apellidoP', form.apellidoP, handleChange)}
            {renderInput('Apellido materno', 'apellidoM', form.apellidoM, handleChange)}
            {renderInput('Cargo', 'cargoUsuario', form.cargoUsuario, handleChange)}
            {renderInput('Contraseña', 'hashed_password', form.hashed_password, handleChange, 'password')}
            {renderInput('ID Área', 'id_area', form.id_area, handleChange, 'number')}
            {renderInput('ID Rol', 'id_rol', form.id_rol, handleChange, 'number')}
            <button type="submit" style={{ ...formSubmitBtnStyle, marginTop: '1rem' }}>Guardar cambios</button>
            <button type="button" onClick={() => setVista('menu')} style={volverBtn}>Volver al menú</button>
          </form>
        )}

        {vista === 'eliminar' && !confirmarAccion && (
          <form onSubmit={(e) => { e.preventDefault(); setConfirmarAccion('eliminar'); }} style={{ textAlign: 'left' }}>
            {renderLoginInput('Usuario', 'nombre_usuario', eliminar.nombre_usuario, handleEliminarChange)}
            <div style={fieldStyle}>
              <label>Contraseña:</label><br />
              <div style={passwordWrapperStyle}>
                <input
                  type={showEliminarPassword ? 'text' : 'password'}
                  name="hashed_password"
                  value={eliminar.hashed_password}
                  onChange={handleEliminarChange}
                  required
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                />
                <button type="button" onClick={() => setShowEliminarPassword(prev => !prev)} style={eyeBtnStyle}>
                  {showEliminarPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" style={{ ...formSubmitBtnStyle, marginTop: '1rem' }}>Eliminar</button>
            <button type="button" onClick={() => setVista('menu')} style={volverBtn}>Volver al menú</button>
          </form>
        )}
      </div>
    </div>
  );
}

// --- Funciones auxiliares ---
const renderInput = (label: string, name: string, value: string, onChange: React.ChangeEventHandler, type: string = 'text') => (
  <div style={fieldStyle}>
    <label>{label}:</label><br />
    <input type={type} name={name} value={value} onChange={onChange} required style={inputStyle} />
  </div>
);

const renderLoginInput = (label: string, name: string, value: string, onChange: React.ChangeEventHandler, type: string = 'text') => (
  <div style={fieldStyle}>
    <label>{label}:</label><br />
    <input type={type} name={name} value={value} onChange={onChange} required style={inputStyle} />
  </div>
);

// --- Estilos ---
const pageWrapperStyle: React.CSSProperties = {
  padding: '2rem',
  position: 'relative',
  backgroundColor: '#333333',
  minHeight: '100vh',
};

const panelStyle: React.CSSProperties = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '2rem',
  border: '1px solid #cfd8e3',
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  color: '#0F172A',
};

const panelTitleStyle: React.CSSProperties = {
  color: '#0F172A',
  marginBottom: '1.5rem',
};

const menuBtnStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    fontSize: '16px',
    borderRadius: '0px', // 🔥 Rectángulo picudo
    border: 'none',
    backgroundColor: '#003B5C',
    color: '#FFFFFF',
    cursor: 'pointer',
  };
  
  const formSubmitBtnStyle: React.CSSProperties = {
    ...menuBtnStyle, // 🔥 Heredamos el mismo estilo, ya picudo
  };
  
  const volverBtn: React.CSSProperties = {
    ...formSubmitBtnStyle,
    backgroundColor: '#d1d5db',
    color: '#0F172A',
    marginTop: '0.5rem',
  };
  

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '6px',
  border: '1px solid #cfd8e3',
  backgroundColor: '#e6efff',
  color: '#0F172A',
};

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFFFFF',
  padding: '2rem',
  borderRadius: '12px',
  zIndex: 1000,
  textAlign: 'center',
  color: '#0F172A',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 999,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '1rem',
};

const passwordWrapperStyle: React.CSSProperties = {
  position: 'relative',
};

const eyeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '0.5rem',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
};
