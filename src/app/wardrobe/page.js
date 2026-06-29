'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';
import '../Armario.css';

export default function ArmarioDigital() {
  const [wardrobe, setWardrobe] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wardrobe')
      .then(res => res.json())
      .then(data => {
        setWardrobe(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container animate-fade-in">
      <header className="page-header" style={{paddingBottom: '1rem'}}>
        <h1>Mi Armario</h1>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop:'0.25rem'}}>Tu colección personal.</p>
      </header>

      {loading ? (
        <div className="loading">Cargando colección...</div>
      ) : wardrobe.length === 0 ? (
        <div className="empty-state">
          <p>Aún no tienes perfumes en tu armario.</p>
          <Link href="/explore" className="btn-primary" style={{ marginTop: '1.5rem' }}>
            Explorar Perfumes
          </Link>
        </div>
      ) : (
        <div className="wardrobe-list">
          {wardrobe.map((item) => (
            <div key={item.id} className="card" style={{marginBottom: '1rem'}}>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                 <div className="result-img-placeholder" style={{width: 60, height: 60, marginRight: '1rem', backgroundColor: '#f0f0f4', borderRadius: 8, display: 'flex', alignItems:'center', justifyContent:'center'}}>
                    <Droplet size={24} color="var(--text-muted)" />
                 </div>
                 <div>
                    <h3 style={{marginBottom: '0.15rem'}}>{item.name}</h3>
                    <p className="brand">{item.brand}</p>
                 </div>
              </div>
              
              <div className="details">
                {item.notes && (
                  <div className="detail-item">
                    <strong>Notas Personales</strong>
                    <p>{item.notes}</p>
                  </div>
                )}
                {item.occasions && (
                  <div className="detail-item">
                    <strong>Ocasiones</strong>
                    <p>{item.occasions}</p>
                  </div>
                )}
                {!item.notes && !item.occasions && (
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Sin notas adicionales.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
