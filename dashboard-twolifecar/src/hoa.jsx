import { useState, useEffect, useCallback } from "react";
import { X, Send, Archive, LogOut, User, Mail, Calendar, MessageSquare, Car, Lock, Eye, EyeOff, Shield } from "lucide-react";

// Simulación de navegación y localStorage
const useNavigate = () => ({
  navigate: (path) => console.log(`Navigating to: ${path}`)
});

const localStorage = {
  getItem: (key) => null,
  setItem: (key, value) => console.log(`Setting ${key}: ${value}`),
  removeItem: (key) => console.log(`Removing ${key}`)
};

const API_URL = "http://localhost:5000/api";

// --------- COMPONENTES MODAL ---------

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">{cancelText}</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}>{confirmText}</button>
        </div>
      </div>
    </Modal>
  );
}

function ReplyModal({ isOpen, onClose, leadEmail, leadName }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Completa todos los campos");
      return;
    }
    alert(`Email enviado a ${leadEmail}`);
    onClose();
    setSubject("");
    setMessage("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Responder a ${leadName}`}>
      <div className="space-y-4">
        <input disabled value={leadEmail} className="w-full px-3 py-2 border rounded bg-gray-50" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Asunto" className="w-full px-3 py-2 border rounded" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Mensaje" className="w-full px-3 py-2 border rounded"></textarea>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} type="button" className="px-4 py-2 border rounded text-gray-600">Cancelar</button>
          <button onClick={handleSend} className="px-4 py-2 bg-green-500 text-white rounded">Enviar</button>
        </div>
      </div>
    </Modal>
  );
}

// --------- LOGIN MEJORADO ---------

function Login() {
  const { navigate } = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
   try {
         const response = await axios.post(`${API_URL}/login`, {
           username: user.username,
           password: user.password
         });
         
         localStorage.setItem("token", response.data.token);
         navigate("/dashboard");
       } catch (error) {
         console.error("Error de login:", error);
         alert("Credenciales incorrectas");
       } finally {
         setLoading(false);
       }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden flex items-center justify-center p-4">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-32 left-40 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-white rounded-full"></div>
        
        {/* Car silhouettes */}
        <div className="absolute top-10 right-10 opacity-20">
          <Car className="w-16 h-16 text-white transform rotate-12" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-20">
          <Car className="w-12 h-12 text-white transform -rotate-12" />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full shadow-2xl">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Two<span className="text-orange-500">Life</span>Car
          </h1>
          
          <p className="text-blue-200 text-lg">
            Panel de Administración
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-300">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Acceso Seguro</span>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="space-y-6">
            
            {/* Username Field */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  placeholder="Ingresa tu usuario"
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  autoComplete="username"
                  required
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  autoComplete="current-password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                />
                <span className="text-gray-700 text-sm">Recordarme</span>
              </label>
              
              <button
                type="button"
                className="text-sm text-orange-600 hover:text-orange-800 underline font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !user.username || !user.password}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                loading || !user.username || !user.password
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 transform rotate-180" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">Credenciales de Prueba</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-semibold">Usuario:</span> admin</p>
                  <p><span className="font-semibold">Contraseña:</span> 123456</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Sistema de gestión de leads para concesionarias
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-blue-300">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="w-3 h-3" />
              <span>Especializado</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Profesional</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-blue-200 text-xs">
        <div className="flex items-center justify-center gap-2">
          <Car className="w-3 h-3" />
          <span>© 2025 TwoLifeCar. Panel de Administración</span>
        </div>
      </footer>
    </div>
  );
}

// --------- DASHBOARD ---------

function Dashboard() {
   const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState({ isOpen: false, lead: null });
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, leadId: null });
  const [logoutModal, setLogoutModal] = useState(false);
  const token = localStorage.getItem("token");

  const getLeads = useCallback(() => {
    setLoading(true);
    axios.get(`${API_URL}/leads`, { headers: { Authorization: token } })
      .then((res) => { setLeads(res.data); setLoading(false); })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getLeads();
    }
  }, [token, navigate, getLeads]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  

  const handleDelete = (id) => {
    setLeads(leads.filter(lead => lead._id !== id));
    alert("Lead archivado");
    setArchiveModal({ isOpen: false, leadId: null });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Cargando leads...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-full">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Dashboard TwoLifeCar</h2>
                <p className="text-gray-600">Gestión de leads y consultas</p>
              </div>
            </div>
            <button 
              onClick={() => setLogoutModal(true)} 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-gray-800">{leads.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Nuevos Hoy</p>
                <p className="text-3xl font-bold text-gray-800">2</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Respondidos</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Leads Recientes</h3>
            <p className="text-gray-600 text-sm">Gestiona las consultas de tus clientes</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Consulta</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-800">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800 max-w-xs truncate">{lead.message}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setReplyModal({ isOpen: true, lead })} 
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                        >
                          <Send size={14} />
                          <span>Responder</span>
                        </button>
                        <button 
                          onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })} 
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                        >
                          <Archive size={14} />
                          <span>Archivar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {!leads.length && (
              <div className="text-center py-12">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No hay leads disponibles</p>
                <p className="text-gray-400 text-sm">Los nuevos leads aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReplyModal 
        isOpen={replyModal.isOpen} 
        onClose={() => setReplyModal({ isOpen: false, lead: null })} 
        leadEmail={replyModal.lead?.email || ""} 
        leadName={replyModal.lead?.name || ""} 
      />

      <ConfirmationModal 
        isOpen={archiveModal.isOpen} 
        onClose={() => setArchiveModal({ isOpen: false, leadId: null })} 
        onConfirm={() => handleDelete(archiveModal.leadId)} 
        title="Confirmar Archivo" 
        message="¿Estás seguro de que deseas archivar este lead?" 
        danger 
      />

      <ConfirmationModal 
        isOpen={logoutModal} 
        onClose={() => setLogoutModal(false)} 
        onConfirm={handleLogout} 
        title="Cerrar Sesión" 
        message="¿Estás seguro de que deseas cerrar sesión?" 
        danger 
      />
    </div>
  );
}

// --------- APP PRINCIPAL ---------

function App() {
  const [currentView, setCurrentView] = useState("login");

  // Simulación simple de rutas
  const navigate = (path) => {
    if (path === "/dashboard") {
      setCurrentView("dashboard");
    } else {
      setCurrentView("login");
    }
  };

  // Sobrescribir la función de navegación
  window.navigate = navigate;

  return (
    <div>
      {currentView === "login" ? <Login /> : <Dashboard />}
    </div>
  );
}

export default App;