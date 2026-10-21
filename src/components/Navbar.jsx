import React from 'react';
import { FolderLock, LogOut, Building2, ShieldCheck, User } from 'lucide-react';

export default function Navbar({ usuarioActual, onLogout, isLive }) {
  const isCliente = usuarioActual?.rol === 'cliente';

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100, marginBottom: '1.5rem' }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img 
            src="/logo.jpg" 
            alt="YabaGroup Logo" 
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 10, 
              objectFit: 'contain',
              background: '#ffffff',
              padding: '2px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-font" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                YabaGroup
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa', border: '1px solid rgba(37, 99, 235, 0.4)' }}>
                Gestión Documental
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              {isCliente ? `Portal Privado: ${usuarioActual?.razonSocial || usuarioActual?.nombre}` : 'Panel de Control YabaGroup'}
            </p>
          </div>
        </div>

        {/* Right: User session info & Logout button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(15, 23, 42, 0.7)', padding: '0.4rem 0.85rem', borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: isCliente ? 'rgba(37,99,235,0.2)' : 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCliente ? <Building2 size={16} color="#60a5fa" /> : <ShieldCheck size={16} color="#34d399" />}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                {usuarioActual?.nombre || usuarioActual?.email}
              </div>
              <div style={{ fontSize: '0.7rem', color: isCliente ? '#60a5fa' : '#34d399' }}>
                {isCliente ? 'Cuenta Cliente' : 'Administrador YabaGroup'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="btn btn-secondary btn-sm"
            style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}
            title="Cerrar sesión actual"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>

        </div>

      </div>
    </header>
  );
}
