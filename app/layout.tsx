import '../src/app/globals.css';
import '../public/logo-fesa-blanco.png';
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header-unam>
          <img
            src="/logo-unam-png-blanco-ok.png"
            alt="Logo UNAM"
            className="logo-left"
            style={{ height: "40px", width: "auto" }}
          />
          <img
            src="/logo-fesa-blanco.png"
            alt="Logo FES Acatlán"
            className="logo-right"
            style={{ height: "40px", width: "auto" }}
          />
        </header-unam>
        <nav className="nav-bar">
          <div className="menu-izquierda">
            <button>Inicio</button>
            <button>Directorio</button>
            <button>Salir</button>
          </div>
          <div className="usuario">Nombre del Usuario</div>
        </nav>


        {/* Aquí se renderizan todas las páginas */}
        {children}
      </body>
    </html>
  );
}