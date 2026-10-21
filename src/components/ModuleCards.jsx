import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Compass, 
  Award, 
  Leaf, 
  TrendingUp, 
  Layers 
} from 'lucide-react';
import { MODULOS_CONFIG } from '../data/modulesConfig';

const ICON_MAP = {
  ShieldCheck,
  Scale,
  Compass,
  Award,
  Leaf,
  TrendingUp
};

export default function ModuleCards({ selectedModule, onSelectModule, expedientes = [] }) {
  const getCount = (codigo) => {
    return expedientes.filter(e => e.moduloCodigo === codigo).length;
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Líneas de Asesoría & Gestión
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
            Selecciona una especialidad para filtrar expedientes y documentación activa.
          </p>
        </div>

        {selectedModule !== 'TODOS' && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onSelectModule('TODOS')}
          >
            <Layers size={14} />
            <span>Ver Todas las Áreas ({expedientes.length})</span>
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem'
      }}>
        {Object.values(MODULOS_CONFIG).map((mod) => {
          const Icon = ICON_MAP[mod.icono] || Layers;
          const isSelected = selectedModule === mod.codigo;
          const count = getCount(mod.codigo);

          return (
            <div
              key={mod.codigo}
              onClick={() => onSelectModule(isSelected ? 'TODOS' : mod.codigo)}
              className="glass-card"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderColor: isSelected ? mod.color : 'var(--border-color)',
                background: isSelected ? `rgba(${mod.color === '#10b981' ? '16, 185, 129' : '37, 99, 235'}, 0.12)` : undefined,
                boxShadow: isSelected ? `0 0 20px ${mod.glow}` : undefined,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Row: Icon + Count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `${mod.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: mod.color,
                  border: `1px solid ${mod.color}40`
                }}>
                  <Icon size={20} />
                </div>
                <span className="badge" style={{ background: `${mod.color}15`, color: mod.color, border: `1px solid ${mod.color}35`, fontSize: '0.7rem' }}>
                  {count} {count === 1 ? 'Expediente' : 'Expedientes'}
                </span>
              </div>

              {/* Title & Badge */}
              <h3 style={{ fontSize: '0.925rem', fontWeight: 700, marginBottom: '0.3rem', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                {mod.nombre.split('(')[0].trim()}
              </h3>
              
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {mod.descripcion}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
