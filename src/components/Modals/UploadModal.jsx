import React, { useEffect, useState } from 'react';
import { X, UploadCloud, AlertCircle } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, config, onUploadSuccess }) {
  const { expedienteId, tipo, categoriasDisponibles = [], categoriaPreseleccionada, reemplazaDocumentoId } = config || {};

  const [categoria, setCategoria] = useState(categoriaPreseleccionada || categoriasDisponibles[0] || 'Documento General');
  const [file, setFile] = useState(null);
  const [observaciones, setObservaciones] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isCliente = tipo === 'requisito_cliente';

  useEffect(() => {
    setCategoria(categoriaPreseleccionada || categoriasDisponibles[0] || 'Documento General');
    setFile(null);
    setObservaciones('');
    setErrorMsg('');
  }, [config]);

  if (!isOpen || !config) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Por favor selecciona un archivo para adjuntar.');
      return;
    }

    setIsUploading(true);
    try {
      await onUploadSuccess({
        expedienteId,
        tipo,
        categoria,
        reemplazaDocumentoId,
        file,
        subidoPor: isCliente ? 'contacto@constructoraandina.com' : 'asesor@yabagroup.com',
        observaciones
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al cargar el archivo. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', background: '#0f172a', border: '1px solid var(--border-light)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              {isCliente ? 'Subir Insumo / Requisito' : 'Publicar Entregable YabaGroup'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              {isCliente ? 'Adjunta el insumo solicitado para que continuemos tu asesoría.' : 'Carga el documento oficial final para la empresa cliente.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
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
          
          {/* Categoría / Tipo de Requisito */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Tipo de Documento / Requisito
            </label>
            <select 
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="form-select"
            >
              {categoriasDisponibles.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* File input / Dropzone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Seleccionar Archivo (PDF, Word, Excel, DWG, ZIP)
            </label>
            <div 
              className="dropzone"
              onClick={() => document.getElementById('file-upload-input').click()}
              style={{ padding: '1.5rem', textAlign: 'center' }}
            >
              <input 
                id="file-upload-input"
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.zip,.jpg,.jpeg,.png"
              />
              <UploadCloud size={32} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
              {file ? (
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', margin: 0 }}>{file.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: 0 }}>Haz clic o arrastra tu archivo aquí</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.2rem 0 0' }}>Máximo 50 MB por archivo</p>
                </div>
              )}
            </div>
          </div>

          {/* Observaciones opcionales */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Notas u Observaciones (Opcional)
            </label>
            <textarea 
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Corresponde a la versión firmada con fecha de ayer..."
              rows={2}
              className="form-control"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isUploading}
            >
              {isUploading ? 'Procesando Carga...' : isCliente ? 'Confirmar y Subir Insumo' : 'Publicar Entregable'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
