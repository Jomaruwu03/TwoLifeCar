# TwoLifeCar - Deployment Guide

## 🚀 Configuración de Deployment

### Variables de Entorno

#### Para Desarrollo Local:
```bash
VITE_API_URL=http://localhost:5001/api
VITE_RECAPTCHA_SITE_KEY=6Ld2UHorAAAAAEauS5-9aLll9XVNfDvm4-G-NgRI
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=6LeKw44rAAAAAEeD0TOL0M_zAA7_hiujVT0ltfKu
```

#### Para Producción (Vercel):
```bash
VITE_API_URL=https://twolifecar-api-psi.vercel.app/api
VITE_RECAPTCHA_SITE_KEY=6Ld2UHorAAAAAEauS5-9aLll9XVNfDvm4-G-NgRI
VITE_RECAPTCHA_ENTERPRISE_SITE_KEY=6LeKw44rAAAAAEeD0TOL0M_zAA7_hiujVT0ltfKu
```

### Scripts Disponibles

```bash
# Desarrollo local
npm run dev:local

# Build para producción
npm run build:prod

# Build para Vercel
npm run vercel-build

# Preview de build
npm run preview
```

### Deployment en Vercel

1. **Configurar Variables de Entorno en Vercel:**
   - `VITE_API_URL` = `https://twolifecar-api-psi.vercel.app/api`
   - `VITE_RECAPTCHA_SITE_KEY` = `6Ld2UHorAAAAAEauS5-9aLll9XVNfDvm4-G-NgRI`
   - `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` = `6LeKw44rAAAAAEeD0TOL0M_zAA7_hiujVT0ltfKu`

2. **Configurar reCAPTCHA en Google Console:**
   - Agregar dominio de Vercel a dominios autorizados
   - Ejemplo: `twolifecar-landing-2yrsx7b68.vercel.app`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### URLs del Sistema

- **Frontend Desarrollo:** http://localhost:5173/
- **Backend Desarrollo:** http://localhost:5001/
- **Frontend Producción:** https://twolifecar-landing-2yrsx7b68.vercel.app/
- **Backend Producción:** https://twolifecar-api-psi.vercel.app/

### Verificación Post-Deployment

1. Verificar que el formulario carga correctamente
2. Probar que aparece el reCAPTCHA
3. Enviar formulario de prueba
4. Verificar logs del backend en Vercel
