// Mock Data interactiva para modo Offline / Presentación de Proyecto
export const INITIAL_EMPRESAS = [
  {
    id: 'emp-1',
    nit: '901.458.789-1',
    razonSocial: 'Constructora Andina S.A.S.',
    representante: 'Ing. Carlos Alberto Restrepo',
    email: 'contacto@constructoraandina.com',
    telefono: '+57 310 456 7890',
    ciudad: 'Medellín, Colombia',
    sector: 'Construcción y Obras Civiles'
  },
  {
    id: 'emp-2',
    nit: '800.123.456-7',
    razonSocial: 'Tecnología & Soluciones Globales Ltda.',
    representante: 'Dra. María Fernanda Gómez',
    email: 'gerencia@tsg.com.co',
    telefono: '+57 315 987 6543',
    ciudad: 'Bogotá, Colombia',
    sector: 'Tecnología y Software'
  },
  {
    id: 'emp-3',
    nit: '900.874.112-4',
    razonSocial: 'Logística & Transportes del Valle S.A.',
    representante: 'Julián Morales Echeverri',
    email: 'operaciones@logivalledelvalle.com',
    telefono: '+57 318 223 3445',
    ciudad: 'Cali, Colombia',
    sector: 'Transporte y Carga'
  }
];

export const INITIAL_EXPEDIENTES = [
  {
    id: 'exp-1',
    radicado: 'EXP-2026-SST-001',
    organizacionId: 'emp-1',
    moduloCodigo: 'SG_SST',
    titulo: 'Diseño e Implementación del SG-SST (Dec. 1072)',
    descripcion: 'Construcción del sistema de gestión de seguridad, política de SST, matriz de riesgos IPEC y plan de capacitaciones para 45 trabajadores.',
    estado: 'en_elaboracion',
    porcentajeAvance: 70,
    fechaCreacion: '2026-10-01',
    fechaLimite: '2026-11-20',
    responsableYabaGroup: 'Ing. Yaba Specialist SST'
  },
  {
    id: 'exp-2',
    radicado: 'EXP-2026-JUR-002',
    organizacionId: 'emp-1',
    moduloCodigo: 'JURIDICO',
    titulo: 'Blindaje Jurídico de Contratos de Subcontratación',
    descripcion: 'Revisión exhaustiva de cláusulas de responsabilidad civil cruzada y pólizas de cumplimiento con proveedores de maquinaria pesada.',
    estado: 'entregado',
    porcentajeAvance: 100,
    fechaCreacion: '2026-09-15',
    fechaLimite: '2026-10-10',
    responsableYabaGroup: 'Dra. Yaba Legal Consultant'
  },
  {
    id: 'exp-3',
    radicado: 'EXP-2026-ING-003',
    organizacionId: 'emp-1',
    moduloCodigo: 'INGENIERIA',
    titulo: 'Cálculo Estructural y Planos Edificio Sierra Verde',
    descripcion: 'Modelado en SAP2000, memoria de cálculo sismorresistente NSR-10 y planos de despiece estructural.',
    estado: 'en_revision',
    porcentajeAvance: 40,
    fechaCreacion: '2026-10-05',
    fechaLimite: '2026-12-05',
    responsableYabaGroup: 'Ing. Civil Senior Yaba'
  },
  {
    id: 'exp-4',
    radicado: 'EXP-2026-CAL-004',
    organizacionId: 'emp-2',
    moduloCodigo: 'CALIDAD_ISO',
    titulo: 'Auditoría Interna y Manual de Calidad ISO 9001:2015',
    descripcion: 'Documentación de macroprocesos de desarrollo de software y mesa de ayuda con miras a la certificación.',
    estado: 'pendiente_documentacion',
    porcentajeAvance: 15,
    fechaCreacion: '2026-10-14',
    fechaLimite: '2026-11-30',
    responsableYabaGroup: 'Auditor Líder Yaba'
  }
];

export const INITIAL_DOCUMENTOS = [
  {
    id: 'doc-1',
    expedienteId: 'exp-1',
    tipo: 'requisito_cliente',
    categoria: 'RUT Actualizado',
    nombreArchivo: 'RUT_ConstructoraAndina_2026.pdf',
    tamano: '1.4 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-03',
    subidoPor: 'contacto@constructoraandina.com',
    estado: 'aprobado',
    observaciones: 'Documento vigente y legible verificado ante DIAN.'
  },
  {
    id: 'doc-2',
    expedienteId: 'exp-1',
    tipo: 'requisito_cliente',
    categoria: 'Cámara de Comercio (Vigente < 30 días)',
    nombreArchivo: 'Certificado_Existencia_Octubre2026.pdf',
    tamano: '2.1 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-03',
    subidoPor: 'contacto@constructoraandina.com',
    estado: 'aprobado',
    observaciones: 'Expedición de hace 4 días. Válido.'
  },
  {
    id: 'doc-3',
    expedienteId: 'exp-1',
    tipo: 'requisito_cliente',
    categoria: 'Registro Fotográfico de Instalaciones',
    nombreArchivo: 'Fotos_PuestosTrabajo_Campamento.zip',
    tamano: '18.6 MB',
    formato: 'ZIP',
    fechaSubida: '2026-10-05',
    subidoPor: 'contacto@constructoraandina.com',
    estado: 'aprobado',
    observaciones: 'Evidencias completas de obra y oficinas técnicas.'
  },
  {
    id: 'doc-4',
    expedienteId: 'exp-1',
    tipo: 'entregable_yabagroup',
    categoria: 'Matriz de Identificación de Peligros y Valoración de Riesgos (GTC 45)',
    nombreArchivo: 'YabaGroup_Matriz_Riesgos_GTC45_Andina_v1.xlsx',
    tamano: '3.8 MB',
    formato: 'EXCEL',
    fechaSubida: '2026-10-15',
    subidoPor: 'especialista.sst@yabagroup.com',
    estado: 'aprobado',
    version: 1,
    urlDescarga: '#'
  },
  {
    id: 'doc-5',
    expedienteId: 'exp-1',
    tipo: 'entregable_yabagroup',
    categoria: 'Política de Seguridad y Salud en el Trabajo',
    nombreArchivo: 'YabaGroup_Politica_SST_Firmas.pdf',
    tamano: '890 KB',
    formato: 'PDF',
    fechaSubida: '2026-10-18',
    subidoPor: 'especialista.sst@yabagroup.com',
    estado: 'aprobado',
    version: 1,
    urlDescarga: '#'
  },
  {
    id: 'doc-6',
    expedienteId: 'exp-2',
    tipo: 'entregable_yabagroup',
    categoria: 'Concepto Jurídico Formal y Análisis de Riesgos Legales',
    nombreArchivo: 'Concepto_Juridico_Minutas_Obra_YabaGroup.pdf',
    tamano: '1.2 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-08',
    subidoPor: 'abogada@yabagroup.com',
    estado: 'aprobado',
    version: 1,
    urlDescarga: '#'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    usuario: 'contacto@constructoraandina.com',
    rol: 'cliente',
    accion: 'CARGA_DOCUMENTO',
    expediente: 'EXP-2026-SST-001',
    modulo: 'SG_SST',
    detalle: 'Subió archivo "RUT_ConstructoraAndina_2026.pdf" (1.4 MB)',
    fecha: '2026-10-03 10:24 AM'
  },
  {
    id: 'log-2',
    usuario: 'especialista.sst@yabagroup.com',
    rol: 'admin',
    accion: 'APROBACION_DOCUMENTO',
    expediente: 'EXP-2026-SST-001',
    modulo: 'SG_SST',
    detalle: 'Aprobó RUT y Cámara de Comercio para el expediente.',
    fecha: '2026-10-04 03:15 PM'
  },
  {
    id: 'log-3',
    usuario: 'especialista.sst@yabagroup.com',
    rol: 'admin',
    accion: 'PUBLICACION_ENTREGABLE',
    expediente: 'EXP-2026-SST-001',
    modulo: 'SG_SST',
    detalle: 'Publicó documento final: "YabaGroup_Matriz_Riesgos_GTC45_Andina_v1.xlsx"',
    fecha: '2026-10-15 11:40 AM'
  },
  {
    id: 'log-4',
    usuario: 'abogada@yabagroup.com',
    rol: 'admin',
    accion: 'CIERRE_EXPEDIENTE',
    expediente: 'EXP-2026-JUR-002',
    modulo: 'JURIDICO',
    detalle: 'Marcó expediente EXP-2026-JUR-002 como 100% completado y entregado.',
    fecha: '2026-10-18 05:00 PM'
  }
];
