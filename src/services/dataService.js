import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  USUARIOS: 'yabagroup_usuarios_v2',
  SESSION: 'yabagroup_session',
  EMPRESAS: 'yabagroup_empresas_v2',
  EXPEDIENTES: 'yabagroup_expedientes_v2',
  DOCUMENTOS: 'yabagroup_documentos_v2'
};

const uploadedFiles = new Map();

const mapEmpresa = (empresa) => ({
  id: empresa.id,
  nit: empresa.nit,
  razonSocial: empresa.razon_social,
  representante: empresa.representante_legal,
  email: empresa.email_contacto,
  telefono: empresa.telefono,
  ciudad: empresa.ciudad,
  sector: empresa.sector_economico
});

const mapExpediente = (expediente) => ({
  id: expediente.id,
  radicado: expediente.radicado,
  organizacionId: expediente.organizacion_id,
  moduloCodigo: expediente.modulo_codigo,
  titulo: expediente.titulo,
  descripcion: expediente.descripcion,
  estado: expediente.estado,
  porcentajeAvance: expediente.porcentaje_avance,
  fechaCreacion: expediente.created_at?.split('T')[0],
  fechaLimite: expediente.fecha_limite
});

const mapDocumento = (documento) => ({
  id: documento.id,
  expedienteId: documento.expediente_id,
  tipo: documento.tipo,
  categoria: documento.categoria_documento,
  nombreArchivo: documento.nombre_archivo,
  rutaStorage: documento.ruta_storage,
  tamano: documento.tamano_bytes
    ? `${(documento.tamano_bytes / (1024 * 1024)).toFixed(1)} MB`
    : '0.0 MB',
  formato: documento.formato,
  fechaSubida: documento.created_at?.split('T')[0],
  subidoPor: documento.subido_por_email,
  estado: documento.estado_validacion,
  observaciones: documento.observaciones || '',
  archivoDisponible: Boolean(documento.ruta_storage)
});

export const ALL_EMPRESAS = [
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
    representante: 'Dr. Julián Morales Echeverri',
    email: 'operaciones@logivalledelvalle.com',
    telefono: '+57 318 223 3445',
    ciudad: 'Cali, Colombia',
    sector: 'Transporte y Carga Pesada'
  },
  {
    id: 'emp-4',
    nit: '901.765.432-8',
    razonSocial: 'Urbanizaciones & Ingeniería del Norte S.A.S.',
    representante: 'Ing. Rodrigo Cárdenas',
    email: 'proyectos@ingenieriandina.com',
    telefono: '+57 312 889 9001',
    ciudad: 'Bucaramanga, Colombia',
    sector: 'Ingeniería y Construcción'
  }
];

export const ALL_USUARIOS = [
  {
    id: 'usr-admin',
    email: 'admin@yabagroup.com',
    password: 'admin123',
    nombre: 'Dirección General YabaGroup',
    rol: 'admin',
    empresaId: null
  },
  {
    id: 'usr-cliente-1',
    email: 'contacto@constructoraandina.com',
    password: 'cliente123',
    nombre: 'Constructora Andina S.A.S.',
    razonSocial: 'Constructora Andina S.A.S.',
    rol: 'cliente',
    empresaId: 'emp-1'
  },
  {
    id: 'usr-cliente-2',
    email: 'operaciones@logivalledelvalle.com',
    password: 'cliente123',
    nombre: 'Logística & Transportes del Valle S.A.',
    razonSocial: 'Logística & Transportes del Valle S.A.',
    rol: 'cliente',
    empresaId: 'emp-3'
  },
  {
    id: 'usr-cliente-3',
    email: 'proyectos@ingenieriandina.com',
    password: 'cliente123',
    nombre: 'Urbanizaciones & Ingeniería del Norte',
    razonSocial: 'Urbanizaciones & Ingeniería del Norte S.A.S.',
    rol: 'cliente',
    empresaId: 'emp-4'
  },
  {
    id: 'usr-cliente-4',
    email: 'gerencia@tsg.com.co',
    password: 'cliente123',
    nombre: 'Tecnología & Soluciones Globales Ltda.',
    razonSocial: 'Tecnología & Soluciones Globales Ltda.',
    rol: 'cliente',
    empresaId: 'emp-2'
  }
];

export const ALL_EXPEDIENTES = [
  // 1. SST - Constructora Andina
  {
    id: 'exp-1',
    radicado: 'EXP-2026-SST-001',
    organizacionId: 'emp-1',
    moduloCodigo: 'SG_SST',
    titulo: 'Diseño e Implementación del SG-SST (Dec. 1072)',
    descripcion: 'Elaboración del sistema de gestión de seguridad, política de SST, matriz de riesgos IPEC y plan de capacitaciones.',
    estado: 'en_elaboracion',
    porcentajeAvance: 70,
    fechaCreacion: '2026-10-01',
    fechaLimite: '2026-11-20'
  },
  // 2. JURÍDICO - Logística & Transportes del Valle
  {
    id: 'exp-2',
    radicado: 'EXP-2026-JUR-002',
    organizacionId: 'emp-3',
    moduloCodigo: 'JURIDICO',
    titulo: 'Blindaje Jurídico de Contratos de Transporte y Maquinaria',
    descripcion: 'Revisión exhaustiva de cláusulas de responsabilidad civil cruzada y pólizas de cumplimiento con contratistas.',
    estado: 'entregado',
    porcentajeAvance: 100,
    fechaCreacion: '2026-09-15',
    fechaLimite: '2026-10-10'
  },
  // 3. INGENIERÍA - Urbanizaciones & Ingeniería del Norte
  {
    id: 'exp-3',
    radicado: 'EXP-2026-ING-003',
    organizacionId: 'emp-4',
    moduloCodigo: 'INGENIERIA',
    titulo: 'Cálculo Estructural y Planos Edificio Panorama',
    descripcion: 'Modelado en SAP2000, memoria de cálculo sismorresistente NSR-10 y planos de despiece estructural.',
    estado: 'en_elaboracion',
    porcentajeAvance: 60,
    fechaCreacion: '2026-10-05',
    fechaLimite: '2026-12-05'
  },
  // 4. CALIDAD ISO - Tecnología & Soluciones Globales
  {
    id: 'exp-4',
    radicado: 'EXP-2026-CAL-004',
    organizacionId: 'emp-2',
    moduloCodigo: 'CALIDAD_ISO',
    titulo: 'Auditoría Interna y Manual de Calidad ISO 9001:2015',
    descripcion: 'Documentación de macroprocesos de desarrollo de software y mesa de ayuda con miras a certificación.',
    estado: 'pendiente_documentacion',
    porcentajeAvance: 25,
    fechaCreacion: '2026-10-14',
    fechaLimite: '2026-11-30'
  }
];

export const ALL_DOCUMENTOS = [
  // Documentos SST (EXP-1)
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
    observaciones: 'RUT verificado ante la DIAN.'
  },
  {
    id: 'doc-2',
    expedienteId: 'exp-1',
    tipo: 'requisito_cliente',
    categoria: 'Cámara de Comercio (Vigente < 30 días)',
    nombreArchivo: 'Camara_Comercio_Oct2026.pdf',
    tamano: '2.1 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-03',
    subidoPor: 'contacto@constructoraandina.com',
    estado: 'aprobado',
    observaciones: 'Certificado de existencia vigente.'
  },
  {
    id: 'doc-3',
    expedienteId: 'exp-1',
    tipo: 'entregable_yabagroup',
    categoria: 'Matriz de Identificación de Peligros y Valoración de Riesgos (GTC 45)',
    nombreArchivo: 'YabaGroup_Matriz_Riesgos_GTC45_Andina.xlsx',
    tamano: '3.8 MB',
    formato: 'EXCEL',
    fechaSubida: '2026-10-15',
    subidoPor: 'especialista.sst@yabagroup.com',
    estado: 'aprobado'
  },

  // Documentos JURÍDICO (EXP-2 - Logística & Transportes)
  {
    id: 'doc-jur-1',
    expedienteId: 'exp-2',
    tipo: 'requisito_cliente',
    categoria: 'Contrato o Minuta a Revisar',
    nombreArchivo: 'Borrador_Contrato_Transporte_Carga.docx',
    tamano: '850 KB',
    formato: 'WORD',
    fechaSubida: '2026-09-18',
    subidoPor: 'operaciones@logivalledelvalle.com',
    estado: 'aprobado',
    observaciones: 'Minuta original enviada por el contratista.'
  },
  {
    id: 'doc-jur-2',
    expedienteId: 'exp-2',
    tipo: 'entregable_yabagroup',
    categoria: 'Concepto Jurídico Formal y Análisis de Riesgos Legales',
    nombreArchivo: 'YabaGroup_Concepto_Juridico_TransportesValle.pdf',
    tamano: '1.5 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-08',
    subidoPor: 'juridico@yabagroup.com',
    estado: 'aprobado'
  },
  {
    id: 'doc-jur-3',
    expedienteId: 'exp-2',
    tipo: 'entregable_yabagroup',
    categoria: 'Contratos Revisados y Cláusulas Blindadas',
    nombreArchivo: 'Contrato_Transporte_Blindado_ZabaFirmas.pdf',
    tamano: '1.8 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-09',
    subidoPor: 'juridico@yabagroup.com',
    estado: 'aprobado'
  },

  // Documentos INGENIERÍA (EXP-3 - Urbanizaciones del Norte)
  {
    id: 'doc-ing-1',
    expedienteId: 'exp-3',
    tipo: 'requisito_cliente',
    categoria: 'Planos Base o Levantamiento Topográfico',
    nombreArchivo: 'Topografia_Predio_Panorama_Norte.dwg',
    tamano: '6.4 MB',
    formato: 'DWG',
    fechaSubida: '2026-10-06',
    subidoPor: 'proyectos@ingenieriandina.com',
    estado: 'aprobado',
    observaciones: 'Levantamiento georreferenciado verificado.'
  },
  {
    id: 'doc-ing-2',
    expedienteId: 'exp-3',
    tipo: 'requisito_cliente',
    categoria: 'Especificaciones Técnicas del Proyecto',
    nombreArchivo: 'Especificaciones_Arquitectonicas_Panorama.pdf',
    tamano: '2.8 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-07',
    subidoPor: 'proyectos@ingenieriandina.com',
    estado: 'aprobado'
  },
  {
    id: 'doc-ing-3',
    expedienteId: 'exp-3',
    tipo: 'entregable_yabagroup',
    categoria: 'Memoria de Cálculo Estructural / Hidráulica',
    nombreArchivo: 'YabaGroup_Memoria_Calculo_NSR10_Panorama.pdf',
    tamano: '5.1 MB',
    formato: 'PDF',
    fechaSubida: '2026-10-18',
    subidoPor: 'ingenieria@yabagroup.com',
    estado: 'aprobado'
  },

  // Documentos CALIDAD ISO (EXP-4 - Tecnología & Soluciones)
  {
    id: 'doc-cal-1',
    expedienteId: 'exp-4',
    tipo: 'requisito_cliente',
    categoria: 'Organigrama y Estructura Organizacional',
    nombreArchivo: 'Organigrama_Operaciones_TSG.pdf',
    tamano: '920 KB',
    formato: 'PDF',
    fechaSubida: '2026-10-15',
    subidoPor: 'gerencia@tsg.com.co',
    estado: 'aprobado'
  }
];

// Helper con sincronización y fusión automática
const getMergedStorage = (key, initialDefaults, compareField = 'id') => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialDefaults));
      return initialDefaults;
    }
    const current = JSON.parse(raw);
    if (!Array.isArray(current)) {
      localStorage.setItem(key, JSON.stringify(initialDefaults));
      return initialDefaults;
    }

    // Fusionar: asegurarse de que todos los valores por defecto existan
    const existingIds = new Set(current.map(item => String(item[compareField] || item.email || item.id)));
    const missing = initialDefaults.filter(def => !existingIds.has(String(def[compareField] || def.email || def.id)));

    if (missing.length > 0) {
      const merged = [...current, ...missing];
      localStorage.setItem(key, JSON.stringify(merged));
      return merged;
    }
    return current;
  } catch {
    localStorage.setItem(key, JSON.stringify(initialDefaults));
    return initialDefaults;
  }
};

const setStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving storage:', e);
  }
};

export const dataService = {
  isLive: isSupabaseConfigured,

  // Login garantizado con todas las cuentas
  login: async (email, password) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    console.log('[Login] Intentando con:', cleanEmail);
    console.log('[Login] isSupabaseConfigured:', isSupabaseConfigured);

    // Intentar con Supabase primero (si está configurado)
    if (isSupabaseConfigured && supabase) {
      try {
        console.log('[Login] Intentando autenticación con Supabase...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass,
        });
        if (!error && data?.user) {
          console.log('[Login] Supabase OK:', data.user.email);
          const userSup = data.user;
          const { data: profile, error: profileError } = await supabase
            .from('perfiles_usuarios')
            .select('id, email, nombre_completo, rol, organizacion_id')
            .eq('id', userSup.id)
            .maybeSingle();
          if (profileError) throw new Error(`No se pudo cargar el perfil: ${profileError.message}`);

          // Fallback local únicamente para instalaciones que aún no tienen perfiles creados.
          const localUser = ALL_USUARIOS.find(u => u.email.toLowerCase() === cleanEmail);
          const session = {
            id: userSup.id,
            email: userSup.email,
            nombre: profile?.nombre_completo || localUser?.nombre || userSup.user_metadata?.full_name || cleanEmail,
            rol: profile?.rol || localUser?.rol || userSup.app_metadata?.role || 'cliente',
            empresaId: profile?.organizacion_id || localUser?.empresaId || null,
            razonSocial: localUser?.razonSocial || localUser?.nombre || '',
          };
          setStorage(STORAGE_KEYS.SESSION, session);
          return session;
        }
        console.warn('[Login] Supabase falló, intentando con usuarios locales. Error:', error?.message);
      } catch (err) {
        console.warn('[Login] Excepción Supabase, intentando con usuarios locales:', err.message);
      }
    }

    if (isSupabaseConfigured) {
      console.error('[Login] Supabase está configurado, pero la autenticación no fue válida.');
      return null;
    }

    // Fallback siempre disponible: usuarios locales (mock)
    console.log('[Login] Buscando en usuarios locales...');
    const usuarios = getMergedStorage(STORAGE_KEYS.USUARIOS, ALL_USUARIOS, 'email');
    console.log('[Login] Usuarios disponibles:', usuarios.map(u => u.email));
    const user = usuarios.find(u =>
      String(u.email).toLowerCase() === cleanEmail &&
      String(u.password) === cleanPass
    );
    if (user) {
      console.log('[Login] Usuario local encontrado:', user.email, '| rol:', user.rol);
      const session = {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        empresaId: user.empresaId,
        razonSocial: user.razonSocial || user.nombre,
      };
      setStorage(STORAGE_KEYS.SESSION, session);
      return session;
    }
    console.warn('[Login] No se encontró usuario con esas credenciales.');
    return null;
  },

  getCurrentSession: () => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  habilitarCliente: async ({ empresa, usuario, expediente }) => {
    const empresas = getMergedStorage(STORAGE_KEYS.EMPRESAS, ALL_EMPRESAS);
    const usuarios = getMergedStorage(STORAGE_KEYS.USUARIOS, ALL_USUARIOS, 'email');
    const expedientes = getMergedStorage(STORAGE_KEYS.EXPEDIENTES, ALL_EXPEDIENTES);

    empresas.unshift(empresa);
    setStorage(STORAGE_KEYS.EMPRESAS, empresas);

    usuarios.push({
      ...usuario,
      empresaId: empresa.id,
      razonSocial: empresa.razonSocial
    });
    setStorage(STORAGE_KEYS.USUARIOS, usuarios);

    const nuevoExp = {
      id: `exp-${Date.now()}`,
      ...expediente,
      organizacionId: empresa.id,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    expedientes.unshift(nuevoExp);
    setStorage(STORAGE_KEYS.EXPEDIENTES, expedientes);

    return { empresa, usuario, expediente: nuevoExp };
  },

  getEmpresas: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('organizaciones')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw new Error(`No se pudieron cargar las empresas: ${error.message}`);
      return (data || []).map(mapEmpresa);
    }
    return getMergedStorage(STORAGE_KEYS.EMPRESAS, ALL_EMPRESAS);
  },

  getExpedientes: async (filtros = {}) => {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('expedientes').select('*').order('created_at', { ascending: false });
      if (filtros.organizacionId) query = query.eq('organizacion_id', filtros.organizacionId);
      if (filtros.moduloCodigo && filtros.moduloCodigo !== 'TODOS') query = query.eq('modulo_codigo', filtros.moduloCodigo);
      const { data, error } = await query;
      if (error) throw new Error(`No se pudieron cargar los expedientes: ${error.message}`);
      return (data || []).map(mapExpediente);
    }
    let items = getMergedStorage(STORAGE_KEYS.EXPEDIENTES, ALL_EXPEDIENTES);
    if (filtros.organizacionId) {
      items = items.filter(exp => exp.organizacionId === filtros.organizacionId);
    }
    if (filtros.moduloCodigo && filtros.moduloCodigo !== 'TODOS') {
      items = items.filter(exp => exp.moduloCodigo === filtros.moduloCodigo);
    }
    return items;
  },

  createExpediente: async (nuevoExpediente) => {
    const expedientes = getMergedStorage(STORAGE_KEYS.EXPEDIENTES, ALL_EXPEDIENTES);
    const item = {
      id: `exp-${Date.now()}`,
      ...nuevoExpediente,
      fechaCreacion: new Date().toISOString().split('T')[0],
      porcentajeAvance: 10
    };
    expedientes.unshift(item);
    setStorage(STORAGE_KEYS.EXPEDIENTES, expedientes);
    return item;
  },

  updateExpedienteEstado: async (id, nuevoEstado, nuevoAvance) => {
    const expedientes = getMergedStorage(STORAGE_KEYS.EXPEDIENTES, ALL_EXPEDIENTES);
    const updated = expedientes.map(exp => {
      if (exp.id === id) {
        return { ...exp, estado: nuevoEstado, porcentajeAvance: nuevoAvance ?? exp.porcentajeAvance };
      }
      return exp;
    });
    setStorage(STORAGE_KEYS.EXPEDIENTES, updated);
    return updated.find(exp => exp.id === id);
  },

  getDocumentos: async (expedienteId) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('expediente_id', expedienteId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(`No se pudieron cargar los documentos: ${error.message}`);
      return (data || []).map(mapDocumento);
    }
    const docs = getMergedStorage(STORAGE_KEYS.DOCUMENTOS, ALL_DOCUMENTOS);
    return docs.filter(d => d.expedienteId === expedienteId);
  },

  getAllDocumentos: async () => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(`No se pudieron cargar los documentos: ${error.message}`);
      return (data || []).map(mapDocumento);
    }
    return getMergedStorage(STORAGE_KEYS.DOCUMENTOS, ALL_DOCUMENTOS).map(doc => ({
      ...doc,
      archivoDisponible: uploadedFiles.has(doc.id)
    }));
  },

  uploadDocumento: async ({ expedienteId, tipo, categoria, file, subidoPor, observaciones = '', reemplazaDocumentoId }) => {
    if (isSupabaseConfigured && supabase) {
      if (reemplazaDocumentoId) {
        const { data: previous, error: previousError } = await supabase
          .from('documentos')
          .select('id, estado_validacion')
          .eq('id', reemplazaDocumentoId)
          .single();
        if (previousError) throw new Error(`No se pudo validar el documento anterior: ${previousError.message}`);
        if (previous.estado_validacion !== 'observaciones') {
          throw new Error('Solo puedes reemplazar un documento al que se le solicitó corrección.');
        }
      }

      const storagePath = `${expedienteId}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(storagePath, file, { upsert: false, contentType: file.type || 'application/octet-stream' });
      if (uploadError) throw new Error(`No se pudo subir el archivo: ${uploadError.message}`);

      const { data: inserted, error: insertError } = await supabase
        .from('documentos')
        .insert({
          expediente_id: expedienteId,
          tipo,
          nombre_archivo: file.name,
          categoria_documento: categoria,
          ruta_storage: storagePath,
          tamano_bytes: file.size,
          formato: file.name.split('.').pop().toUpperCase(),
          subido_por_email: subidoPor,
          estado_validacion: tipo === 'requisito_cliente' ? 'pendiente' : 'aprobado',
          observaciones: observaciones || (tipo === 'requisito_cliente'
            ? 'En espera de revisión técnica por YabaGroup.'
            : 'Documento oficial entregado por YabaGroup.')
        })
        .select('*')
        .single();
      if (insertError) {
        await supabase.storage.from('documentos').remove([storagePath]);
        throw new Error(`No se pudo registrar el documento: ${insertError.message}`);
      }

      if (reemplazaDocumentoId) {
        const { error: deleteError } = await supabase
          .from('documentos')
          .delete()
          .eq('id', reemplazaDocumentoId);
        if (deleteError) throw new Error(`La nueva versión se subió, pero no se pudo reemplazar la anterior: ${deleteError.message}`);
      }
      return mapDocumento(inserted);
    }

    const docs = getMergedStorage(STORAGE_KEYS.DOCUMENTOS, ALL_DOCUMENTOS);
    const documentoReemplazado = reemplazaDocumentoId
      ? docs.find(doc => doc.id === reemplazaDocumentoId)
      : null;

    if (reemplazaDocumentoId && (!documentoReemplazado || documentoReemplazado.estado !== 'observaciones')) {
      throw new Error('Solo puedes reemplazar un documento al que se le solicitó corrección.');
    }

    const nuevoDoc = {
      id: `doc-${Date.now()}`,
      expedienteId,
      tipo,
      categoria,
      nombreArchivo: file.name,
      tamano: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      formato: file.name.split('.').pop().toUpperCase(),
      fechaSubida: new Date().toISOString().split('T')[0],
      subidoPor,
      estado: tipo === 'requisito_cliente' ? 'pendiente' : 'aprobado',
      observaciones: observaciones || (tipo === 'requisito_cliente' ? 'En espera de revisión técnica por YabaGroup.' : 'Documento oficial entregado por YabaGroup.')
    };

    if (documentoReemplazado) {
      uploadedFiles.delete(documentoReemplazado.id);
    }
    uploadedFiles.set(nuevoDoc.id, file);
    const documentosActualizados = documentoReemplazado
      ? [nuevoDoc, ...docs.filter(doc => doc.id !== reemplazaDocumentoId)]
      : [nuevoDoc, ...docs];
    setStorage(STORAGE_KEYS.DOCUMENTOS, documentosActualizados);
    return nuevoDoc;
  },

  downloadDocumento: (doc) => {
    if (isSupabaseConfigured && supabase && doc.rutaStorage) {
      const { data } = supabase.storage.from('documentos').getPublicUrl(doc.rutaStorage);
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const file = uploadedFiles.get(doc.id);
    if (!file) {
      throw new Error('El archivo original no está disponible en esta sesión. Solicita que lo vuelvan a cargar.');
    }

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.nombreArchivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },

  deleteDocumento: async (docId) => {
    const docs = getMergedStorage(STORAGE_KEYS.DOCUMENTOS, ALL_DOCUMENTOS);
    const documentToDelete = docs.find(doc => doc.id === docId);

    if (!documentToDelete) {
      throw new Error('No se encontró el documento que deseas eliminar.');
    }
    if (documentToDelete.estado !== 'observaciones') {
      throw new Error('Solo puedes eliminar documentos que tienen una corrección solicitada.');
    }

    uploadedFiles.delete(docId);
    const updated = docs.filter(doc => doc.id !== docId);
    setStorage(STORAGE_KEYS.DOCUMENTOS, updated);
  },

  updateDocumentoEstado: async (docId, nuevoEstado, observaciones) => {
    if (isSupabaseConfigured && supabase) {
      const { data: target, error: targetError } = await supabase
        .from('documentos')
        .select('id, expediente_id, tipo, categoria_documento, estado_validacion')
        .eq('id', docId)
        .single();
      if (targetError) throw new Error(`No se encontró el documento: ${targetError.message}`);

      let query = supabase
        .from('documentos')
        .update({
          estado_validacion: nuevoEstado,
          observaciones: observaciones || null
        })
        .eq('id', docId);

      if (nuevoEstado === 'observaciones') {
        query = supabase
          .from('documentos')
          .update({
            estado_validacion: nuevoEstado,
            observaciones: observaciones || null
          })
          .eq('expediente_id', target.expediente_id)
          .eq('tipo', target.tipo)
          .eq('categoria_documento', target.categoria_documento)
          .neq('estado_validacion', 'aprobado');
      }

      const { data, error } = await query.select('*');
      if (error) throw new Error(`No se pudo actualizar el estado: ${error.message}`);
      return (data || []).map(mapDocumento);
    }

    const docs = getMergedStorage(STORAGE_KEYS.DOCUMENTOS, ALL_DOCUMENTOS);
    const documentoObjetivo = docs.find(d => d.id === docId);

    if (!documentoObjetivo) {
      throw new Error('No se encontró el documento que deseas actualizar.');
    }

    const updated = docs.map(d => {
      const mismaCategoria = d.expedienteId === documentoObjetivo.expedienteId
        && d.tipo === documentoObjetivo.tipo
        && d.categoria === documentoObjetivo.categoria;

      if (d.id === docId || (nuevoEstado === 'observaciones' && mismaCategoria && d.estado !== 'aprobado')) {
        return { ...d, estado: nuevoEstado, observaciones: observaciones || d.observaciones };
      }
      return d;
    });
    setStorage(STORAGE_KEYS.DOCUMENTOS, updated);
    return updated.find(d => d.id === docId);
  }
};
