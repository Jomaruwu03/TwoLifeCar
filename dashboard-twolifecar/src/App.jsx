import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { X, Send, Archive, LogOut, User, Mail, Calendar, MessageSquare, Car, Lock, Eye, EyeOff, Shield, Bell, Search, Filter, MoreVertical, TrendingUp, Clock, CheckCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔍 Dashboard API URL:", API_URL);

// --------- COMPONENTES MODAL ---------

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 text-white rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-xl font-bold">{title}</h2>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
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
        <p className="text-gray-700 leading-relaxed text-center">{message}</p>
        <div className="flex justify-center space-x-3">
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
              danger 
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
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
          <label className="block text-gray-700 font-semibold mb-2">Para:</label>
          <input 
            disabled 
            value={leadEmail} 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Asunto:</label>
          <input 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Asunto del email" 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none" 
          />
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Mensaje:</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            rows={6} 
            placeholder="Escribe tu respuesta..." 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none outline-none"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            onClick={onClose} 
            type="button" 
            className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
  const [focusedField, setFocusedField] = useState(null);

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
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Fondo animado ultra moderno */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Capa de ruido/textura */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Efectos de luz dinámicos */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-orange-500/30 via-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Elementos geométricos flotantes */}
        <div className="absolute top-20 right-20 opacity-10 animate-float">
          <div className="relative">
            <div className="w-32 h-32 border border-white/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 w-24 h-24 border border-white/20 rounded-full animate-spin-reverse"></div>
            <div className="absolute inset-8 w-16 h-16 border border-white/10 rounded-full animate-spin-slow"></div>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-20 opacity-20 animate-bounce-slow">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-2xl rotate-45 backdrop-blur-sm"></div>
        </div>
        
        {/* Iconos de autos flotantes */}
        <div className="absolute top-16 right-16 animate-float-delayed opacity-30">
          <Car className="w-12 h-12 text-orange-400 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-32 left-16 animate-float opacity-20">
          <Car className="w-8 h-8 text-blue-400 transform -rotate-12 drop-shadow-lg" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-md">
          
          {/* Header de marca mejorado */}
          <div className="text-center mb-12">
            {/* Logo con efectos avanzados */}
            <div className="flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full blur-2xl opacity-60 animate-pulse scale-150"></div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                  <Car className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            {/* Título con efectos de texto */}
            <div className="relative mb-6">
              <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight relative">
                <span className="relative">
                  Two
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Two</span>
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Life</span>Car
              </h1>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-60"></div>
            </div>
            
            <p className="text-xl text-slate-300 mb-8 font-light leading-relaxed">
              Panel de Administración Avanzado
            </p>
            
            {/* Badges de estado */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="group flex items-center gap-2 bg-emerald-400/20 backdrop-blur-sm border border-emerald-400/30 px-4 py-2 rounded-full hover:bg-emerald-400/30 transition-all duration-300">
                <div className="relative">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <div className="absolute inset-0 animate-ping">
                    <Shield className="w-4 h-4 text-emerald-400 opacity-75" />
                  </div>
                </div>
                <span className="text-emerald-300 font-semibold text-sm">Acceso Seguro</span>
              </div>
              <div className="group flex items-center gap-2 bg-blue-400/20 backdrop-blur-sm border border-blue-400/30 px-4 py-2 rounded-full hover:bg-blue-400/30 transition-all duration-300">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 font-semibold text-sm">Certificado SSL</span>
              </div>
            </div>
          </div>

          {/* Formulario de login rediseñado */}
          <div className="relative group">
            {/* Formulario de login rediseñado con estilo limpio */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200"></div>
            
            <div className="relative p-8 md:p-10">
              {/* Header del formulario */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                  Bienvenido de vuelta
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Ingresa tus credenciales para acceder al sistema
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Campo de usuario estilo moderno */}
                <div className="relative group">
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      className="peer w-full px-4 py-4 pl-12 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-all duration-300 text-gray-800 outline-none text-base font-medium placeholder-transparent hover:border-gray-300 shadow-sm"
                      autoComplete="username"
                      required
                    />
                    
                    {/* Label flotante */}
                    <label
                      htmlFor="username"
                      className="absolute left-12 top-4 text-gray-500 text-base transition-all duration-300 pointer-events-none 
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                      peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-orange-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-semibold
                      peer-valid:-top-2 peer-valid:left-3 peer-valid:text-sm peer-valid:text-orange-600 peer-valid:bg-white peer-valid:px-2 peer-valid:font-semibold"
                    >
                      Nombre de usuario
                    </label>
                    
                    {/* Icono */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <User className={`w-5 h-5 transition-all duration-300 ${
                        focusedField === 'username' || user.username ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Campo de contraseña estilo moderno */}
                <div className="relative group">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={user.password}
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      className="peer w-full px-4 py-4 pl-12 pr-12 bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-all duration-300 text-gray-800 outline-none text-base font-medium placeholder-transparent hover:border-gray-300 shadow-sm"
                      autoComplete="current-password"
                      required
                    />
                    
                    {/* Label flotante */}
                    <label
                      htmlFor="password"
                      className="absolute left-12 top-4 text-gray-500 text-base transition-all duration-300 pointer-events-none 
                      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                      peer-focus:-top-2 peer-focus:left-3 peer-focus:text-sm peer-focus:text-orange-600 peer-focus:bg-white peer-focus:px-2 peer-focus:font-semibold
                      peer-valid:-top-2 peer-valid:left-3 peer-valid:text-sm peer-valid:text-orange-600 peer-valid:bg-white peer-valid:px-2 peer-valid:font-semibold"
                    >
                      Contraseña
                    </label>
                    
                    {/* Icono de candado */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Lock className={`w-5 h-5 transition-all duration-300 ${
                        focusedField === 'password' || user.password ? 'text-orange-500' : 'text-gray-400'
                      }`} />
                    </div>
                    
                    {/* Botón mostrar/ocultar contraseña */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 p-1 rounded-full hover:bg-gray-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Recordarme y olvidar contraseña - estilo limpio */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                      />
                    </div>
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors font-medium">
                      Recordar mis datos
                    </span>
                  </label>
                  
                  <button
                    type="button"
                    className="text-orange-500 hover:text-orange-600 font-medium transition-all duration-300 hover:underline decoration-2 underline-offset-4"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón de login estilo limpio */}
                <button
                  type="submit"
                  disabled={loading || !user.username || !user.password}
                  className={`relative w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    loading || !user.username || !user.password
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:transform active:scale-95'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
                        <span>Iniciando sesión...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-5 h-5 transform rotate-180" />
                        <span>Iniciar Sesión</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Credenciales demo en estilo limpio */}
                <div className="relative mt-8">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
                    <div className="text-center mb-4">
                      <p className="text-gray-800 font-bold text-lg mb-2">Credenciales de Prueba</p>
                      <p className="text-gray-600 text-sm">Para acceso de demostración</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all duration-300">
                        <p className="text-orange-600 font-semibold text-sm mb-1">Usuario:</p>
                        <p className="text-gray-800 font-mono text-lg">admin</p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all duration-300">
                        <p className="text-orange-600 font-semibold text-sm mb-1">Contraseña:</p>
                        <p className="text-gray-800 font-mono text-lg">123456</p>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Footer informativo */}
          <div className="text-center mt-10">
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              Sistema profesional de gestión de leads para concesionarias automotrices
            </p>
            
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <Shield className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 font-medium">Totalmente Seguro</span>
              </div>
              <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <Car className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 font-medium">Especializado</span>
              </div>
              <div className="group flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300">
                <User className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-slate-300 font-medium">Multi-usuario</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright mejorado */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
            <Car className="w-4 h-4 text-orange-400" />
            <span className="font-medium">© 2025 TwoLifeCar</span>
          </div>
          <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
          <span className="font-medium">Panel de Administración Profesional</span>
        </div>
      </div>

      {/* Estilos CSS adicionales para animaciones */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 6s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}

// --------- DASHBOARD ULTRA MEJORADO ---------

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
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 mx-auto"></div>
          <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-orange-500 mx-auto"></div>
        </div>
        <p className="text-gray-700 text-xl font-semibold">Cargando dashboard...</p>
        <p className="text-gray-500 text-sm mt-2">Preparando tu espacio de trabajo</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Header Moderno */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo y branding */}
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-md opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform">
                  <Car className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800">
                  Two<span className="text-orange-500">Life</span>Car
                </h1>
                <p className="text-gray-600 font-medium text-sm">Panel de Administración</p>
              </div>
            </div>
            
            {/* Acciones del header */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <button className="relative p-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all duration-200 group">
                  <Bell size={20} />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">3</div>
                </button>
                <button className="p-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200">
                  <Settings size={20} />
                </button>
              </div>
              
              <div className="w-px h-8 bg-gray-300"></div>
              
              <button 
                onClick={() => setLogoutModal(true)} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Hero Section con estadísticas */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black mb-3">¡Bienvenido de vuelta!</h2>
                <p className="text-white/90 text-lg">Aquí tienes un resumen de tu actividad hoy</p>
              </div>
              <div className="mt-4 lg:mt-0">
                <div className="text-right">
                  <p className="text-white/80 text-sm">Último acceso</p>
                  <p className="text-white font-semibold">Hoy, {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            
            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Total Leads</p>
                    <p className="text-2xl font-bold text-white">{leads.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Nuevos Hoy</p>
                    <p className="text-2xl font-bold text-white">8</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Respondidos</p>
                    <p className="text-2xl font-bold text-white">24</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">Conversiones</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar leads por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-all duration-300 text-gray-800 outline-none font-medium"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-0 transition-all duration-300 text-gray-800 outline-none font-medium bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="new">Nuevos</option>
                <option value="replied">Respondidos</option>
                <option value="archived">Archivados</option>
              </select>
              
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                <Plus size={16} />
                <span className="hidden sm:inline">Nuevo Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Leads Modernizada */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Header de la tabla */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  Leads Recientes
                  <span className="ml-3 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                    {filteredLeads.length} total
                  </span>
                </h3>
                <p className="text-gray-600">Gestiona las consultas de tus clientes de manera eficiente</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="bg-white border-2 border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 text-gray-700 hover:text-gray-900 font-medium shadow-sm hover:shadow-md">
                  <Filter size={16} />
                  <span>Filtros</span>
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                  <Archive size={16} />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabla responsiva */}
          <div className="overflow-x-auto">
            {filteredLeads.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Contacto</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Consulta</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-all duration-200 group">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {lead.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{lead.name}</p>
                            <p className="text-gray-500 text-sm">Lead #{(index + 1).toString().padStart(3, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 font-medium text-sm">{lead.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500 text-sm">Cliente potencial</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="max-w-xs">
                          <p className="text-gray-800 font-medium text-sm line-clamp-3 leading-relaxed" title={lead.message}>
                            {lead.message}
                          </p>
                          {lead.message.length > 100 && (
                            <button className="text-orange-500 text-sm font-medium hover:underline mt-1">
                              Ver más
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-sm">
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
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          Nuevo
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setReplyModal({ isOpen: true, lead })} 
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <Send size={14} />
                            <span className="hidden lg:inline">Responder</span>
                          </button>
                          <button 
                            onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })} 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm transition-all duration-300 flex items-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          >
                            <Archive size={14} />
                            <span className="hidden lg:inline">Archivar</span>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20">
                <div className="relative mb-8">
                  <div className="bg-gradient-to-r from-gray-100 to-slate-100 p-8 rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-xl">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {searchTerm ? 'No se encontraron resultados' : 'No hay leads disponibles'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                  {searchTerm 
                    ? `No encontramos leads que coincidan con "${searchTerm}". Intenta con otros términos de búsqueda.`
                    : 'Los nuevos leads aparecerán aquí automáticamente. ¡Prepárate para gestionar tus próximas oportunidades!'
                  }
                </p>
                <div className="flex items-center justify-center space-x-4">
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                  <button 
                    onClick={getLeads}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Search size={16} />
                    <span>Actualizar Lista</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones Rápidas Mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group cursor-pointer">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Envío Masivo</h4>
                  <p className="text-gray-600 text-sm">Responder a múltiples leads</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Envía respuestas personalizadas a varios clientes potenciales al mismo tiempo.
              </p>
              <div className="mt-4 flex items-center text-blue-500 font-medium text-sm group-hover:text-blue-600">
                <span>Comenzar</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Programar Citas</h4>
                  <p className="text-gray-600 text-sm">Gestionar calendario</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Organiza reuniones y citas con tus clientes de forma eficiente.
              </p>
              <div className="mt-4 flex items-center text-green-500 font-medium text-sm group-hover:text-green-600">
                <span>Abrir calendario</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          <div className="group cursor-pointer">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 group-hover:transform group-hover:-translate-y-2">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">Reportes</h4>
                  <p className="text-gray-600 text-sm">Análisis y estadísticas</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Visualiza métricas detalladas y tendencias de tus leads.
              </p>
              <div className="mt-4 flex items-center text-purple-500 font-medium text-sm group-hover:text-purple-600">
                <span>Ver reportes</span>
                <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Dashboard */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-500" />
              <span className="font-medium">© 2025 TwoLifeCar</span>
            </div>
            <span>•</span>
            <span>Panel de Administración</span>
            <span>•</span>
            <span className="text-green-600 font-medium">Sistema Activo</span>
          </div>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            Plataforma profesional de gestión de leads para concesionarias automotrices
          </p>
        </div>
      </div>

      {/* Modals - usando los componentes ya definidos */}
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