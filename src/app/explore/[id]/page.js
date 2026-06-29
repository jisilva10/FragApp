'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Bookmark, Droplet } from 'lucide-react';
import { formatAccord } from '@/lib/formatters';
import './Detail.css';

export default function PerfumeDetail() {
  const params = useParams();
  const router = useRouter();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    fetch(`/api/perfumes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPerfume(data);
        setImageUrl(data.image_url);
        setLoading(false);
        
        // If no image_url, trigger our background Google Custom Search cache builder
        if (!data.image_url) {
           fetch(`/api/image/${data.id}`)
             .then(res => res.json())
             .then(imgData => {
                if (imgData.url) setImageUrl(imgData.url);
             })
             .catch(console.error);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const addToWardrobe = async () => {
    if (!perfume) return;
    try {
      await fetch('/api/wardrobe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfume_id: perfume.id,
          name: perfume.name,
          brand: perfume.brand
        })
      });
      alert('¡Añadido a tu Armario!');
    } catch (error) {
      console.error(error);
    }
  };

  const addToList = async (type) => {
    if (!perfume) return;
    try {
      await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfume_id: perfume.id,
          name: perfume.name,
          brand: perfume.brand,
          list_type: type
        })
      });
      alert(`¡Añadido a ${type}!`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="container" style={{padding: '2rem'}}>Cargando detalles...</div>;
  if (!perfume) return <div className="container" style={{padding: '2rem'}}>Perfume no encontrado</div>;

  return (
    <div className="animate-fade-in" style={{paddingBottom: '2rem'}}>
      <div className="top-bar">
        <button className="btn-icon" onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="hero-image-placeholder">
         {imageUrl ? (
            <img src={imageUrl} alt={perfume.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
         ) : (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:'1rem'}}>
              <Droplet size={64} strokeWidth={1} color="#aaa" />
              <a 
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(perfume.name + ' ' + perfume.brand + ' perfume bottle')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: 'var(--primary)', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--primary)',
                  borderRadius: '20px'
                }}
              >
                Buscar foto en Google
              </a>
            </div>
         )}
      </div>

      <div className="container" style={{paddingTop: '1.5rem'}}>
        <header className="detail-header">
          <h1>{perfume.name}</h1>
          <h2 className="brand">{perfume.brand} {perfume.year ? `(${perfume.year})` : ''}</h2>
          <div className="meta">
            <span className="tag">{perfume.gender}</span>
            <span className="tag rating">⭐ {perfume.rating || 'N/A'}</span>
          </div>
        </header>

        <div className="action-buttons">
          <button className="btn-primary" onClick={addToWardrobe}>
            <Plus size={18} /> Mi Armario
          </button>
          <button className="btn-secondary" onClick={() => addToList('wishlist')}>
            <Bookmark size={18} /> Wishlist
          </button>
        </div>

        <div className="section">
          <h3>Pirámide Olfativa</h3>
          <div className="pyramid">
            <div className="pyramid-level top">
              <strong>Salida:</strong> {perfume.top_notes || 'No especificado'}
            </div>
            <div className="pyramid-level middle">
              <strong>Corazón:</strong> {perfume.middle_notes || 'No especificado'}
            </div>
            <div className="pyramid-level base">
              <strong>Fondo:</strong> {perfume.base_notes || 'No especificado'}
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Acordes Principales</h3>
          <div className="accords-preview">
            {perfume.accords ? perfume.accords.split(',').map((acc, i) => {
              if(!acc) return null;
              return <span key={i} className="tag tag-accord">{formatAccord(acc)}</span>;
            }) : <p className="text-muted">No hay acordes disponibles.</p>}
          </div>
        </div>

        {perfume.description && (
          <div className="section">
            <h3>Descripción</h3>
            <p className="description-text">{perfume.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
