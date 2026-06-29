'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Briefcase } from 'lucide-react';
import './Navigation.css';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Home size={22} strokeWidth={pathname === '/' ? 2.5 : 2} />
        <span>Descubrir</span>
      </Link>
      
      <Link href="/explore" className={`nav-item ${pathname?.startsWith('/explore') ? 'active' : ''}`}>
        <Search size={22} strokeWidth={pathname?.startsWith('/explore') ? 2.5 : 2} />
        <span>Buscar</span>
      </Link>

      <Link href="/lists" className={`nav-item ${pathname?.startsWith('/lists') ? 'active' : ''}`}>
        <Bookmark size={22} strokeWidth={pathname?.startsWith('/lists') ? 2.5 : 2} />
        <span>Listas</span>
      </Link>

      <Link href="/wardrobe" className={`nav-item ${pathname?.startsWith('/wardrobe') ? 'active' : ''}`}>
        <Briefcase size={22} strokeWidth={pathname?.startsWith('/wardrobe') ? 2.5 : 2} />
        <span>Armario</span>
      </Link>
    </nav>
  );
}
