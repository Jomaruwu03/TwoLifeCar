import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { X, Send, Archive, LogOut, User, Mail, Calendar, MessageSquare, Car, Lock, Eye, EyeOff, Shield, Bell, Search, Filter, MoreVertical, TrendingUp, Clock, CheckCircle, Users, Plus, Settings } from "lucide-react";

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

// --------- DASHBOARD ---------

function Dashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState({ isOpen: false, lead: null });
  const [archiveModal, setArchiveModal] = useState({ isOpen: false, leadId: null });
  const [logoutModal, setLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-600 mx-auto"></div>
        </div>
        <p className="text-gray-700 text-lg font-medium">Cargando dashboard...</p>
        <p className="text-gray-500 text-sm mt-2">Preparando tu espacio de trabajo</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50">
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Two<span className="text-blue-600">Life</span>Car
                </h1>
                <p className="text-gray-500 text-sm">Panel de Administración</p>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">3</div>
              </button>
              <button className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                <Settings size={20} />
              </button>
              
              <div className="w-px h-8 bg-gray-300"></div>
              
              <button 
                onClick={() => setLogoutModal(true)} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">¡Bienvenido de vuelta!</h2>
                <p className="text-blue-100 text-lg">Gestiona tus leads de manera eficiente</p>
              </div>
              <div className="mt-4 lg:mt-0 text-right">
                <p className="text-blue-200 text-sm">Último acceso</p>
                <p className="text-white font-medium">Hoy, {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Total Leads</p>
                    <p className="text-2xl font-bold text-white">{leads.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Nuevos Hoy</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Respondidos</p>
                    <p className="text-2xl font-bold text-white">24</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Conversiones</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="replied">Respondidos</option>
                <option value="archived">Archivados</option>
              </select>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg">
                <Plus size={16} />
                <span className="hidden sm:inline">Nuevo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Leads */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  Leads Recientes
                  <span className="ml-3 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {filteredLeads.length} total
                  </span>
                </h3>
                <p className="text-gray-600">Gestiona las consultas de tus clientes</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="bg-white border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all text-gray-700 shadow-sm hover:shadow-md">
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md hover:shadow-lg">
                  <Archive size={16} />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredLeads.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contacto</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Mensaje</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead._id} className="hover:bg-blue-50/50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                              <span className="text-white font-medium text-sm">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{lead.name}</p>
                            <p className="text-gray-500 text-sm">Lead #{(index + 1).toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 text-sm">{lead.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 text-sm">Cliente potencial</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-gray-700 text-sm line-clamp-2" title={lead.message}>
                            {lead.message}
                          </p>
                          {lead.message.length > 80 && (
                            <button className="text-blue-500 text-sm hover:underline mt-1">
                              Ver más
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">
                              {new Date(lead.createdAt).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          Nuevo
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setReplyModal({ isOpen: true, lead })} 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all flex items-center space-x-1 shadow-md hover:shadow-lg"
                          >
                            <Send size={14} />
                            <span className="hidden lg:inline">Responder</span>
                          </button>
                          <button 
                            onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })} 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm transition-all flex items-center space-x-1 shadow-md hover:shadow-lg"
                          >
                            <Archive size={14} />
                            <span className="hidden lg:inline">Archivar</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="bg-blue-100 p-6 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay leads disponibles'}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? `No encontramos leads que coincidan con "${searchTerm}".`
                    : 'Los nuevos leads aparecerán aquí automáticamente.'
                  }
                </p>
                <div className="flex items-center justify-center space-x-3">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                  <button 
                    onClick={getLeads}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <Search size={16} />
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group cursor-pointer">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Envío Masivo</h4>
                  <p className="text-gray-500 text-sm">Responder múltiples leads</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Envía respuestas personalizadas a varios clientes al mismo tiempo.
              </p>
              <div className="flex items-center text-blue-500 font-medium text-sm group-hover:text-blue-600">
                <span>Comenzar</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:border-green-300 transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors">Programar Citas</h4>
                  <p className="text-gray-500 text-sm">Gestionar calendario</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Organiza reuniones y citas con tus clientes de forma eficiente.
              </p>
              <div className="flex items-center text-green-500 font-medium text-sm group-hover:text-green-600">
                <span>Abrir calendario</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:border-purple-300 transition-all duration-300 group-hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">Reportes</h4>
                  <p className="text-gray-500 text-sm">Análisis y estadísticas</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Visualiza métricas detalladas y tendencias de tus leads.
              </p>
              <div className="flex items-center text-purple-500 font-medium text-sm group-hover:text-purple-600">
                <span>Ver reportes</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-500" />
              <span>© 2025 TwoLifeCar</span>
            </div>
            <span>•</span>
            <span>Panel de Administración</span>
            <span>•</span>
            <span className="text-green-600 font-medium">Sistema Activo</span>
          </div>
          <p className="text-gray-400 text-xs">
            Plataforma profesional de gestión de leads para concesionarias
          </p>
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