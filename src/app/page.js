'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';
import './Home.css';

const PerfumeCard = ({ item }) => (
  <Link href={`/explore/${item.id}`} className="carousel-item">
    <div className="perfume-card">
      <div className="perfume-image-placeholder">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
        ) : (
          <Droplet size={32} strokeWidth={1} />
        )}
      </div>
      <div className="perfume-info">
        <h3 className="truncate">{item.name}</h3>
        <p className="brand truncate">{item.brand}</p>
      </div>
    </div>
  </Link>
);

export default function Home() {
  const [data, setData] = useState({ populares: [], clasicos: [], novedades: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="container" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
        <p style={{color: 'var(--text-muted)'}}>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{paddingTop: '1rem'}}>
      <header className="page-header container" style={{paddingBottom: '0.5rem'}}>
        <h1>Descubrir</h1>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop:'0.25rem'}}>Explora el mundo de la perfumería.</p>
      </header>

      <h2 className="section-title">Más Populares</h2>
      <div className="carousel">
        {data.populares.map((item) => (
          <PerfumeCard key={item.id} item={item} />
        ))}
      </div>

      <h2 className="section-title">Novedades</h2>
      <div className="carousel">
        {data.novedades.map((item) => (
          <PerfumeCard key={item.id} item={item} />
        ))}
      </div>

      <h2 className="section-title">Clásicos del Siglo XX</h2>
      <div className="carousel">
        {data.clasicos.map((item) => (
          <PerfumeCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
