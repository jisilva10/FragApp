'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Droplet } from 'lucide-react';
import './Lists.css';

const TABS = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'like', label: 'Me Gusta' },
  { id: 'dislike', label: 'No Me Gusta' },
  { id: 'alternative', label: 'Alternativas' }
];

export default function Lists() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLists = async (type) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lists?type=${type}`);
      const data = await res.json();
      setLists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists(activeTab);
  }, [activeTab]);

  const removeListItem = async (id) => {
    try {
      await fetch(`/api/lists?id=${id}`, { method: 'DELETE' });
      fetchLists(activeTab);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container animate-fade-in" style={{paddingTop: '1rem'}}>
      <header className="page-header">
        <h1>Listas de Control</h1>
      </header>

      <div className="tabs-container">
        {TABS.map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="list-content">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : lists.length === 0 ? (
          <div className="empty-state">
            <p>No hay perfumes en esta lista aún.</p>
            <Link href="/explore" className="btn-secondary" style={{ marginTop: '1rem' }}>
              Descubrir Perfumes
            </Link>
          </div>
        ) : (
          <div className="list-grid">
            {lists.map((item) => (
              <div key={item.id} className="card list-card">
                <div className="list-card-content">
                  <div className="result-img-placeholder" style={{width: 48, height: 48, marginRight: '1rem'}}>
                    <Droplet size={20} color="var(--text-muted)" />
                  </div>
                  <div>
                    <h3 style={{marginBottom: '0.15rem', fontSize:'0.9rem'}}>{item.name}</h3>
                    <p className="brand">{item.brand}</p>
                  </div>
                </div>
                <button 
                  className="btn-icon delete-btn" 
                  onClick={() => removeListItem(item.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
