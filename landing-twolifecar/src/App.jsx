import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

const API_URL = 'https://twolifecar-api-psi.vercel.app/api/leads';

function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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

    try {
      const res = await axios.post(`${API_URL}`, {
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

  return (
    <div className="container">
      <img
        src="https://images.unsplash.com/photo-1549921296-3a6b81c92410?auto=format&fit=crop&w=1350&q=80"
        alt="Venta de autos usados"
        className="hero-image"
      />

      <h1 className="header">TwoLifeCar</h1>
      <p className="subtext">Compra y venta de autos usados con confianza.</p>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoComplete="name"
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          required
        />
        <textarea
          rows="4"
          placeholder="Mensaje o tipo de auto que buscas..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        ></textarea>

        <ReCAPTCHA
          sitekey="6Ld2UHorAAAAAEauS5-9aLll9XVNfDvm4-G-NgRI"
          onChange={(token) => setToken(token)}
        />

        <div className="terms-container">
          <label className="terms-label">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              required
            />
            Acepto los{" "}
            <button
              type="button"
              className="terms-link"
              onClick={() => setShowTerms(true)}
            >
              términos y condiciones
            </button>
          </label>
        </div>

        <button type="submit" disabled={!acceptedTerms || !token}>
          Enviar
        </button>
      </form>

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="modal-overlay" onClick={() => setShowTerms(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Términos y Condiciones</h2>
              <button className="close-btn" onClick={() => setShowTerms(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <h3>1. Aceptación de los Términos</h3>
              <p>
                Al utilizar este formulario de contacto, usted acepta estos términos y condiciones
                en su totalidad. Si no está de acuerdo con estos términos, no utilice este servicio.
              </p>

              <h3>2. Uso del Servicio</h3>
              <p>
                Este formulario está destinado únicamente para consultas legítimas relacionadas con
                la compra y venta de vehículos usados. No está permitido el uso para spam, contenido
                malicioso o actividades ilegales.
              </p>

              <h3>3. Información Personal</h3>
              <p>
                Al enviar este formulario, usted consiente que TwoLifeCar recopile y procese su
                información personal (nombre, email, mensaje) para responder a su consulta. Su
                información será tratada con confidencialidad y no será compartida con terceros
                sin su consentimiento.
              </p>

              <h3>4. Comunicaciones</h3>
              <p>
                Al proporcionar su información de contacto, usted acepta recibir comunicaciones
                relacionadas con su consulta. Puede optar por no recibir comunicaciones futuras
                en cualquier momento.
              </p>

              <h3>5. Limitación de Responsabilidad</h3>
              <p>
                TwoLifeCar no será responsable por daños directos, indirectos, incidentales o
                consecuentes que resulten del uso de este servicio o de la información proporcionada
                a través del mismo.
              </p>

              <h3>6. Modificaciones</h3>
              <p>
                TwoLifeCar se reserva el derecho de modificar estos términos y condiciones en
                cualquier momento. Las modificaciones entrarán en vigor inmediatamente después
                de su publicación.
              </p>

              <h3>7. Ley Aplicable</h3>
              <p>
                Estos términos y condiciones se rigen por las leyes locales aplicables. Cualquier
                disputa será resuelta en los tribunales competentes.
              </p>

              <p className="last-updated">
                <strong>Última actualización: 9 de julio de 2025</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <footer>
        © 2025 TwoLifeCar. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;
