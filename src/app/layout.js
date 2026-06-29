import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'FragApp',
  description: 'Descubre y organiza tu colección de perfumes.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div className="mobile-wrapper">
          <main className="page-wrapper">
            {children}
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
