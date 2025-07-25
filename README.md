# TwoLifeCar - Monorepo

Sistema completo de gestión de leads para venta de autos usados.

## 🏗️ Estructura del proyecto

```
twolifecar/
├── api/                    # Backend API (Node.js + Express)
├── dashboard-twolifecar/   # Dashboard Admin (React + Vite)
├── landing-twolifecar/     # Landing Page (React + Vite)
└── README.md
```

## 🚀 Proyectos

### 📡 API (Backend)
- **Tecnologías**: Node.js, Express, MongoDB, JWT
- **Puerto**: 5000
- **Funcionalidades**: 
  - Gestión de leads
  - Autenticación JWT
  - Validación reCAPTCHA
  - Integración con Slack

### 🎛️ Dashboard (Admin)
- **Tecnologías**: React, Vite, Axios
- **Funcionalidades**:
  - Login de administrador
  - Visualización de leads
  - Respuesta a leads
  - Archivo de leads

### 🌐 Landing Page (Público)
- **Tecnologías**: React, Vite, reCAPTCHA
- **Funcionalidades**:
  - Formulario de contacto
  - Validación reCAPTCHA
  - Términos y condiciones
  - Diseño responsive

## 🔧 Configuración para desarrollo

### Requisitos previos
- Node.js 18+
- MongoDB Atlas o local
- Claves de reCAPTCHA

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jomaruwu03/TwoLifeCar.git
cd TwoLifeCar
```

### 2. Configurar la API
```bash
cd api
npm install
# Configurar variables de entorno en .env
npm start
```

### 3. Configurar el Dashboard
```bash
cd dashboard-twolifecar
npm install
# Configurar VITE_API_URL en .env
npm run dev
```

### 4. Configurar la Landing Page
```bash
cd landing-twolifecar
npm install
# Configurar VITE_API_URL en .env
npm run dev
```

## 🌍 Deployment en Vercel

### API (Backend)
- **Proyecto**: Importar desde `/api`
- **Variables de entorno**: MongoDB, JWT, reCAPTCHA, Slack

### Dashboard (Frontend Admin)
- **Proyecto**: Importar desde `/dashboard-twolifecar`
- **Variables de entorno**: VITE_API_URL

### Landing Page (Frontend Público)
- **Proyecto**: Importar desde `/landing-twolifecar`
- **Variables de entorno**: VITE_API_URL

## 📝 Variables de entorno

### API (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret
SLACK_WEBHOOK_URL=your-slack-webhook
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👨‍💻 Autor

Desarrollado por Jomar Alejandro