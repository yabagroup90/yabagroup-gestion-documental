import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const success = await onLogin(email.trim().toLowerCase(), password);
      if (!success) {
        setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#090d16'
    }}>
      
      {/* IMAGEN DE FONDO CORPORATIVA (Estilizada con overlay ambiental) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/logo.jpg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        opacity: 0.08,
        filter: 'blur(8px) grayscale(30%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Gradientes de acento visual */}
      <div style={{
        position: 'absolute',
        width: '650px',
        height: '650px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)',
        top: '-150px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative', zIndex: 1 }}>
        
        {/* Brand Header con el Logo Real de YabaGroup */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(37, 99, 235, 0.35)',
            marginBottom: '1rem',
            border: '2px solid rgba(255, 255, 255, 0.5)'
          }}>
            <img 
              src="/logo.jpg" 
              alt="YabaGroup Gestión Documental Logo" 
              style={{
                width: 105,
                height: 105,
                borderRadius: '18px',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          
          <h1 className="brand-font" style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
            YabaGroup
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
            Gestión Documental & Asesorías Corporativas
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid var(--border-light)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', color: '#ffffff' }}>
            Iniciar Sesión
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
            Accede con tu usuario para subir tus documentos o descargar tus asesorías terminadas.
          </p>

          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@empresa.com"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0.85rem', marginTop: '0.25rem', width: '100%', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}>
              <span>{loading ? 'Verificando...' : 'Entrar a mi Cuenta'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
