# Petra — Coach de Ventas GeoVictoria

Aplicación web de Petra, asistente de ventas con IA para el equipo comercial de GeoVictoria.

## Estructura del proyecto

```
petra-geovictoria/
├── api/
│   └── chat.js          ← Proxy seguro (Serverless Function en Vercel)
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── PetraApp.jsx     ← Componente principal
├── package.json
└── vercel.json
```

---

## Despliegue en Vercel (paso a paso)

### 1. Subir el código a GitHub

1. Crea un repositorio nuevo en [github.com](https://github.com) (puede ser privado)
2. Sube esta carpeta completa:
   ```bash
   git init
   git add .
   git commit -m "Petra GeoVictoria inicial"
   git remote add origin https://github.com/TU_USUARIO/petra-geovictoria.git
   git push -u origin main
   ```

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
2. Haz clic en **"Add New Project"**
3. Importa el repositorio `petra-geovictoria`
4. Vercel detectará automáticamente que es un proyecto React

### 3. Agregar la API Key de Anthropic ⚠️

**Este paso es crítico — sin esto la app no funcionará.**

En el panel de configuración del proyecto en Vercel, antes de hacer Deploy:

1. Ve a **Settings → Environment Variables**
2. Agrega:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-...` (tu API key de Anthropic)
   - **Environments:** Production, Preview, Development ✓
3. Haz clic en **Save**

### 4. Desplegar

1. Haz clic en **"Deploy"**
2. Vercel construirá el proyecto (~2 minutos)
3. Recibirás una URL pública tipo: `https://petra-geovictoria.vercel.app`

---

## Cómo funciona la seguridad

La API key **nunca** queda expuesta en el código del navegador. El flujo es:

```
Navegador → /api/chat (Serverless Function en Vercel) → api.anthropic.com
```

La función serverless en `api/chat.js` lee la API key desde las variables de entorno del servidor de Vercel.

---

## Actualizaciones futuras

Para actualizar la app, simplemente haz push a GitHub:
```bash
git add .
git commit -m "descripción del cambio"
git push
```
Vercel re-desplegará automáticamente.

---

## Obtener tu API Key de Anthropic

Si aún no tienes una: [console.anthropic.com](https://console.anthropic.com)
