'use client'; 
import '../src/app/globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from 'next/navigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const titulo = TITULOS_POR_RUTA[pathname] || '';

  const isLoginPage = pathname === '/' || pathname === '/login'; // ajusta según tu ruta real

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* HEADER AZUL */}
        <header className="header-unam">
          <div className="logo-container">
            <img src="/logo-unam-png-blanco-ok.png" alt="UNAM" style={{ height: '40px' }} />
          </div>

          <div className="header-titulo">
            {titulo}
          </div>

          <div className="logo-container">
            <img src="/logo-fesa-blanco.png" alt="FES Acatlán" style={{ height: '40px' }} />
          </div>
        </header>

        {/* NAV NEGRO solo si NO es login */}
        {!isLoginPage && (
          <nav className="nav-bar">
            <div className="menu-izquierda">
              <button>Inicio</button>
              <button>Directorio</button>
              <button>Salir</button>
            </div>
            <div className="usuario">Nombre del Usuario</div>
          </nav>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="contenido">
          {children}
        </main>
      </body>
    </html>
  );
}
