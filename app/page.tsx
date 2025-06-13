'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cid_usuario: username,
          password: password,
        }),
      })

      if (!res.ok) throw new Error('Credenciales incorrectas')

      const data = await res.json()
      console.log('✅ Login exitoso:', data)
      setIsLoggedIn(true)
    } catch (err) {
      alert('❌ Usuario o contraseña incorrectos')
      console.error('Error en login:', err)
    }
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

  // 👇 Contenido después del login exitoso
  return (
    <div className="home-container">
      <h1>Bienvenido al Sistema de Indicadores</h1>
      <div className="navigation-buttons">
        <button className="primary-button" onClick={() => router.push('/Logros')}>Ver Logros</button>
        <button className="primary-button" onClick={() => router.push('/Fechas')}>Fechas</button>
        <button className="primary-button" onClick={() => router.push('/ABC')}>CATÁLOGOS</button>
        <button className="primary-button" onClick={() => router.push('/Excel')}>Ver excel</button>
        <button className="primary-button" onClick={() => router.push('/Ind_seg')}>Ver segmentados</button>
        <button className="primary-button" onClick={() => router.push('/p31-actividades')}>P31 Actividades</button>
        <button className="primary-button" onClick={() => router.push('/proyectos')}>Registrar Proyecto</button>
      </div>
    </div>
  )
}
