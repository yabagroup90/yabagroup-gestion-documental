-- =========================================================================
-- ESQUEMA DE BASE DE DATOS PARA "YABAGROUP GESTIÓN DOCUMENTAL"
-- Plataforma B2B de Gestión Documental y Asesorías Multivertical
-- (SG-SST, Jurídico, Calidad ISO, Ingeniería, Ambiental, Consultoría)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. TABLA: ORGANIZACIONES / EMPRESAS CLIENTES
CREATE TABLE IF NOT EXISTS public.organizaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nit VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(255) NOT NULL,
    representante_legal VARCHAR(150),
    email_contacto VARCHAR(120) NOT NULL,
    telefono VARCHAR(50),
    ciudad VARCHAR(100) DEFAULT 'Colombia',
    sector_economico VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: PERFILES DE USUARIO
CREATE TABLE IF NOT EXISTS public.perfiles_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(120) NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'cliente')),
    organizacion_id UUID REFERENCES public.organizaciones(id) ON DELETE SET NULL,
    cargo VARCHAR(100),
    telefono VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: CATÁLOGO DE MÓDULOS DE ASESORÍA
CREATE TABLE IF NOT EXISTS public.modulos_servicio (
    codigo VARCHAR(30) PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Folder',
    color_acento VARCHAR(20) DEFAULT '#2563eb',
    activo BOOLEAN DEFAULT true
);

-- 4. TABLA: PLANTILLA DE REQUISITOS POR MÓDULO (CHECKLIST AUTOMÁTICO)
CREATE TABLE IF NOT EXISTS public.requisitos_plantilla (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_codigo VARCHAR(30) REFERENCES public.modulos_servicio(codigo) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    obligatorio BOOLEAN DEFAULT true,
    formato_sugerido VARCHAR(50) DEFAULT 'PDF, JPG, PNG'
);

-- 5. TABLA: EXPEDIENTES / PROYECTOS DE ASESORÍA
CREATE TABLE IF NOT EXISTS public.expedientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    radicado VARCHAR(50) NOT NULL UNIQUE,
    organizacion_id UUID NOT NULL REFERENCES public.organizaciones(id) ON DELETE CASCADE,
    modulo_codigo VARCHAR(30) NOT NULL REFERENCES public.modulos_servicio(codigo),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente_documentacion' CHECK (
        estado IN ('pendiente_documentacion', 'en_revision', 'en_elaboracion', 'entregado', 'finalizado')
    ),
    porcentaje_avance INT DEFAULT 10,
    fecha_limite DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: DOCUMENTOS (REQUISITOS SUBIDOS POR CLIENTE Y ENTREGABLES DE YABAGROUP)
CREATE TABLE IF NOT EXISTS public.documentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expediente_id UUID NOT NULL REFERENCES public.expedientes(id) ON DELETE CASCADE,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('requisito_cliente', 'entregable_yabagroup')),
    nombre_archivo VARCHAR(255) NOT NULL,
    categoria_documento VARCHAR(150) NOT NULL,
    ruta_storage TEXT NOT NULL,
    tamano_bytes BIGINT DEFAULT 0,
    formato VARCHAR(20),
    subido_por_email VARCHAR(120),
    estado_validacion VARCHAR(30) DEFAULT 'pendiente' CHECK (
        estado_validacion IN ('pendiente', 'aprobado', 'observaciones')
    ),
    observaciones TEXT,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: LOGS DE AUDITORÍA Y TRAZABILIDAD LEGAL
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_email VARCHAR(120),
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(50),
    expediente_radicado VARCHAR(50),
    detalle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.organizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos_servicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisitos_plantilla ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expedientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar organizaciones" ON public.organizaciones;
CREATE POLICY "Usuarios autenticados pueden consultar organizaciones"
  ON public.organizaciones FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar perfiles" ON public.perfiles_usuarios;
CREATE POLICY "Usuarios autenticados pueden consultar perfiles"
  ON public.perfiles_usuarios FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar catalogos" ON public.modulos_servicio;
CREATE POLICY "Usuarios autenticados pueden consultar catalogos"
  ON public.modulos_servicio FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar requisitos" ON public.requisitos_plantilla;
CREATE POLICY "Usuarios autenticados pueden consultar requisitos"
  ON public.requisitos_plantilla FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar expedientes" ON public.expedientes;
CREATE POLICY "Usuarios autenticados pueden consultar expedientes"
  ON public.expedientes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar documentos" ON public.documentos;
CREATE POLICY "Usuarios autenticados pueden consultar documentos"
  ON public.documentos FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden crear documentos" ON public.documentos;
CREATE POLICY "Usuarios autenticados pueden crear documentos"
  ON public.documentos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar documentos" ON public.documentos;
CREATE POLICY "Usuarios autenticados pueden actualizar documentos"
  ON public.documentos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar documentos" ON public.documentos;
CREATE POLICY "Usuarios autenticados pueden eliminar documentos"
  ON public.documentos FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Usuarios autenticados pueden consultar logs" ON public.audit_logs;
CREATE POLICY "Usuarios autenticados pueden consultar logs"
  ON public.audit_logs FOR SELECT TO authenticated USING (true);

-- =========================================================================
-- DATOS SEMILLA (SEED DATA)
-- =========================================================================

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('SG_SST', 'Seguridad y Salud en el Trabajo', 'Diseño e implementación del SG-SST, matrices de riesgos, políticas e informes.', 'ShieldCheck', '#10b981')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('JURIDICO', 'Servicios Jurídicos', 'Elaboración y revisión de contratos, conceptos legales, contestaciones y poderes.', 'Scale', '#6366f1')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('INGENIERIA', 'Diseño e Ingeniería', 'Planos estructurales, memorias de cálculo, especificaciones y presupuestos.', 'Compass', '#f59e0b')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('CALIDAD_ISO', 'Gestión de Calidad (ISO 9001)', 'Manuales de calidad, caracterización de procesos y auditorías internas.', 'Award', '#ec4899')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('AMBIENTAL', 'Gestión Ambiental', 'Planes de manejo ambiental, matrices de impacto y trámites de licencias.', 'Leaf', '#14b8a6')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO public.modulos_servicio (codigo, nombre, descripcion, icono, color_acento)
VALUES
('CONSULTORIA', 'Consultoría Empresarial', 'Diagnósticos organizacionales, optimización financiera y planes de mejora.', 'TrendingUp', '#8b5cf6')
ON CONFLICT (codigo) DO NOTHING;

-- Plantillas de requisitos
INSERT INTO public.requisitos_plantilla (modulo_codigo, nombre, descripcion, obligatorio) VALUES
('SG_SST', 'RUT Actualizado', 'RUT vigente expedido por la DIAN', true),
('SG_SST', 'Cámara de Comercio', 'Certificado de existencia con vigencia no mayor a 30 días', true),
('SG_SST', 'Evidencias Fotográficas de Instalaciones', 'Fotos de áreas de trabajo, señalización y puestos', true),
('SG_SST', 'Listado de Trabajadores y ARL', 'Certificado de afiliación a seguridad social del personal', true),

('JURIDICO', 'Contrato o Documento Objeto de Revisión', 'Copia en PDF o Word del documento a analizar', true),
('JURIDICO', 'Poder Legal o Representación', 'Autorización para actuar si aplica', false),
('JURIDICO', 'Pruebas o Antecedentes', 'Documentos de respaldo y comunicaciones previas', true),

('INGENIERIA', 'Levantamiento Topográfico o Planos Base', 'Archivos DWG o PDF con dimensiones actuales', true),
('INGENIERIA', 'Especificaciones Técnicas del Proyecto', 'Normas aplicables y requisitos del cliente', true),
('INGENIERIA', 'Fotografías del Terreno / Obra', 'Registro fotográfico del sitio de intervención', true),

('CALIDAD_ISO', 'Mapa de Procesos Existente', 'Diagrama de los macroprocesos de la entidad', true),
('CALIDAD_ISO', 'Procedimientos y Formatos Vigentes', 'Documentación interna actual para diagnóstico', true),

('AMBIENTAL', 'Estudios de Suelo o Entorno', 'Diagnósticos ambientales previos', true),
('AMBIENTAL', 'Licencias y Permisos Actuales', 'Permisos de vertimientos, emisiones o uso de recursos', false),

('CONSULTORIA', 'Estados Financieros Recientes', 'Balances y estados de resultados de los dos últimos años', true),
('CONSULTORIA', 'Organigrama y Manual de Funciones', 'Estructura operativa actual de la empresa', false);

-- Empresas Demo
INSERT INTO public.organizaciones (id, nit, razon_social, representante_legal, email_contacto, telefono, sector_economico)
VALUES
('b7d12f38-6f6a-4b95-a241-111111111111', '901.458.789-1', 'Constructora Andina S.A.S.', 'Carlos Alberto Restrepo', 'contacto@constructoraandina.com', '3104567890', 'Construcción')
ON CONFLICT (nit) DO NOTHING;

INSERT INTO public.organizaciones (id, nit, razon_social, representante_legal, email_contacto, telefono, sector_economico)
VALUES
('c8e23f49-7a7b-4c06-b352-222222222222', '800.123.456-7', 'Tecnología & Servicios Globales Ltda.', 'María Fernanda Gómez', 'gerencia@tsg.com.co', '3159876543', 'Tecnología')
ON CONFLICT (nit) DO NOTHING;

-- Expedientes Demo
INSERT INTO public.expedientes (id, radicado, organizacion_id, modulo_codigo, titulo, descripcion, estado, porcentaje_avance, fecha_limite)
VALUES
('d9f34a50-8b8c-4d17-c463-333333333333', 'EXP-2026-SST-001', 'b7d12f38-6f6a-4b95-a241-111111111111', 'SG_SST', 'Diseño y Radicación Plan Anual SG-SST 2026', 'Elaboración integral de la matriz de riesgos IPEC, política de SST y programa de capacitación anual.', 'en_elaboracion', 65, '2026-11-30')
ON CONFLICT (radicado) DO NOTHING;

INSERT INTO public.expedientes (id, radicado, organizacion_id, modulo_codigo, titulo, descripcion, estado, porcentaje_avance, fecha_limite)
VALUES
('ea045b61-9c9d-4e28-d574-444444444444', 'EXP-2026-JUR-002', 'b7d12f38-6f6a-4b95-a241-111111111111', 'JURIDICO', 'Concepto Jurídico y Minuta de Contratos de Obra', 'Revisión y blindaje de cláusulas de responsabilidad civil y garantías en subcontratos.', 'entregado', 100, '2026-10-15')
ON CONFLICT (radicado) DO NOTHING;

-- Documentos de prueba
INSERT INTO public.documentos (expediente_id, tipo, nombre_archivo, categoria_documento, ruta_storage, formato, estado_validacion, subido_por_email)
VALUES
('d9f34a50-8b8c-4d17-c463-333333333333', 'requisito_cliente', 'RUT_Constructora_Andina_2026.pdf', 'RUT Actualizado', 'requisitos/rut_2026.pdf', 'PDF', 'aprobado', 'contacto@constructoraandina.com'),
('d9f34a50-8b8c-4d17-c463-333333333333', 'requisito_cliente', 'Camara_Comercio_Oct2026.pdf', 'Cámara de Comercio', 'requisitos/camara_comercio.pdf', 'PDF', 'aprobado', 'contacto@constructoraandina.com'),
('d9f34a50-8b8c-4d17-c463-333333333333', 'entregable_yabagroup', 'Borrador_Matriz_Riesgos_GTC45.pdf', 'Matriz de Riesgos', 'entregables/matriz_riesgos_gtc45.pdf', 'PDF', 'aprobado', 'asesor@yabagroup.com'),
('ea045b61-9c9d-4e28-d574-444444444444', 'entregable_yabagroup', 'Concepto_Juridico_Final_YabaGroup.pdf', 'Concepto Jurídico Oficial', 'entregables/concepto_juridico_final.pdf', 'PDF', 'aprobado', 'abogada@yabagroup.com');

-- Log inicial
INSERT INTO public.audit_logs (usuario_email, accion, modulo, expediente_radicado, detalle)
VALUES
('sistema@yabagroup.com', 'INICIALIZACION_PLATAFORMA', 'GENERAL', 'N/A', 'Se inicializa el sistema YabaGroup Gestión Documental con esquemas multiverticales.');

-- BUCKETS DE STORAGE:
-- Crear en Supabase -> Storage -> "documentos-clientes" y "entregables-yabagroup"
