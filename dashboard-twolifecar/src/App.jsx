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
            
            {/* Card 1 - Total Leads */}
            <div className="group bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      <p className="text-4xl font-black group-hover:text-5xl transition-all duration-300">{leads.length}</p>
                      <span className="text-purple-200 text-sm">+12%</span>
                    </div>
                    <p className="text-purple-200 text-sm font-medium">Total Leads</p>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-white/60 to-white/80 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Indicador de cambio */}
              <div className="absolute bottom-4 left-6 flex items-center space-x-2 opacity-80">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-300 font-medium">↑ 8% desde ayer</span>
              </div>
            </div>

            {/* Card 2 - Conversiones */}
            <div className="group bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 rounded-3xl p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      <p className="text-4xl font-black group-hover:text-5xl transition-all duration-300">87</p>
                      <span className="text-blue-200 text-sm">+5%</span>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">Conversiones</p>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-white/60 to-white/80 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Indicador de cambio */}
              <div className="absolute bottom-4 left-6 flex items-center space-x-2 opacity-80">
                <CheckCircle className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-300 font-medium">↑ 15% esta semana</span>
              </div>
            </div>

            {/* Card 3 - Respuestas Pendientes */}
            <div className="group bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      <p className="text-4xl font-black group-hover:text-5xl transition-all duration-300">23</p>
                      <span className="text-orange-200 text-sm">!</span>
                    </div>
                    <p className="text-indigo-200 text-sm font-medium">Pendientes</p>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Indicador de cambio */}
              <div className="absolute bottom-4 left-6 flex items-center space-x-2 opacity-80">
                <Clock className="w-4 h-4 text-orange-300" />
                <span className="text-xs text-orange-300 font-medium">Requiere atención</span>
              </div>
            </div>

            {/* Card 4 - Tasa de Éxito */}
            <div className="group bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl p-6 text-white relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
              {/* Elementos decorativos de fondo */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/5 to-transparent rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline space-x-1">
                      <p className="text-4xl font-black group-hover:text-5xl transition-all duration-300">94</p>
                      <span className="text-green-200 text-lg">%</span>
                    </div>
                    <p className="text-green-200 text-sm font-medium">Tasa de Éxito</p>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-11/12 bg-gradient-to-r from-white/60 to-white/80 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Indicador de cambio */}
              <div className="absolute bottom-4 left-6 flex items-center space-x-2 opacity-80">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-300 font-medium">Excelente rendimiento</span>
              </div>
            </div>
          </div>

          {/* Sección de actividad reciente */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Gráfico de actividad */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Actividad de Leads</h3>
                  <p className="text-gray-600 text-sm">Últimos 7 días</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Leads recibidos</span>
                </div>
              </div>
              
              {/* Gráfico simulado */}
              <div className="h-48 flex items-end justify-between space-x-2">
                {[12, 19, 15, 22, 18, 25, 20].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer" 
                       style={{ height: `${height * 2}%` }}>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
              </div>
            </div>

            {/* Panel de notificaciones */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Notificaciones</h3>
                <div className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Nuevo lead recibido</p>
                    <p className="text-xs text-gray-300">Hace 5 minutos</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Lead pendiente de respuesta</p>
                    <p className="text-xs text-gray-300">Hace 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Reporte semanal listo</p>
                    <p className="text-xs text-gray-300">Hace 1 día</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-sm font-medium transition-all">
                Ver todas
              </button>
            </div>
          </div>

          {/* Tabla de leads mejorada */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* Header de la tabla con gradiente */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Gestión de Leads</h3>
                  <p className="text-gray-300">Administra y responde a las consultas de clientes</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm">En tiempo real</span>
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <Plus className="w-4 h-4 inline mr-2" />
                    Nuevo Lead
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros mejorados */}
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                
                {/* Buscador mejorado */}
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-6 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none w-80 bg-white shadow-sm"
                    />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Contador de resultados */}
                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{filteredLeads.length} leads</span>
                  </div>
                </div>
                
                {/* Filtros y acciones */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none bg-white text-sm shadow-sm"
                    >
                      <option value="all">📋 Todos los estados</option>
                      <option value="new">🆕 Nuevos</option>
                      <option value="replied">✅ Respondidos</option>
                      <option value="pending">⏳ Pendientes</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={getLeads}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Search size={16} />
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contenido de la tabla */}
            <div className="overflow-x-auto">
              {filteredLeads.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Lead</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Prioridad</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Fecha</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Estado</span>
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Acciones</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group">
                        
                        {/* Información del lead */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                                <span className="text-white font-bold text-lg">
                                  {lead.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {/* Indicator online */}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{lead.name}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <p className="text-gray-600 text-sm">{lead.email}</p>
                              </div>
                              {/* Información adicional */}
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Car className="w-3 h-3 text-blue-500" />
                                  <span className="text-xs text-gray-500">Interesado en SUV</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Prioridad */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              Math.random() > 0.5 ? 'bg-red-500 animate-pulse' : 
                              Math.random() > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}></div>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                              Math.random() > 0.5 ? 'bg-red-100 text-red-700' : 
                              Math.random() > 0.3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {Math.random() > 0.5 ? 'Alta' : Math.random() > 0.3 ? 'Media' : 'Baja'}
                            </span>
                          </div>
                        </td>
                        
                        {/* Fecha */}
                        <td className="px-6 py-6">
                          <div className="text-sm text-gray-900 font-medium">Hace 2 días</div>
                          <div className="text-xs text-gray-500">14:30 PM</div>
                        </td>
                        
                        {/* Estado */}
                        <td className="px-6 py-6">
                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            Activo
                          </span>
                        </td>
                        
                        {/* Acciones */}
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => setReplyModal({ isOpen: true, lead })}
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
                            >
                              <Send className="w-4 h-4" />
                              <span>Responder</span>
                            </button>
                            
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 px-8">
                  <div className="relative mb-8">
                    {/* Animación de fondo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Icono principal */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Iconos flotantes */}
                    <div className="absolute top-0 left-1/4 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute bottom-0 right-1/4 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {searchTerm ? '🔍 No se encontraron resultados' : '📭 No hay leads disponibles'}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {searchTerm 
                      ? `No encontramos leads que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                      : 'Los nuevos leads aparecerán aquí automáticamente. Mientras tanto, puedes revisar la configuración del sistema.'
                    }
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4">
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Limpiar búsqueda</span>
                      </button>
                    )}
                    <button 
                      onClick={getLeads}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                    >
                      <Search size={16} />
                      <span>Actualizar datos</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer del admin panel mejorado */}
          <div className="mt-12 relative">
            {/* Fondo con efectos */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 rounded-3xl"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-6 left-6 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            
            {/* Contenido principal */}
            <div className="relative z-10 p-12 text-center text-white">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-3xl blur-lg"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20">
                    <Car className="w-16 h-16 text-white mx-auto" />
                  </div>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  ADMIN PANEL
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Sistema de gestión profesional para TwoLifeCar
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-blue-200" />
                    <span className="text-2xl font-bold">{leads.length}</span>
                  </div>
                  <p className="text-blue-200 text-sm">Leads Totales</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-green-200" />
                    <span className="text-2xl font-bold">94%</span>
                  </div>
                  <p className="text-blue-200 text-sm">Tasa de Conversión</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <Clock className="w-6 h-6 text-yellow-200" />
                    <span className="text-2xl font-bold">2.3</span>
                  </div>
                  <p className="text-blue-200 text-sm">Tiempo Respuesta (hrs)</p>
                </div>
              </div>
              
              {/* Acciones rápidas */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-medium transition-all hover:scale-105 border border-white/30 flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5" />
                  <span>Ver Reportes</span>
                </button>
                
                <button className="bg-white hover:bg-gray-100 text-purple-700 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </button>
              </div>
              
              {/* Información adicional */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-blue-200">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Sistema operativo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Conexión segura</span>
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-right">
                    <p>© 2025 TwoLifeCar • Todos los derechos reservados</p>
                    <p className="text-xs mt-1">Versión 2.1.0 • Dashboard Profesional</p>
                  </div>
                </div>
              </div>
            </div>
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