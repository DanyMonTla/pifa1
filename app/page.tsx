'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mostrarPromociones, setMostrarPromociones] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return (
      <div style={{
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'left', lineHeight: '1.6', maxWidth: '600px' }}>
            <h1 style={{
              color: '#1f2e52',
              fontWeight: '900',
              margin: 0,
              fontSize: '2.6rem'
            }}>
              Bienvenido al sistema<br />de
            </h1>
            <h1 style={{
              color: '#c89700',
              fontWeight: '900',
              margin: 0,
              fontSize: '2.6rem'
            }}>
              Seguimiento Programático<br />de la FES ACATLÁN
            </h1>
          </div>

          {/* Formulario */}
          <div style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{ fontSize: '1.1rem', fontWeight: '500' }}>Usuario</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  marginTop: '0.3rem',
                  backgroundColor: '#e8f0fe',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  color: '#000'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '1.1rem', fontWeight: '500' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '0.3rem',
                    backgroundColor: '#e8f0fe',
                    border: '1px solid #ccc',
                    borderRadius: '6px',
                    paddingRight: '2.5rem',
                    fontSize: '1rem',
                    color: '#000'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0.7rem',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.25rem'
                  }}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              style={{
                backgroundColor: '#0070f3',
                color: '#fff',
                fontWeight: 'bold',
                border: 'none',
                padding: '0.75rem',
                cursor: 'pointer',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 👇 Contenido principal ya autenticado
  return (
    <div className="home-container" style={{ padding: '2rem', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ color: '#fff' }}>Bienvenido al Sistema de Indicadores</h1>

      {/* Bloque de novedades */}
      <div style={{
        backgroundColor: "#1e1e1e",
        color: "#f0f0f0",
        padding: "1.5rem",
        marginTop: "1.5rem",
        borderRadius: "10px",
        maxWidth: "600px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        borderLeft: "6px solid #007acc"
      }}>
        <h3 style={{
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          fontSize: "1.2rem",
          color: "#ffffff"
        }}>
          <span style={{
            backgroundColor: "#007acc",
            borderRadius: "50%",
            width: "1.5rem",
            height: "1.5rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "0.5rem"
          }}>📰</span>
          Novedades
        </h3>
        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#ffffff" }}>21 de mayo:</strong> Se agregó el módulo de Frecuencia con nuevas funciones.
          </li>
          <li style={{ marginBottom: "0.5rem" }}>
            <strong style={{ color: "#ffffff" }}>15 de mayo:</strong> Se actualizaron los catálogos de Tipo Cálculo.
          </li>
          <li>
            <strong style={{ color: "#ffffff" }}>9 de mayo:</strong> Integración con nuevo servidor de base de datos.
          </li>
        </ul>
      </div>
{/* Botón y sección de promociones - versión grande */}
<div style={{
  position: 'absolute',
  top: '6rem',
  right: '2rem',
  width: '360px',
  zIndex: 10
}}>
  <button
    onClick={() => setMostrarPromociones(!mostrarPromociones)}
    style={{
      backgroundColor: '#ffc107',
      color: '#000',
      padding: '1rem 1.5rem',
      fontSize: '1.1rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      width: '100%',
      textAlign: 'left',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    }}
  >
    {mostrarPromociones ? '🔽 Ocultar Promociones' : '🔼 Ver Promociones'}
  </button>

  {mostrarPromociones && (
    <div style={{
      backgroundColor: "#2b2b2b",
      color: "#f8f9fa",
      padding: "1.5rem",
      marginTop: "1rem",
      borderRadius: "12px",
      boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
      borderLeft: "6px solid #ffc107",
      fontSize: '1.1rem',
      lineHeight: '1.7'
    }}>
      <h4 style={{ marginBottom: "1rem", color: "#ffc107", fontSize: '1.4rem' }}>🎉 Promociones y Avisos Especiales</h4>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        <li style={{ marginBottom: "0.8rem" }}>
          🎁 <strong>Curso gratuito:</strong> Capacitación en manejo del sistema. <em>¡Inscripciones abiertas!</em>
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          📢 <strong>Descuento institucional:</strong> En nuevas licencias del sistema para otras sedes.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          🕒 <strong>Vigencia:</strong> Hasta el <strong>31 de mayo</strong>.
        </li>
        <li style={{ marginBottom: "0.8rem" }}>
          🎓 <strong>Reconocimientos:</strong> Participa en los retos del mes y gana diplomas digitales.
        </li>
        <li>
          📌 <strong>Soporte:</strong> Atención personalizada de lunes a viernes, 9 am – 6 pm.
        </li>
      </ul>
    </div>
  )}
</div>



      {/* Navegación */}
      <div className="navigation-buttons" style={{ marginTop: '2rem' }}>
        <button
          className="primary-button"
          style={buttonStyle}
          onClick={() => router.push('/Logros')}>
          Ver Logros
        </button>

        <button
          className="primary-button"
          style={buttonStyle}
          onClick={() => router.push('/Fechas')}>
          Fechas
        </button>

        <button
          className="primary-button"
          style={buttonStyle}
          onClick={() => router.push('/ABC')}>
          CATÁLOGOS
        </button>
      </div>
   
   {/* Panel de ayuda inferior - más separado del contenido */}
<div style={{
  backgroundColor: '#e0e0e0',
  padding: '2.5rem 3rem',
  marginTop: '8rem', // ⬅️ Aumentado para bajarlo más
  width: '100%',
  color: '#222',
  fontSize: '1.1rem',
  lineHeight: '1.8',
  borderTop: '5px solid #0070f3',
  display: 'flex',
  justifyContent: 'center'
}}>
  <div style={{
    maxWidth: '700px',
    width: '100%'
  }}>
    <h2 style={{
      color: '#111',
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center'
    }}>
      <span style={{
        backgroundColor: '#0070f3',
        color: '#fff',
        borderRadius: '50%',
        width: '2rem',
        height: '2rem',
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '1rem',
        fontSize: '1.3rem'
      }}>❓</span>
      ¿Necesitas ayuda?
    </h2>

    <ul style={{ listStyle: 'disc', paddingLeft: '2rem', margin: 0 }}>
      <li style={{ marginBottom: '1rem' }}>
        Consulta los catálogos disponibles para comenzar a capturar datos correctamente.
      </li>
      <li style={{ marginBottom: '1rem' }}>
        Recuerda dar clic en <strong>“Guardar”</strong> después de cualquier modificación.
      </li>
      <li style={{ marginBottom: '1rem' }}>
        Puedes filtrar registros por estado o tipo de indicador para facilitar la búsqueda.
      </li>
      <li style={{ marginBottom: '1rem' }}>
        Asegúrate de completar todos los campos obligatorios en los formularios.
      </li>
      <li>
        ¿Problemas técnicos? Contacta a <strong>soporte@acatlan.unam.mx</strong> para asistencia.
      </li>
    </ul>
  </div>
</div>



    </div>
  )
}

const buttonStyle = {
  backgroundColor: '#005f73',
  color: '#fff',
  padding: '0.75rem 1.25rem',
  marginRight: '1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
}
const linkStyle = {
  color: '#0066cc',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.75rem',
  fontWeight: '500'
}

