'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Droplet } from 'lucide-react';
import { formatAccord } from '@/lib/formatters';
import './Explore.css';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/explore?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce
    
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="animate-fade-in" style={{paddingTop: '1rem'}}>
      <header className="page-header container" style={{paddingBottom: '1rem'}}>
        <h1>Buscar</h1>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop:'0.25rem'}}>Encuentra cualquier perfume.</p>
      </header>

      <div className="container" style={{paddingTop: 0}}>
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="input-minimal search-input"
            placeholder="Ej. Aventus, Tom Ford..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="container" style={{paddingTop: 0}}>
        {loading && <div className="loading">Buscando...</div>}

        <div className="search-results-list">
          {results.map((item) => (
            <Link href={`/explore/${item.id}`} key={item.id} className="search-result-item">
              <div className="result-img-placeholder" style={item.image_url ? {backgroundColor: 'transparent', padding: 0, overflow: 'hidden'} : {}}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <Droplet size={20} color="var(--text-muted)" />
                )}
              </div>
              <div className="result-info">
                <h3>{item.name}</h3>
                <p className="brand">{item.brand}</p>
                {item.accords && (
                  <div className="accords-preview">
                    {item.accords.split(',').slice(0, 3).map((accord, idx) => {
                       if(!accord) return null;
                       return <span key={idx} className="tag">{formatAccord(accord)}</span>;
                    })}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        
        {!loading && results.length === 0 && query && (
          <div className="empty-state">
            <p>No se encontraron resultados para "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
