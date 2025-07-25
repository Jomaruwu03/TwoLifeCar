import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { X, Send, Archive, LogOut, User, Mail, Calendar, MessageSquare, Car, Lock, Eye, EyeOff, Shield, Bell, Search, Filter, MoreVertical, TrendingUp, Clock, CheckCircle, Users, Plus, Settings, Home, FileText, BarChart3, Building, Menu } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔍 Dashboard API URL:", API_URL);

// --------- COMPONENTES MODAL ---------

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-blue-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white rounded-t-2xl relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600 leading-relaxed text-center">{message}</p>
        <div className="flex justify-center space-x-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`px-6 py-2.5 text-white rounded-lg transition-all duration-200 ${
              danger 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function ReplyModal({ isOpen, onClose, leadEmail, leadName }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/leads/reply`, {
        email: leadEmail,
        subject,
        message,
      });

      alert(response.data.message);
      onClose();
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error enviando respuesta:", error);
      alert("Error al enviar la respuesta. Inténtalo de nuevo.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Responder a ${leadName}`}>
      <form onSubmit={handleSend} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Para:</label>
          <input 
            disabled 
            value={leadEmail} 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Asunto:</label>
          <input 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Asunto del email" 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mensaje:</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            rows={6} 
            placeholder="Escribe tu respuesta..." 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none outline-none"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            onClick={onClose} 
            type="button" 
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-all duration-200"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Send size={16} />
            <span>Enviar</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Login() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 relative overflow-hidden">
      
      {/* Elementos decorativos del fondo */}
      <div className="absolute inset-0">
        {/* Círculos decorativos */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Patrones geométricos */}
        <div className="absolute top-10 right-10 opacity-10">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-blue-400 rounded-sm animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
        
        {/* Iconos flotantes */}
        <div className="absolute top-32 right-32 animate-bounce opacity-20" style={{ animationDuration: '3s' }}>
          <Car className="w-8 h-8 text-blue-500" />
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce opacity-30" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Shield className="w-6 h-6 text-indigo-500" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                  <Car className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Two<span className="text-blue-600">Life</span>Car
            </h1>
            <p className="text-gray-600 text-lg mb-6">Panel de Administración</p>
            
            {/* Badges */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Certificado</span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bienvenido de vuelta</h2>
              <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Campo Usuario */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Ingresa tu usuario"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Ingresa tu contraseña"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Opciones */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-600 text-sm">Recordarme</span>
                </label>
                
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                disabled={loading || !user.username || !user.password}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  loading || !user.username || !user.password
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5 transform rotate-180" />
                    <span>Iniciar Sesión</span>
                  </>
                )}
              </button>

              {/* Credenciales demo */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium text-center text-sm mb-3">Credenciales de Prueba</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <p className="text-blue-600 font-medium">Usuario:</p>
                    <p className="text-gray-800 font-mono">admin</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-600 font-medium">Contraseña:</p>
                    <p className="text-gray-800 font-mono">123456</p>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm mb-4">
              Sistema profesional de gestión de leads
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Car className="w-3 h-3" />
                <span>© 2025 TwoLifeCar</span>
              </div>
              <span>•</span>
              <span>Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------- DASHBOARD ESTILO GEEKSFORGEEKS ---------

function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState({ isOpen: false, lead: null });
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, leadId: null });
  const [logoutModal, setLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
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
    axios.delete(`${API_URL}/leads/${id}`)
      .then(() => {
        alert("Lead archivado correctamente");
        getLeads();
        setArchiveModal({ isOpen: false, leadId: null });
      })
      .catch(() => alert("Error al archivar el lead"));
  };

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: true },
    { id: 'leads', icon: Users, label: 'Leads' },
    { id: 'reports', icon: BarChart3, label: 'Reportes' },
    { id: 'institution', icon: Building, label: 'Institución' },
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 mx-auto"></div>
        </div>
        <p className="text-gray-700 text-lg font-medium">Cargando dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">TwoLifeCar</h1>
                </div>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'text-gray-500'}`} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header superior */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
              <p className="text-gray-600">Resumen general del sistema</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none w-64"
                />
              </div>
              
              {/* Notificaciones */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</div>
              </button>
              
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido scrolleable */}
        <main className="flex-1 overflow-y-auto p-6">
          
          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* Card 1 */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{leads.length}</p>
                    <p className="text-purple-200 text-sm">Total Views</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">150</p>
                    <p className="text-blue-200 text-sm">Likes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">320</p>
                    <p className="text-indigo-200 text-sm">Comments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">70</p>
                    <p className="text-green-200 text-sm">Published</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de leads */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Header de la tabla */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Recent Leads</h3>
                <p className="text-gray-600 text-sm">Gestiona las consultas recientes</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                View All
              </button>
            </div>

            {/* Filtros */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none w-64"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="new">Nuevos</option>
                    <option value="replied">Respondidos</option>
                  </select>
                  
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all text-sm">
                    <Plus size={16} />
                    <span>Nuevo Lead</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido de la tabla */}
            <div className="overflow-x-auto">
              {filteredLeads.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comments</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map((lead, index) => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{lead.name}</p>
                              <p className="text-gray-500 text-xs">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-800">
                            {(Math.random() * 3 + 1).toFixed(1)}k
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-800">
                            {Math.floor(Math.random() * 500 + 100)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setReplyModal({ isOpen: true, lead })}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Responder
                            </button>
                            <button 
                              onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Archivar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay leads disponibles'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? `No encontramos leads que coincidan con "${searchTerm}".`
                      : 'Los nuevos leads aparecerán aquí automáticamente.'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                    <button 
                      onClick={getLeads}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2"
                    >
                      <Search size={16} />
                      <span>Actualizar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer del admin panel */}
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">ADMIN PANEL</h2>
            <p className="text-purple-200">Sistema de gestión profesional para TwoLifeCar</p>
          </div>
        </main>
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
        message="¿Estás seguro de que deseas archivar este lead? Esta acción no se puede deshacer." 
        confirmText="Archivar"
        danger 
      />

      <ConfirmationModal 
        isOpen={logoutModal} 
        onClose={() => setLogoutModal(false)} 
        onConfirm={handleLogout} 
        title="Cerrar Sesión" 
        message="¿Estás seguro de que deseas cerrar sesión?" 
        confirmText="Cerrar Sesión"
        danger 
      />
    </div>
  );
}

// --------- PROTECCIÓN DE RUTAS ---------

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

// --------- APP ---------

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
  );
}

export default App;