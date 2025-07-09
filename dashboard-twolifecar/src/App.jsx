import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import { X, Send, Archive, LogOut, User, Mail, Calendar, MessageSquare } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      <form onSubmit={handleSend} className="space-y-4">
        <input disabled value={leadEmail} className="w-full px-3 py-2 border rounded bg-gray-50" />
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Asunto" className="w-full px-3 py-2 border rounded" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Mensaje" className="w-full px-3 py-2 border rounded"></textarea>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} type="button" className="px-4 py-2 border rounded text-gray-600">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Enviar</button>
        </div>
      </form>
    </Modal>
  );
}

// --------- LOGIN ---------

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">TwoLifeCar</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="Usuario" className="w-full border px-3 py-2 rounded" />
          <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Contraseña" className="w-full border px-3 py-2 rounded" />
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded">{loading ? "Cargando..." : "Iniciar sesión"}</button>
        </form>
        <p className="text-sm text-gray-500 mt-4">Usuario: admin | Contraseña: 123456</p>
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
        alert("Lead archivado");
        getLeads();
      })
      .catch(() => alert("Error al archivar"));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Cargando leads...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard TwoLifeCar</h2>
        <button onClick={() => setLogoutModal(true)} className="bg-red-500 text-white px-3 py-1 rounded flex items-center space-x-1">
          <LogOut size={16} /><span>Salir</span>
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3">Nombre</th>
              <th>Email</th>
              <th>Mensaje</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b">
                <td className="p-3">{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.message}</td>
                <td>{new Date(lead.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => setReplyModal({ isOpen: true, lead })} className="bg-green-500 text-white px-2 py-1 rounded">Responder</button>{" "}
                  <button onClick={() => setArchiveModal({ isOpen: true, leadId: lead._id })} className="bg-gray-500 text-white px-2 py-1 rounded">Archivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads.length && <p className="text-center py-4">No hay leads disponibles.</p>}
      </div>

      <ReplyModal isOpen={replyModal.isOpen} onClose={() => setReplyModal({ isOpen: false, lead: null })} leadEmail={replyModal.lead?.email || ""} leadName={replyModal.lead?.name || ""} />

      <ConfirmationModal isOpen={archiveModal.isOpen} onClose={() => setArchiveModal({ isOpen: false, leadId: null })} onConfirm={() => handleDelete(archiveModal.leadId)} title="Confirmar" message="¿Archivar este lead?" danger />

      <ConfirmationModal isOpen={logoutModal} onClose={() => setLogoutModal(false)} onConfirm={handleLogout} title="Cerrar sesión" message="¿Seguro que deseas salir?" danger />
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
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
