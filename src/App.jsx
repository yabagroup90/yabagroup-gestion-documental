import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginView from './components/Auth/LoginView';
import ClientDashboard from './components/ClientPortal/ClientDashboard';
import AdminDashboard from './components/AdminPortal/AdminDashboard';
import UploadModal from './components/Modals/UploadModal';
import ReviewModal from './components/Modals/ReviewModal';
import HabilitarClienteModal from './components/Modals/HabilitarClienteModal';
import { dataService } from './services/dataService';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [selectedExpedienteId, setSelectedExpedienteId] = useState(null);

  // Datos
  const [empresas, setEmpresas] = useState([]);
  const [expedientes, setExpedientes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [uploadModalConfig, setUploadModalConfig] = useState(null);
  const [reviewModalExpediente, setReviewModalExpediente] = useState(null);
  const [showHabilitarModal, setShowHabilitarModal] = useState(false);

  // Notificación Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Carga de datos
  const loadData = async (user = usuarioActual) => {
    try {
      setIsLoading(true);
      const [emps, exps, allDocs] = await Promise.all([
        dataService.getEmpresas(),
        dataService.getExpedientes(),
        dataService.getAllDocumentos()
      ]);
      setEmpresas(emps);
      setExpedientes(exps);
      setDocumentos(allDocs);

      if (user?.rol === 'cliente') {
        const clientExps = exps.filter(e => e.organizacionId === user.empresaId);
        if (clientExps.length > 0) {
          setSelectedExpedienteId(clientExps[0].id);
        }
      } else if (exps.length > 0 && !selectedExpedienteId) {
        setSelectedExpedienteId(exps[0].id);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Restaurar sesión al cargar
  useEffect(() => {
    const session = dataService.getCurrentSession();
    if (session) {
      setUsuarioActual(session);
      loadData(session);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const handleLogin = async (email, password) => {
    const session = await dataService.login(email, password);
    if (session) {
      setUsuarioActual(session);
      await loadData(session);
      showToast(`¡Bienvenido, ${session.nombre}!`);
      return true;
    }
    return false;
  };

  // Logout handler
  const handleLogout = () => {
    dataService.logout();
    setUsuarioActual(null);
  };

  // Handlers de Documentos
  const handleUploadSuccess = async (docData) => {
    await dataService.uploadDocumento(docData);
    await loadData();
    showToast(docData.tipo === 'requisito_cliente' 
      ? 'Documento cargado correctamente para revisión.' 
      : 'Documento final montado en la cuenta del cliente.');
  };

  const handleUpdateDocEstado = async (docId, nuevoEstado, observaciones) => {
    await dataService.updateDocumentoEstado(docId, nuevoEstado, observaciones);
    await loadData();
    showToast(`Estado de documento actualizado a: ${nuevoEstado}`);
  };

  // Habilitar cliente nuevo
  const handleHabilitarCliente = async (datos) => {
    await dataService.habilitarCliente(datos);
    await loadData();
    showToast(`Cuenta habilitada con éxito para ${datos.empresa.razonSocial}. Correo de acceso: ${datos.usuario.email}`);
  };

  // Si no ha iniciado sesión, mostrar PANTALLA DE LOGIN
  if (!usuarioActual) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Filtrar datos según el usuario logueado
  const isCliente = usuarioActual.rol === 'cliente';
  const expedientesParaMostrar = isCliente
    ? expedientes.filter(e => e.organizacionId === usuarioActual.empresaId)
    : expedientes;

  const clienteEmpresa = isCliente
    ? empresas.find(e => e.id === usuarioActual.empresaId) || { razonSocial: usuarioActual.nombre, nit: '' }
    : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Barra de Navegación con Usuario Actual y Cerrar Sesión */}
      <Navbar 
        usuarioActual={usuarioActual}
        onLogout={handleLogout}
        isLive={dataService.isLive}
      />

      {/* Contenido Principal */}
      <main className="app-container" style={{ flex: 1, paddingBottom: '3rem' }}>
        
        {isLoading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Cargando expedientes...
          </div>
        ) : isCliente ? (
          /* PANTALLA PERSONAL DEL CLIENTE: Solo ve su cuenta, sus requisitos por subir y sus documentos finales */
          <ClientDashboard 
            empresa={clienteEmpresa}
            expedientes={expedientesParaMostrar}
            documentos={documentos}
            onOpenUploadModal={setUploadModalConfig}
            selectedExpedienteId={selectedExpedienteId}
            onSelectExpediente={setSelectedExpedienteId}
          />
        ) : (
          /* PANTALLA DEL ADMINISTRADOR YABAGROUP: Habilita clientes, revisa lo que subieron y les monta los documentos */
          <AdminDashboard 
            expedientes={expedientes}
            empresas={empresas}
            documentos={documentos}
            onOpenHabilitarClienteModal={() => setShowHabilitarModal(true)}
            onOpenUploadModal={setUploadModalConfig}
            onOpenReviewModal={setReviewModalExpediente}
            onUpdateEstado={(id, est, av) => dataService.updateExpedienteEstado(id, est, av).then(loadData)}
          />
        )}

      </main>

      {/* Modales */}
      <UploadModal 
        isOpen={Boolean(uploadModalConfig)}
        onClose={() => setUploadModalConfig(null)}
        config={uploadModalConfig}
        onUploadSuccess={handleUploadSuccess}
      />

      <ReviewModal 
        isOpen={Boolean(reviewModalExpediente)}
        onClose={() => setReviewModalExpediente(null)}
        expediente={reviewModalExpediente}
        documentos={documentos}
        onUpdateDocEstado={handleUpdateDocEstado}
      />

      <HabilitarClienteModal 
        isOpen={showHabilitarModal}
        onClose={() => setShowHabilitarModal(false)}
        onHabilitarCliente={handleHabilitarCliente}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.875rem',
          zIndex: 2000
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
