import { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "./App.css";

function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/leads", {
      ...form,
      token,
    });
    alert(res.data.message);
    setForm({ name: "", email: "", message: "" });
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
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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

        <button type="submit">Enviar</button>
      </form>

      <footer>
        © 2025 TwoLifeCar. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;
