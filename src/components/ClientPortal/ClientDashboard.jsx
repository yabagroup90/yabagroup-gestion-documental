import React from 'react';
import { 
  Building2, 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Download, 
  FileCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MODULOS_CONFIG } from '../../data/modulesConfig';
import { dataService } from '../../services/dataService';

export default function ClientDashboard({ 
  empresa, 
  expedientes = [], 
  documentos = [], 
  onOpenUploadModal,
  selectedExpedienteId,
  onSelectExpediente
}) {
  const activeExpediente = expedientes.find(e => e.id === selectedExpedienteId) || expedientes[0];
  const moduloInfo = activeExpediente ? MODULOS_CONFIG[activeExpediente.moduloCodigo] : null;

  // Filtrar documentos del expediente seleccionado
  const docsExpediente = documentos.filter(d => d.expedienteId === activeExpediente?.id);
  const requisitosSubidos = docsExpediente.filter(d => d.tipo === 'requisito_cliente');
  const entregablesFinales = docsExpediente.filter(d => d.tipo === 'entregable_yabagroup');

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'entregado':
      case 'finalizado':
        return <span className="badge badge-success"><CheckCircle size={12} /> Entregado / Finalizado</span>;
      case 'en_elaboracion':
        return <span className="badge badge-info"><Clock size={12} /> En Elaboración</span>;
      case 'en_revision':
        return <span className="badge badge-warning"><Clock size={12} /> En Revisión Técnica</span>;
      default:
        return <span className="badge badge-purple"><AlertTriangle size={12} /> Pendiente Documentos</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Company Header Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(16,185,129,0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Building2 size={28} color="#3b82f6" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  {empresa?.razonSocial || 'Constructora Andina S.A.S.'}
                </h1>
                <span className="badge badge-info">Cliente Verificado</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                NIT: <strong style={{ color: '#ffffff' }}>{empresa?.nit || '901.458.789-1'}</strong> &bull; Representante: {empresa?.representante || 'Ing. Carlos Alberto Restrepo'} &bull; {empresa?.ciudad || 'Medellín'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Asesor Asignado YabaGroup
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
              <ShieldCheck size={16} color="#10b981" />
              <strong style={{ fontSize: '0.9rem', color: '#10b981' }}>Yaba Consultoría Especializada</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Expedientes list, Right = Selected Expediente Work Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Tus Asesorías / Expedientes */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Tus Asesorías Contratadas ({expedientes.length})
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {expedientes.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No tienes asesorías activas en esta categoría.</p>
              </div>
            ) : (
              expedientes.map((exp) => {
                const mod = MODULOS_CONFIG[exp.moduloCodigo] || {};
                const isSelected = exp.id === activeExpediente?.id;

                return (
                  <div
                    key={exp.id}
                    onClick={() => onSelectExpediente(exp.id)}
                    className="glass-card"
                    style={{
                      padding: '1.25rem',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${mod.color || '#3b82f6'}`,
                      background: isSelected ? 'rgba(30, 41, 59, 0.9)' : undefined,
                      borderColor: isSelected ? 'var(--primary)' : undefined,
                      boxShadow: isSelected ? '0 4px 20px rgba(0,0,0,0.5)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: mod.color || '#3b82f6' }}>
                        {exp.radicado}
                      </span>
                      {getStatusBadge(exp.estado)}
                    </div>

                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#ffffff' }}>
                      {exp.titulo}
                    </h3>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.85rem', lineHeight: 1.35 }}>
                      {exp.descripcion}
                    </p>

                    {/* Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: 'var(--text-dim)' }}>Avance del servicio</span>
                        <strong style={{ color: exp.porcentajeAvance === 100 ? '#10b981' : '#38bdf8' }}>
                          {exp.porcentajeAvance}%
                        </strong>
                      </div>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${exp.porcentajeAvance}%`,
                            background: exp.porcentajeAvance === 100 ? '#10b981' : undefined
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Área de Carga e Intercambio Documental */}
        {activeExpediente && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Header del Expediente Seleccionado */}
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: `${moduloInfo?.color}20`, color: moduloInfo?.color, border: `1px solid ${moduloInfo?.color}40` }}>
                  {moduloInfo?.nombre}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Radicado: <strong style={{ color: '#fff' }}>{activeExpediente.radicado}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.4rem' }}>
                {activeExpediente.titulo}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {activeExpediente.descripcion}
              </p>
            </div>

            {/* SECCIÓN 1: REQUISITOS QUE DEBE SUBIR EL CLIENTE */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UploadCloud size={20} color="#3b82f6" />
                    <span>Insumos y Requisitos por Subir</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    Documentos necesarios para que YabaGroup pueda elaborar tu expediente.
                  </p>
                </div>

                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenUploadModal({
                    expedienteId: activeExpediente.id,
                    tipo: 'requisito_cliente',
                    moduloCodigo: activeExpediente.moduloCodigo,
                    categoriasDisponibles: moduloInfo?.requisitosCliente.map(r => r.nombre) || []
                  })}
                >
                  <UploadCloud size={14} />
                  <span>Subir Documento</span>
                </button>
              </div>

              {/* Checklist de requisitos de este módulo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {moduloInfo?.requisitosCliente.map((req) => {
                  const documentosDelRequisito = requisitosSubidos
                    .filter(d => d.categoria === req.nombre)
                    .sort((a, b) => String(b.fechaSubida || '').localeCompare(String(a.fechaSubida || '')));
                  const docSubido = documentosDelRequisito.find(d => d.estado === 'observaciones')
                    || documentosDelRequisito[0];

                  return (
                    <div 
                      key={req.id}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: docSubido?.estado === 'observaciones' ? 'rgba(239, 68, 68, 0.08)' : docSubido ? 'rgba(16, 185, 129, 0.06)' : 'rgba(15, 23, 42, 0.6)',
                        border: `1px solid ${docSubido?.estado === 'observaciones' ? 'rgba(239, 68, 68, 0.45)' : docSubido ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {docSubido ? (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: docSubido.estado === 'observaciones' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {docSubido.estado === 'observaciones' ? <AlertTriangle size={16} color="#f87171" /> : <CheckCircle size={16} color="#10b981" />}
                          </div>
                        ) : (
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Clock size={16} color="#f59e0b" />
                          </div>
                        )}

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{req.nombre}</strong>
                            {req.obligatorio && (
                              <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                                Obligatorio
                              </span>
                            )}
                          </div>
                          
                          {docSubido ? (
                            <div>
                              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.15rem 0 0' }}>
                                Archivo: <span style={{ color: '#38bdf8' }}>{docSubido.nombreArchivo}</span> ({docSubido.tamano}) &bull; Subido el {docSubido.fechaSubida}
                              </p>
                              {docSubido.estado === 'observaciones' && (
                                <p style={{ fontSize: '0.75rem', color: '#fca5a5', margin: '0.35rem 0 0', lineHeight: 1.35 }}>
                                  <strong>Corrección solicitada:</strong> {docSubido.observaciones || 'El asesor solicitó revisar este documento.'}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.15rem 0 0' }}>
                              Formato sugerido: {req.formato} &bull; Pendiente de adjuntar
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        {docSubido ? (
                          docSubido.estado === 'observaciones' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem' }}>
                              <span className="badge badge-danger">Corrección solicitada</span>
                              <button
                                className="btn btn-sm"
                                onClick={() => onOpenUploadModal({
                                  expedienteId: activeExpediente.id,
                                  tipo: 'requisito_cliente',
                                  moduloCodigo: activeExpediente.moduloCodigo,
                                  categoriaPreseleccionada: req.nombre,
                                  categoriasDisponibles: moduloInfo?.requisitosCliente.map(r => r.nombre) || [],
                                  reemplazaDocumentoId: docSubido.id
                                })}
                                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                              >
                                <UploadCloud size={12} />
                                <span>Subir corrección</span>
                              </button>
                            </div>
                          ) : (
                            <span className={`badge ${docSubido.estado === 'aprobado' ? 'badge-success' : 'badge-warning'}`}>
                              {docSubido.estado === 'aprobado' ? 'Validado por Asesor' : 'En Revisión'}
                            </span>
                          )
                        ) : (
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => onOpenUploadModal({
                              expedienteId: activeExpediente.id,
                              tipo: 'requisito_cliente',
                              moduloCodigo: activeExpediente.moduloCodigo,
                              categoriaPreseleccionada: req.nombre,
                              categoriasDisponibles: moduloInfo?.requisitosCliente.map(r => r.nombre) || []
                            })}
                          >
                            <UploadCloud size={12} />
                            <span>Adjuntar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 2: ENTREGABLES Y PLAN FINAL DE YABAGROUP */}
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid rgba(16, 185, 129, 0.25)', background: 'rgba(16, 185, 129, 0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
                    <Sparkles size={20} color="#10b981" />
                    <span>Entregables Oficiales de YabaGroup</span>
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    Documentación definitiva elaborada por el equipo de asesoría, lista para radicar o certificar.
                  </p>
                </div>
              </div>

              {entregablesFinales.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
                  <FileText size={36} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                    Tu asesor YabaGroup está procesando los insumos para elaborar los entregables oficiales.
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                    Una vez aprobados, aquí podrás descargarlos con sellos y validez técnica.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {entregablesFinales.map((doc) => (
                    <div 
                      key={doc.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileCheck size={24} color="#10b981" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{doc.categoria}</strong>
                            <span className="badge badge-success">Versión Oficial</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#38bdf8', margin: '0.15rem 0 0' }}>
                            {doc.nombreArchivo} &bull; {doc.tamano} &bull; Entregado el {doc.fechaSubida}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
                            Elaborado por: {doc.subidoPor}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            dataService.downloadDocumento(doc);
                          } catch (error) {
                            alert(error.message);
                          }
                        }}
                        disabled={!doc.archivoDisponible}
                        className="btn btn-success btn-sm"
                        style={{ boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)' }}
                      >
                        <Download size={14} />
                        <span>{doc.archivoDisponible ? 'Descargar Oficial' : 'Archivo no disponible'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
