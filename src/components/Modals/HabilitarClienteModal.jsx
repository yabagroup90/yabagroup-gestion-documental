import React, { useState } from 'react';
import { X, UserPlus, Building2, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { MODULOS_CONFIG } from '../../data/modulesConfig';

export default function HabilitarClienteModal({ isOpen, onClose, onHabilitarCliente }) {
  if (!isOpen) return null;

  const [razonSocial, setRazonSocial] = useState('');
  const [nit, setNit] = useState('');
  const [representante, setRepresentante] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('cliente123');
  const [moduloCodigo, setModuloCodigo] = useState('SG_SST');
  const [tituloAsesoria, setTituloAsesoria] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!razonSocial || !nit || !email || !password || !tituloAsesoria) {
      setErrorMsg('Por favor llena todos los datos de la cuenta del cliente.');
      return;
    }

    setIsSaving(true);
    try {
      await onHabilitarCliente({
        empresa: {
          id: `emp-${Date.now()}`,
          razonSocial,
          nit,
          representante: representante || razonSocial,
          email,
          ciudad: 'Colombia'
        },
        usuario: {
          id: `usr-${Date.now()}`,
          email: email.trim().toLowerCase(),
          password,
          rol: 'cliente',
          nombre: representante || razonSocial
        },
        expediente: {
          radicado: `EXP-2026-${moduloCodigo.substring(0,3)}-${Math.floor(100 + Math.random() * 900)}`,
          moduloCodigo,
          titulo: tituloAsesoria,
          descripcion: `Asesoría contratada en ${MODULOS_CONFIG[moduloCodigo]?.nombre}`,
          estado: 'pendiente_documentacion',
          porcentajeAvance: 10
        }
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al habilitar la cuenta del cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', background: '#0f172a', border: '1px solid var(--border-light)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
              <UserPlus size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Habilitar Cuenta a Nuevo Cliente
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                Crea el usuario para que el cliente ingrese y suba sus documentos.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Empresa / Razón Social */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
                Nombre de la Empresa o Cliente *
              </label>
              <input 
                type="text"
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                placeholder="Ej: Inversiones Los Pinos S.A.S."
                className="form-control"
                required
              />
            </div>

            {/* NIT */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
                NIT o Documento de Identidad *
              </label>
              <input 
                type="text"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                placeholder="Ej: 901.884.221-5"
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Representante Legal */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
              Nombre del Representante o Contacto
            </label>
            <input 
              type="text"
              value={representante}
              onChange={(e) => setRepresentante(e.target.value)}
              placeholder="Ej: Alejandro Restrepo Pérez"
              className="form-control"
            />
          </div>

          <div style={{ background: 'rgba(37,99,235,0.06)', padding: '1rem', borderRadius: 10, border: '1px solid rgba(37,99,235,0.2)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              Credenciales de Acceso para el Cliente:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {/* Email Login */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                  Correo Electrónico (Será su Usuario) *
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@empresa.com"
                  className="form-control"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#cbd5e1' }}>
                  Contraseña Temporal *
                </label>
                <input 
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          {/* Servicio o Asesoría que Contrató */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
              Asesoría o Documento por el que está pagando *
            </label>
            <select 
              value={moduloCodigo}
              onChange={(e) => setModuloCodigo(e.target.value)}
              className="form-select"
            >
              {Object.values(MODULOS_CONFIG).map(mod => (
                <option key={mod.codigo} value={mod.codigo}>{mod.nombre}</option>
              ))}
            </select>
          </div>

          {/* Título de la asesoría */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: '#cbd5e1' }}>
              Detalle del Servicio / Documento Requerido *
            </label>
            <input 
              type="text"
              value={tituloAsesoria}
              onChange={(e) => setTituloAsesoria(e.target.value)}
              placeholder="Ej: Plan Anual de SG-SST y Matriz de Riesgos Laborales 2026"
              className="form-control"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <UserPlus size={16} />
              <span>{isSaving ? 'Habilitando...' : 'Habilitar Cuenta y Crear Asesoría'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
