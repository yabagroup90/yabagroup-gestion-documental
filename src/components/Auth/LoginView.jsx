import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, Building2, AlertCircle, Scale, Compass, Award } from 'lucide-react';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor ingresa tu correo y contraseña.');
      return;
    }

    const success = onLogin(email.trim().toLowerCase(), password);
    if (!success) {
      setErrorMsg('Credenciales inválidas. Verifica tu correo y contraseña.');
    }
  };

  const handleQuickLogin = (correo, clave) => {
    setEmail(correo);
    setPassword(clave);
    onLogin(correo, clave);
  };

  const cuentasDemo = [
    {
      tipo: 'admin',
      nombre: 'YabaGroup (Administrador Central)',
      email: 'admin@yabagroup.com',
      clave: 'admin123',
      subtitulo: 'Gestiona clientes, revisa insumos y monta entregables finales',
      icono: ShieldCheck,
      color: '#10b981',
      badge: 'Admin'
    },
    {
      tipo: 'cliente',
      nombre: 'Constructora Andina S.A.S.',
      email: 'contacto@constructoraandina.com',
      clave: 'cliente123',
      subtitulo: 'Asesoría contratada: Seguridad y Salud en el Trabajo (SG-SST)',
      icono: Building2,
      color: '#3b82f6',
      badge: 'SG-SST'
    },
    {
      tipo: 'cliente',
      nombre: 'Logística & Transportes del Valle S.A.',
      email: 'operaciones@logivalledelvalle.com',
      clave: 'cliente123',
      subtitulo: 'Asesoría contratada: Servicios Jurídicos & Minutas de Obra',
      icono: Scale,
      color: '#6366f1',
      badge: 'Jurídico'
    },
    {
      tipo: 'cliente',
      nombre: 'Urbanizaciones & Ingeniería del Norte',
      email: 'proyectos@ingenieriandina.com',
      clave: 'cliente123',
      subtitulo: 'Asesoría contratada: Diseño y Planos Estructurales',
      icono: Compass,
      color: '#f59e0b',
      badge: 'Ingeniería'
    },
    {
      tipo: 'cliente',
      nombre: 'Tecnología & Soluciones Globales',
      email: 'gerencia@tsg.com.co',
      clave: 'cliente123',
      subtitulo: 'Asesoría contratada: Manual de Gestión de Calidad ISO 9001',
      icono: Award,
      color: '#ec4899',
      badge: 'Calidad ISO'
    }
  ];

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

            <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem', marginTop: '0.25rem', width: '100%', fontSize: '0.95rem' }}>
              <span>Entrar a mi Cuenta</span>
              <ArrowRight size={16} />
            </button>

          </form>

          {/* Accesos rápidos de todas las cuentas demo */}
          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Cuentas habilitadas para probar:
              </span>
              <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>1 Clic para entrar</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {cuentasDemo.map((c, idx) => {
                const IconComponent = c.icono;
                return (
                  <button 
                    key={idx}
                    type="button"
                    onClick={() => handleQuickLogin(c.email, c.clave)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      textAlign: 'left',
                      borderLeft: `3px solid ${c.color}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>
                        <IconComponent size={15} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.8rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {c.nombre}
                          </strong>
                          <span className="badge" style={{ background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}35`, fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                            {c.badge}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.subtitulo}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: c.color, fontWeight: 700, flexShrink: 0, marginLeft: '0.5rem' }}>&rarr;</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
