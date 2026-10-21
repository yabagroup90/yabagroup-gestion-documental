import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  Eye, 
  Upload, 
  TrendingUp, 
  UserPlus,
  Mail,
  FileCheck
} from 'lucide-react';
import { MODULOS_CONFIG } from '../../data/modulesConfig';

export default function AdminDashboard({ 
  expedientes = [], 
  empresas = [], 
  documentos = [], 
  onOpenHabilitarClienteModal,
  onOpenUploadModal,
  onOpenReviewModal,
  onUpdateEstado
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroModulo, setFiltroModulo] = useState('TODOS');

  // Filtrado de expedientes
  const expedientesFiltrados = expedientes.filter(exp => {
    const matchBusqueda = !busqueda || 
      exp.radicado.toLowerCase().includes(busqueda.toLowerCase()) || 
      exp.titulo.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado = filtroEstado === 'TODOS' || exp.estado === filtroEstado;
    const matchModulo = filtroModulo === 'TODOS' || exp.moduloCodigo === filtroModulo;

    return matchBusqueda && matchEstado && matchModulo;
  });

  const getEmpresa = (orgId) => {
    return empresas.find(e => e.id === orgId) || { razonSocial: 'Cliente', nit: 'N/A', email: '' };
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'entregado':
      case 'finalizado':
        return <span className="badge badge-success"><CheckCircle size={11} /> Documento Entregado</span>;
      case 'en_elaboracion':
        return <span className="badge badge-info"><Clock size={11} /> Elaborando Documento</span>;
      case 'en_revision':
        return <span className="badge badge-warning"><Clock size={11} /> Insumos en Revisión</span>;
      default:
        return <span className="badge badge-purple"><AlertCircle size={11} /> Esperando Insumos del Cliente</span>;
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Admin Action Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Panel de Administración YabaGroup
              </h1>
              <span className="badge badge-success">Operaciones</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Habilita usuarios a tus clientes, revisa los documentos que te subieron y móntales sus documentos finales terminados.
            </p>
          </div>

          {/* Botón Principal: Habilitar Cliente */}
          <button 
            className="btn btn-primary"
            onClick={onOpenHabilitarClienteModal}
            style={{ padding: '0.75rem 1.25rem', boxShadow: '0 4px 15px rgba(37,99,235,0.4)' }}
          >
            <UserPlus size={18} />
            <span style={{ fontSize: '0.925rem' }}>Habilitar Cuenta a Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Filters */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 300px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder="Buscar por radicado o título..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            <select 
              value={filtroModulo} 
              onChange={(e) => setFiltroModulo(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="TODOS">Todas las Asesorías</option>
              {Object.values(MODULOS_CONFIG).map(m => (
                <option key={m.codigo} value={m.codigo}>{m.nombre.split('(')[0]}</option>
              ))}
            </select>

            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="pendiente_documentacion">Esperando Insumos</option>
              <option value="en_revision">Insumos en Revisión</option>
              <option value="en_elaboracion">Elaborando Documento</option>
              <option value="entregado">Documento Entregado</option>
            </select>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Clientes con Asesoría: <strong style={{ color: '#fff' }}>{expedientesFiltrados.length}</strong>
          </span>

        </div>
      </div>

      {/* Lista de Cuentas y Expedientes de Clientes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {expedientesFiltrados.map((exp) => {
          const mod = MODULOS_CONFIG[exp.moduloCodigo] || {};
          const emp = getEmpresa(exp.organizacionId);
          const docsExp = documentos.filter(d => d.expedienteId === exp.id);
          const requisitosSubidos = docsExp.filter(d => d.tipo === 'requisito_cliente');
          const entregablesMontados = docsExp.filter(d => d.tipo === 'entregable_yabagroup');

          return (
            <div 
              key={exp.id}
              className="glass-card"
              style={{
                padding: '1.4rem',
                borderLeft: `5px solid ${mod.color || '#3b82f6'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Top Row: Empresa, Asesoría y Estado */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37,99,235,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                        {emp.razonSocial}
                      </h3>
                      <span className="badge" style={{ background: `${mod.color}15`, color: mod.color, border: `1px solid ${mod.color}30` }}>
                        {mod.nombre?.split('(')[0].trim()}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0 0' }}>
                      NIT: <strong style={{ color: '#fff' }}>{emp.nit}</strong> &bull; Correo de acceso del cliente: <strong style={{ color: '#38bdf8' }}>{emp.email}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {getStatusBadge(exp.estado)}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.65rem', borderRadius: 6 }}>
                    Radicado: <strong style={{ color: '#fff' }}>{exp.radicado}</strong>
                  </span>
                </div>
              </div>

              {/* Middle Row: Título del Trabajo Contratado */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem 1rem', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.9rem', color: '#ffffff', display: 'block' }}>
                  Servicio: {exp.titulo}
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0.2rem 0 0' }}>
                  {exp.descripcion}
                </p>
              </div>

              {/* Bottom Row: Documentos del Cliente vs Documentos Montados por Ti + Botones */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                
                {/* Contador de documentos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.825rem' }}>
                  <div>
                    Insumos subidos por el cliente: <strong style={{ color: requisitosSubidos.length > 0 ? '#38bdf8' : '#fbbf24' }}>{requisitosSubidos.length} archivo(s)</strong>
                  </div>
                  <div>
                    Documentación que tú le entregaste: <strong style={{ color: entregablesMontados.length > 0 ? '#34d399' : '#f87171' }}>{entregablesMontados.length} archivo(s)</strong>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {/* Botón 1: Ver y revisar lo que el cliente subió */}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onOpenReviewModal(exp)}
                  >
                    <Eye size={14} />
                    <span>Revisar lo que subió ({requisitosSubidos.length})</span>
                  </button>

                  {/* Botón 2: Montarle su documento final */}
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => onOpenUploadModal({
                      expedienteId: exp.id,
                      tipo: 'entregable_yabagroup',
                      moduloCodigo: exp.moduloCodigo,
                      categoriasDisponibles: mod.entregablesYabaGroup || ['Documento Final Terminado', 'Plan Oficial', 'Concepto Técnico']
                    })}
                    style={{ boxShadow: '0 2px 10px rgba(16,185,129,0.3)' }}
                  >
                    <Upload size={14} />
                    <span>Montar Documento Final al Cliente</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
