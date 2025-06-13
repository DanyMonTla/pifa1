'use client';
import '../src/app/globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const TITULOS_POR_RUTA: Record<string, string> = {
  '/indicadores': 'Listado de Indicadores',
  '/usuarios': 'Gestión de Usuarios',
  '/ABC': 'Módulos ABC Generales',
  '/Frecuencia': 'ABC Frecuencia de indicadores',
  '/Fuente': 'ABC Fuente de indicadores',
  '/TipoCalculo': 'ABC Tipo Cálculo de indicadores',
  '/TipoIndicador': 'ABC Tipo Indicadores',
  '/Usuarios': 'ABC Usuarios',
  '/ProgramaPresupuestal': 'ABC de Programa presupuestal',
  '/AreasResponsables': 'ABC de areas responsables',
  '/Roles': 'ABC de roles',
  '/TipoPrograPres': 'ABC de Tipo Programa',
  '/EducacionContinuaCEDETEC': 'Actividades Educación Continua',
  '/ActividadesCulturales': 'Actividades Culturales',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const titulo = TITULOS_POR_RUTA[pathname] || '';
  const isLoginPage = pathname === '/' || pathname === '/login';

  const [nombre, setNombre] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('nombre_usuario');
    if (stored) setNombre(stored);
  }, []);

  const handleLogout = () => {
    const confirmar = window.confirm('¿Estás segur@ de cerrar sesión?');
    if (confirmar) {
      localStorage.removeItem('nombre_usuario');
      router.push('/');
    }
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
              <button onClick={handleLogout}>Salir</button>
            </div>
            <div className="usuario">{nombre || 'Nombre del Usuario'}</div>
          </nav>
        )}

        <main className="contenido">
          {children}
        </main>
      </body>
    </html>
  );
}
