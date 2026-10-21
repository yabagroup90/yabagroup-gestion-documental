import React, { useState } from 'react';
import { X, FolderPlus, AlertCircle } from 'lucide-react';
import { MODULOS_CONFIG } from '../../data/modulesConfig';

export default function NewExpedienteModal({ isOpen, onClose, empresas = [], onCreateSuccess }) {
  if (!isOpen) return null;

  const [organizacionId, setOrganizacionId] = useState(empresas[0]?.id || '');
  const [moduloCodigo, setModuloCodigo] = useState('SG_SST');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim() || !organizacionId) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    setIsSaving(true);
    try {
      const radicadoNum = Math.floor(100 + Math.random() * 900);
      const radicadoPrefix = moduloCodigo.substring(0, 3);
      const radicado = `EXP-2026-${radicadoPrefix}-${radicadoNum}`;

      await onCreateSuccess({
        radicado,
        organizacionId,
        moduloCodigo,
        titulo,
        descripcion,
        estado: 'pendiente_documentacion',
        fechaLimite: fechaLimite || '2026-12-31'
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al registrar la asesoría.');
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
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '560px', padding: '1.75rem', background: '#0f172a', border: '1px solid var(--border-light)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Crear Nuevo Expediente de Asesoría
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Apertura formal de proyecto y generación de checklist de insumos.
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          {/* Empresa Cliente */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Empresa Cliente / Contratante
            </label>
            <select 
              value={organizacionId}
              onChange={(e) => setOrganizacionId(e.target.value)}
              className="form-select"
              required
            >
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.razonSocial} (NIT: {emp.nit})</option>
              ))}
            </select>
          </div>

          {/* Módulo Especialidad */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Línea o Especialidad de Asesoría
            </label>
            <select 
              value={moduloCodigo}
              onChange={(e) => setModuloCodigo(e.target.value)}
              className="form-select"
              required
            >
              {Object.values(MODULOS_CONFIG).map(mod => (
                <option key={mod.codigo} value={mod.codigo}>{mod.nombre}</option>
              ))}
            </select>
          </div>

          {/* Título */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Título del Expediente / Asesoría
            </label>
            <input 
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Elaboración del Plan Anual SG-SST y Matriz de Riesgos"
              className="form-control"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Alcance y Objetivos de la Asesoría
            </label>
            <textarea 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el alcance técnico o legal acordado con el cliente..."
              rows={3}
              className="form-control"
              required
            />
          </div>

          {/* Fecha Límite */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Fecha Límite Estimada de Entrega
            </label>
            <input 
              type="date"
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              <FolderPlus size={16} />
              <span>{isSaving ? 'Creando...' : 'Crear y Habilitar Expediente'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
