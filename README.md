# 🤖 Maya - Full Stack Senior Developer AI

![Maya Full Stack Developer](https://img.shields.io/badge/Maya-Full%20Stack%20AI-6366F1?style=for-the-badge)
![Version](https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Maya** es tu desarrolladora Full Stack Senior impulsada por inteligencia artificial. Genera código profesional en múltiples lenguajes, mantiene conversaciones naturales y crea archivos descargables al instante.

## 🌟 Características Principales

### 💬 Conversación Natural
- **IA Avanzada**: Powered by Google Gemini AI
- **Voz Conversacional**: Integración con ElevenLabs para respuestas de voz
- **Reconocimiento de Voz**: Web Speech API para interacción por voz
- **Contexto Persistente**: Mantiene el historial de conversación

### 💻 Generación de Código Full Stack
Maya domina múltiples lenguajes y frameworks:
- **Frontend**: JavaScript, TypeScript, React, Vue, Angular, HTML, CSS
- **Backend**: Python, PHP, Node.js, Java, C#, Go, Ruby
- **Bases de Datos**: SQL, MongoDB queries
- **DevOps**: Docker, Kubernetes configs, scripts bash
- **Y muchos más...**

### 📥 Descarga Inmediata de Archivos
- Extracción automática de código de las respuestas
- Vista previa con syntax highlighting
- Descarga individual o múltiple
- Copiar al portapapeles
- Soporte para todos los formatos de código

### 🎨 Interfaz Moderna
- Diseño oscuro profesional
- Gradientes y animaciones sutiles
- Responsive para móviles y tablets
- Experiencia de usuario intuitiva

## 🚀 Demo en Vivo

🔗 **[Ver Demo](https://5173-i2zt4kr4prd8slql64532-02b9cc79.sandbox.novita.ai)**

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- API Keys:
  - Google Gemini AI API Key
  - ElevenLabs API Key

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Luisnefelibato/maya-frontend.git
cd maya-frontend
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Keys
VITE_GEMINI_API_KEY=tu_gemini_api_key_aqui
VITE_ELEVENLABS_API_KEY=tu_elevenlabs_api_key_aqui
VITE_ELEVENLABS_VOICE_ID=tu_voice_id_aqui

# GitHub Configuration (opcional)
VITE_GITHUB_USERNAME=tu_usuario_github

# App Configuration
VITE_APP_TITLE=Maya - Full Stack Senior Developer
VITE_APP_DESCRIPTION=Tu asistente de desarrollo Full Stack con IA
```

Puedes usar el archivo `.env.example` como referencia.

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run preview      # Preview del build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
```

## 🏗️ Arquitectura

```
maya-frontend/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.tsx      # Barra de navegación
│   │   ├── Footer.tsx      # Pie de página
│   │   └── FileCard.tsx    # Tarjeta de archivo generado
│   ├── pages/              # Páginas principales
│   │   ├── LandingPage.tsx # Página de inicio
│   │   └── ChatPage.tsx    # Página de chat
│   ├── services/           # Servicios de API
│   │   ├── geminiService.ts      # Integración Gemini AI
│   │   ├── elevenLabsService.ts  # Integración ElevenLabs
│   │   └── codeExtractor.ts      # Extracción de código
│   ├── types.ts            # Definiciones TypeScript
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── .env.example           # Ejemplo de variables de entorno
└── package.json           # Configuración del proyecto
```

## 🔧 Tecnologías Utilizadas

### Core
- **React 18.2** - UI Library
- **TypeScript 5.2** - Tipado estático
- **Vite 5.0** - Build tool y dev server

### IA y Voz
- **Google Gemini AI** - Modelo de lenguaje para conversaciones y código
- **ElevenLabs** - Text-to-Speech de alta calidad
- **Web Speech API** - Reconocimiento de voz nativo del navegador

### UI y Estilos
- **React Router DOM 6.20** - Navegación
- **React Markdown 9.0** - Renderizado de Markdown
- **React Icons 4.12** - Iconos
- **CSS personalizado** - Sistema de diseño propio

### HTTP y Utilidades
- **Axios 1.6** - Cliente HTTP

## 💡 Cómo Usar Maya

### 1. Conversación por Texto
1. Navega a la página de Chat
2. Escribe tu consulta o descripción del proyecto
3. Presiona Enter o haz clic en enviar
4. Maya responderá y generará código si es necesario

### 2. Conversación por Voz
1. Haz clic en el botón del micrófono
2. Permite el acceso al micrófono
3. Habla claramente sobre tu proyecto
4. Haz clic en detener cuando termines
5. Maya transcribirá, procesará y responderá con voz

### 3. Descargar Archivos
1. Maya generará archivos automáticamente cuando sea relevante
2. Los archivos aparecerán como tarjetas debajo de su respuesta
3. Haz clic en el icono de descarga para guardar el archivo
4. O usa el botón de copiar para copiar al portapapeles

### 4. Formato de Código para Maya

Cuando pidas código a Maya, ella lo generará en este formato:

\`\`\`filename:ejemplo.js
const saludo = () => {
  console.log("Hola mundo");
};
\`\`\`

Esto permite que el sistema detecte y extraiga automáticamente los archivos.

## 🎯 Ejemplos de Uso

### Ejemplo 1: Crear una API REST
```
Usuario: "Maya, necesito una API REST en Node.js con Express para gestionar usuarios. 
         Debe tener endpoints para crear, leer, actualizar y eliminar usuarios."

Maya: [Genera archivos: server.js, routes/users.js, models/User.js, etc.]
```

### Ejemplo 2: Componente React
```
Usuario: "Crea un componente React de formulario de login con validación"

Maya: [Genera: LoginForm.tsx con validaciones y estilos]
```

### Ejemplo 3: Script Python
```
Usuario: "Necesito un script Python que lea un CSV y genere gráficos con matplotlib"

Maya: [Genera: data_visualizer.py con ejemplos]
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🔐 Seguridad

- Las API keys se almacenan en variables de entorno
- El archivo `.env` está en `.gitignore`
- No incluyas credenciales en commits
- Usa el archivo `.env.example` como referencia

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Luis Fernando Libato**
- GitHub: [@Luisnefelibato](https://github.com/Luisnefelibato)
- Creado con ❤️ en 2025

## 🙏 Agradecimientos

- Google Gemini AI por proporcionar el modelo de lenguaje
- ElevenLabs por la tecnología de text-to-speech
- La comunidad de React y TypeScript

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
1. Abre un [Issue](https://github.com/Luisnefelibato/maya-frontend/issues)
2. Consulta la documentación
3. Contacta al autor

---

**Hecho con 💜 por la comunidad de desarrolladores**
