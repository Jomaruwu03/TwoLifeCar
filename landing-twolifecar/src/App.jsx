import { useState } from "react";
import { Car, Phone, Mail, MessageSquare, Send, Shield, CheckCircle, Star } from "lucide-react";
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔍 Landing API URL:", API_URL);
function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      alert("Debes aceptar los términos y condiciones para continuar.");
      return;
    }

    if (!token) {
      alert("Por favor, completa el reCAPTCHA.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await axios.post(`${API_URL}/leads`, {
        ...form,
        token,
        acceptedTerms: true,
      });
      alert(res.data.message);
      setForm({ name: "", email: "", message: "" });
      setToken("");
      setAcceptedTerms(false);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al enviar el formulario. Inténtalo de nuevo.");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleRecaptchaChange = (value) => {
    setToken(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-40 right-40 w-8 h-8 border-2 border-white rounded-full"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center py-12 px-4">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full shadow-2xl">
            <Car className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Two<span className="text-orange-500">Life</span>Car
        </h1>
        
        <p className="text-xl text-blue-200 mb-2 max-w-2xl mx-auto">
          Tu próximo auto te está esperando
        </p>
        
        <p className="text-blue-300 text-lg max-w-3xl mx-auto">
          Compra y venta de autos usados con total confianza y garantía
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-blue-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Verificación completa</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Proceso transparente</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Atención personalizada</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          
          {/* Form Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              ¡Encuentra tu auto ideal!
            </h2>
            <p className="text-gray-600 text-lg">
              Cuéntanos qué buscas y te ayudaremos a encontrarlo
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ingresa tu nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 placeholder-gray-400"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="relative">
              <label className="block text-gray-700 font-semibold mb-2">
                ¿Qué tipo de auto buscas?
              </label>
              <div className="relative">
                <textarea
                  rows="5"
                  placeholder="Ejemplo: Busco un sedan compacto, automático, con aire acondicionado, presupuesto de $150,000..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                  required
                />
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* reCAPTCHA Placeholder */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
              <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LdsEY8rAAAAAMWCEfidFxT-o9-0fgRdMjTQASY9"}
          onChange={(token) => setToken(token)}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                  required
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  Acepto los{" "}
                  <button
                    type="button"
                    className="text-orange-600 hover:text-orange-800 underline font-semibold"
                    onClick={() => setShowTerms(true)}
                  >
                    términos y condiciones
                  </button>
                  {" "}y autorizo el tratamiento de mis datos personales para recibir información sobre vehículos.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!acceptedTerms || !token || isSubmitting}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                !acceptedTerms || !token || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Enviar consulta</span>
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">¿Prefieres contactarnos directamente?</p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-orange-500" />
                  <span>+52 555 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>info@twolifecar.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
                <button
                  onClick={() => setShowTerms(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6 text-gray-700">
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    1. Aceptación de los Términos
                  </h3>
                  <p className="leading-relaxed">
                    Al utilizar este formulario de contacto, usted acepta estos términos y condiciones
                    en su totalidad. Si no está de acuerdo con estos términos, no utilice este servicio.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Car className="w-5 h-5 text-orange-500" />
                    2. Uso del Servicio
                  </h3>
                  <p className="leading-relaxed">
                    Este formulario está destinado únicamente para consultas legítimas relacionadas con
                    la compra y venta de vehículos usados. No está permitido el uso para spam, contenido
                    malicioso o actividades ilegales.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-orange-500" />
                    3. Información Personal
                  </h3>
                  <p className="leading-relaxed">
                    Al enviar este formulario, usted consiente que TwoLifeCar recopile y procese su
                    información personal (nombre, email, mensaje) para responder a su consulta. Su
                    información será tratada con confidencialidad y no será compartida con terceros
                    sin su consentimiento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Comunicaciones</h3>
                  <p className="leading-relaxed">
                    Al proporcionar su información de contacto, usted acepta recibir comunicaciones
                    relacionadas con su consulta. Puede optar por no recibir comunicaciones futuras
                    en cualquier momento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Limitación de Responsabilidad</h3>
                  <p className="leading-relaxed">
                    TwoLifeCar no será responsable por daños directos, indirectos, incidentales o
                    consecuentes que resulten del uso de este servicio o de la información proporcionada
                    a través del mismo.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">6. Modificaciones</h3>
                  <p className="leading-relaxed">
                    TwoLifeCar se reserva el derecho de modificar estos términos y condiciones en
                    cualquier momento. Las modificaciones entrarán en vigor inmediatamente después
                    de su publicación.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">7. Ley Aplicable</h3>
                  <p className="leading-relaxed">
                    Estos términos y condiciones se rigen por las leyes locales aplicables. Cualquier
                    disputa será resuelta en los tribunales competentes.
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <p className="text-sm font-semibold text-orange-800">
                    Última actualización: 10 de julio de 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-blue-200 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Car className="w-4 h-4" />
          <span>© 2025 TwoLifeCar. Todos los derechos reservados.</span>
        </div>
        <p className="text-xs text-blue-300">
          Tu próximo auto está a un clic de distancia
        </p>
      </footer>
    </div>
  );
}

export default App;