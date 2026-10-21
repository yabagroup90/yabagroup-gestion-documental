import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, FileText, Download, MessageSquare } from 'lucide-react';
import { dataService } from '../../services/dataService';

export default function ReviewModal({ isOpen, onClose, expediente, documentos = [], onUpdateDocEstado }) {
  if (!isOpen || !expediente) return null;

  const docsCliente = documentos.filter(d => d.expedienteId === expediente.id && d.tipo === 'requisito_cliente');

  const [selectedDocId, setSelectedDocId] = useState(docsCliente[0]?.id || null);
  const [observacion, setObservacion] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedDoc = docsCliente.find(d => d.id === selectedDocId) || docsCliente[0];

  const handleAprobar = async (docId) => {
    setIsSaving(true);
    try {
      await onUpdateDocEstado(docId, 'aprobado', 'Documento verificado y aprobado conforme a requisitos técnicos.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleObservaciones = async (docId) => {
    if (!observacion.trim()) {
      alert('Por favor escribe el motivo o la corrección solicitada.');
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateDocEstado(docId, 'observaciones', observacion);
      setObservacion('');
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', background: '#0f172a', border: '1px solid var(--border-light)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-info">{expediente.radicado}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Revisión Técnica de Insumos del Cliente
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Expediente: {expediente.titulo}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {docsCliente.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={42} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
            <p>El cliente aún no ha subido documentos para este expediente.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            
            {/* Left: Lista de archivos del cliente */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Archivos Recibidos ({docsCliente.length})
              </span>

              {docsCliente.map(doc => {
                const isSelected = doc.id === selectedDoc?.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => { setSelectedDocId(doc.id); setObservacion(doc.observaciones || ''); }}
                    className="glass-card"
                    style={{
                      padding: '0.85rem',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${doc.estado === 'aprobado' ? '#10b981' : doc.estado === 'observaciones' ? '#ef4444' : '#f59e0b'}`,
                      background: isSelected ? 'rgba(30, 41, 59, 0.9)' : undefined,
                      borderColor: isSelected ? 'var(--primary)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.875rem', color: '#fff' }}>{doc.categoria}</strong>
                      <span className={`badge ${doc.estado === 'aprobado' ? 'badge-success' : doc.estado === 'observaciones' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                        {doc.estado}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#38bdf8', margin: 0, wordBreak: 'break-all' }}>
                      {doc.nombreArchivo}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: '0.2rem 0 0' }}>
                      {doc.tamano} &bull; {doc.fechaSubida}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Detalle y Acciones del documento seleccionado */}
            {selectedDoc && (
              <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(15, 23, 42, 0.7)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Detalle del Documento
                </span>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0.5rem 0 0.2rem', color: '#fff' }}>
                  {selectedDoc.categoria}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#38bdf8', margin: '0 0 0.85rem' }}>
                  {selectedDoc.nombreArchivo} ({selectedDoc.tamano})
                </p>

                <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: 8, fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.35rem', color: 'var(--text-muted)' }}>
                    Subido por: <strong style={{ color: '#fff' }}>{selectedDoc.subidoPor}</strong>
                  </p>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    Fecha de recepción: <strong style={{ color: '#fff' }}>{selectedDoc.fechaSubida}</strong>
                  </p>
                </div>

                {/* Descarga simulada */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        dataService.downloadDocumento(selectedDoc);
                      } catch (error) {
                        alert(error.message);
                      }
                    }}
                    disabled={!selectedDoc.archivoDisponible}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%' }}
                  >
                    <Download size={14} />
                    <span>{selectedDoc.archivoDisponible ? 'Descargar Archivo para Revisión' : 'Archivo no disponible'}</span>
                  </button>
                </div>

                {/* Formulario de Validación */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Dictamen / Observaciones Técnicas:
                  </label>
                  <textarea 
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Escribe comentarios, p.ej: 'Falta la firma del representante en la página 3'..."
                    rows={3}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <button 
                      onClick={() => handleAprobar(selectedDoc.id)}
                      disabled={isSaving}
                      className="btn btn-success btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Aprobar Insumo</span>
                    </button>

                    <button 
                      onClick={() => handleObservaciones(selectedDoc.id)}
                      disabled={isSaving}
                      className="btn btn-sm"
                      style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                    >
                      <AlertTriangle size={14} />
                      <span>Pedir Corrección</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
