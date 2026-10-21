// Catálogo de Módulos YabaGroup Gestión Documental
export const MODULOS_CONFIG = {
  SG_SST: {
    codigo: 'SG_SST',
    nombre: 'Seguridad y Salud en el Trabajo (SG-SST)',
    badge: 'SST & Riesgos',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    icono: 'ShieldCheck',
    descripcion: 'Diseño e implementación de Sistemas de Gestión en Seguridad y Salud laboral (Dec. 1072 / Res. 0312).',
    requisitosCliente: [
      { id: 'sst-1', nombre: 'RUT Actualizado', obligatorio: true, formato: 'PDF' },
      { id: 'sst-2', nombre: 'Cámara de Comercio (Vigente < 30 días)', obligatorio: true, formato: 'PDF' },
      { id: 'sst-3', nombre: 'Planilla ARL / Listado de Trabajadores', obligatorio: true, formato: 'PDF o Excel' },
      { id: 'sst-4', nombre: 'Registro Fotográfico de Instalaciones', obligatorio: true, formato: 'ZIP o JPG/PNG' },
      { id: 'sst-5', nombre: 'Certificados de Equipos y Extintores', obligatorio: false, formato: 'PDF' }
    ],
    entregablesYabaGroup: [
      'Plan Anual de Trabajo SG-SST',
      'Matriz de Identificación de Peligros y Valoración de Riesgos (GTC 45)',
      'Política de Seguridad y Salud en el Trabajo',
      'Reglamento de Higiene y Seguridad Industrial',
      'Plan de Prevención, Preparación y Respuesta ante Emergencias',
      'Informe de Estándares Mínimos (Res. 0312)'
    ]
  },
  JURIDICO: {
    codigo: 'JURIDICO',
    nombre: 'Servicios Jurídicos & Legal Tech',
    badge: 'Legal & Litigios',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.25)',
    icono: 'Scale',
    descripcion: 'Asesoría y blindaje jurídico corporativo, conceptos legales, minutas y contestación procesal.',
    requisitosCliente: [
      { id: 'jur-1', nombre: 'Contrato o Minuta a Revisar', obligatorio: true, formato: 'PDF o Word' },
      { id: 'jur-2', nombre: 'Documentos de Soporte y Pruebas', obligatorio: true, formato: 'PDF o ZIP' },
      { id: 'jur-3', nombre: 'Poder de Representación Firmado', obligatorio: false, formato: 'PDF' },
      { id: 'jur-4', nombre: 'Notificación Judicial / Administrativa', obligatorio: false, formato: 'PDF' }
    ],
    entregablesYabaGroup: [
      'Concepto Jurídico Formal y Análisis de Riesgos Legales',
      'Contratos Revisados y Cláusulas Blindadas',
      'Contestación de Demandas o Requerimientos',
      'Actas de Asambleas y Minutas Societarias',
      'Informe Ejecutivo de Situación Litigiosa'
    ]
  },
  INGENIERIA: {
    codigo: 'INGENIERIA',
    nombre: 'Diseño, Arquitectura e Ingeniería',
    badge: 'Técnico & Obra',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.25)',
    icono: 'Compass',
    descripcion: 'Diseño estructural, levantamiento de planos, memorias de cálculo y modelado técnico.',
    requisitosCliente: [
      { id: 'ing-1', nombre: 'Planos Base o Levantamiento Topográfico', obligatorio: true, formato: 'DWG o PDF' },
      { id: 'ing-2', nombre: 'Especificaciones Técnicas del Proyecto', obligatorio: true, formato: 'PDF' },
      { id: 'ing-3', nombre: 'Fotografías del Predio / Terreno', obligatorio: true, formato: 'JPG o ZIP' },
      { id: 'ing-4', nombre: 'Estudio de Suelos Preliminar', obligatorio: false, formato: 'PDF' }
    ],
    entregablesYabaGroup: [
      'Planos de Diseño Técnico Definitivos (DWG / PDF)',
      'Memoria de Cálculo Estructural / Hidráulica',
      'Presupuesto de Obra y Análisis de Precios Unitarios (APU)',
      'Especificaciones Técnicas Constructivas',
      'Informe Técnico de Viabilidad'
    ]
  },
  CALIDAD_ISO: {
    codigo: 'CALIDAD_ISO',
    nombre: 'Gestión de Calidad (ISO 9001)',
    badge: 'Normas ISO',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.25)',
    icono: 'Award',
    descripcion: 'Sistemas de gestión de la calidad basados en estándares ISO 9001:2015 y optimización continua.',
    requisitosCliente: [
      { id: 'cal-1', nombre: 'Organigrama y Estructura Organizacional', obligatorio: true, formato: 'PDF o Imagen' },
      { id: 'cal-2', nombre: 'Listado de Procesos y Operaciones Actuales', obligatorio: true, formato: 'Excel o PDF' },
      { id: 'cal-3', nombre: 'Formatos y Evidencias de Gestión Vigentes', obligatorio: false, formato: 'ZIP o PDF' }
    ],
    entregablesYabaGroup: [
      'Manual del Sistema de Gestión de Calidad (SGC)',
      'Caracterización de Procesos y Flujogramas',
      'Matriz de Riesgos y Oportunidades ISO 9001',
      'Procedimientos Documentados y Formatos Maestros',
      'Informe de Auditoría Interna de Calidad'
    ]
  },
  AMBIENTAL: {
    codigo: 'AMBIENTAL',
    nombre: 'Gestión y Licenciamiento Ambiental',
    badge: 'Sostenibilidad',
    color: '#14b8a6',
    glow: 'rgba(20, 184, 166, 0.25)',
    icono: 'Leaf',
    descripcion: 'Cumplimiento normativo ambiental, planes de manejo (PMA) y gestión integral de residuos.',
    requisitosCliente: [
      { id: 'amb-1', nombre: 'Ubicación Geográfica y Coordenadas del Predio', obligatorio: true, formato: 'KML o PDF' },
      { id: 'amb-2', nombre: 'Actividad Económica y Consumo de Recursos', obligatorio: true, formato: 'PDF' },
      { id: 'amb-3', nombre: 'Historial de Permisos o Concesiones', obligatorio: false, formato: 'PDF' }
    ],
    entregablesYabaGroup: [
      'Plan de Manejo Ambiental (PMA)',
      'Matriz de Identificación y Evaluación de Impactos Ambientales',
      'Plan de Gestión Integral de Residuos (PGIR)',
      'Informes de Cumplimiento Ambiental (ICA)'
    ]
  },
  CONSULTORIA: {
    codigo: 'CONSULTORIA',
    nombre: 'Consultoría Estratégica & Empresarial',
    badge: 'Negocios',
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.25)',
    icono: 'TrendingUp',
    descripcion: 'Diagnóstico financiero, reestructuración corporativa, KPIs y planes de crecimiento sostenible.',
    requisitosCliente: [
      { id: 'con-1', nombre: 'Estados Financieros de los últimos 2 años', obligatorio: true, formato: 'Excel o PDF' },
      { id: 'con-2', nombre: 'Manual de Funciones o Perfiles de Puesto', obligatorio: false, formato: 'PDF' },
      { id: 'con-3', nombre: 'Tablero de Indicadores Actuales (si aplica)', obligatorio: false, formato: 'Excel' }
    ],
    entregablesYabaGroup: [
      'Diagnóstico Integral Organizacional y Financiero',
      'Plan Estratégico de Transformación y Mejora',
      'Tablero de Mando Integral (KPIs y OKRs)',
      'Informe Ejecutivo para Junta Directiva'
    ]
  }
};
