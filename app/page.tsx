'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="home-container">
      <h1>Bienvenido al Sistema de Indicadores</h1>
      
      <div className="navigation-buttons">
        <button 
          className="primary-button"
          onClick={() => router.push('/Logros')}>
          Ver Logros
        </button>

        <button 
          className="primary-button"
          onClick={() => router.push('/Fechas')}>
          Fechas
        </button>

        <button 
          className="primary-button"
          onClick={() => router.push('/ABC')}>
          CATÁLOGOS
        </button>
      </div>
    </div>
  )
}