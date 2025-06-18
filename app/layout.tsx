'use client';
import '../src/app/globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const TITULOS_POR_RUTA: Record<string, string> = {
  '/indicadores': 'Listado de Indicadores',
  '/Usuarios': 'Cátalogo de Usuarios',
  '/Roles': 'Cátalogo de roles',
  '/AreasResponsables': 'Catálogo de Áreas Responsables',
  '/ProgramaPresupuestal': 'Catálogo de Programas Presupuestales',
  // ...
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const titulo = TITULOS_POR_RUTA[pathname] || '';
  const isLoginPage = pathname === '/' || pathname === '/login';

  const [nombre, setNombre] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nombre_usuario');
    if (stored) setNombre(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nombre_usuario');
    setShowModal(false);
    router.push('/');
  };

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="header-unam">
          <div className="logo-container">
            <img src="/logo-unam-png-blanco-ok.png" alt="UNAM" style={{ height: '40px' }} />
          </div>
          <div className="header-titulo">{titulo}</div>
          <div className="logo-container">
            <img src="/logo-fesa-blanco.png" alt="FES Acatlán" style={{ height: '40px' }} />
          </div>
        </header>

        {!isLoginPage && (
          <nav className="nav-bar">
            <div className="menu-izquierda">
              <button onClick={() => router.push('/')}>Inicio</button>
              <button>Directorio</button>
              <button onClick={() => setShowModal(true)}>Salir</button>
            </div>
            <div className="usuario">{nombre || 'Nombre del Usuario'}</div>
          </nav>
        )}

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '10px',
              textAlign: 'center',
              maxWidth: '300px',
              boxShadow: '0 0 10px rgba(0,0,0,0.3)'
            }}>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                ¿Estás segur@ de cerrar sesión?
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button onClick={handleLogout} style={{
                  backgroundColor: '#c70000',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer'
                }}>Sí, salir</button>
                <button onClick={() => setShowModal(false)} style={{
                  backgroundColor: '#aaa',
                  color: '#000',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #888',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Cancelar
                </button>

              </div>
            </div>
          </div>
        )}

        <main className="contenido">{children}</main>
      </body>
    </html>
  );
}
