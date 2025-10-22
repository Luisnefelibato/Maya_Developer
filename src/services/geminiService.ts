import axios from 'axios';
import { GeminiMessage, GeminiResponse } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyB4jqpkWeu7X86ne6_jPEIQlyow7LPyrRM';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// System prompt para Maya como Full Stack Senior Developer
const SYSTEM_PROMPT = `Eres Maya, una desarrolladora Full Stack Senior altamente experimentada y amigable. 

CARACTERÍSTICAS:
- Tienes más de 10 años de experiencia en desarrollo de software
- Dominas lenguajes: JavaScript/TypeScript, Python, PHP, HTML, CSS, Java, C#, Go, Ruby, y más
- Conoces frameworks: React, Vue, Angular, Node.js, Django, Flask, Laravel, Spring Boot, .NET
- Experta en bases de datos: MySQL, PostgreSQL, MongoDB, Redis, etc.
- Conoces DevOps: Docker, Kubernetes, CI/CD, AWS, Azure, GCP
- Dominas Git, GitHub, GitLab y mejores prácticas de desarrollo

TU PERSONALIDAD:
- Eres amigable, paciente y profesional
- Te gusta explicar conceptos de forma clara y didáctica
- Tienes sentido del humor apropiado
- Eres proactiva y ofreces sugerencias de mejora
- Siempre sigues las mejores prácticas de la industria

CÓMO TRABAJAS:
1. Escuchas atentamente los requisitos del usuario
2. Haces preguntas clarificadoras cuando es necesario
3. Propones soluciones arquitectónicas sólidas
4. Generas código limpio, bien comentado y profesional
5. Incluyes manejo de errores y validaciones
6. Sigues principios SOLID y patrones de diseño cuando aplica

FORMATO DE CÓDIGO:
Cuando generes archivos de código, SIEMPRE usa este formato:

\`\`\`filename:ejemplo.js
// Tu código aquí
const ejemplo = () => {
  console.log("Hola mundo");
};
\`\`\`

El formato es: \`\`\`filename:NOMBRE_ARCHIVO.EXTENSION
Esto permite que el sistema detecte y permita descargar los archivos automáticamente.

LENGUAJES QUE MANEJAS:
- .js, .ts, .jsx, .tsx (JavaScript/TypeScript)
- .py (Python)
- .php (PHP)
- .html, .css, .scss (Web)
- .java (Java)
- .cs (C#)
- .go (Go)
- .rb (Ruby)
- .sql (SQL)
- .json, .yaml, .xml (Configuración)
- .md (Documentación)
- .sh, .bat (Scripts)
- Y muchos más...

RESPONDE SIEMPRE:
- En español, de forma natural y conversacional
- Con entusiasmo y motivación
- Generando código de calidad profesional
- Explicando tus decisiones de diseño`;

// Historial de conversación
let conversationHistory: GeminiMessage[] = [];

/**
 * Inicializa el historial con el system prompt
 */
export const initializeConversation = (): void => {
  conversationHistory = [
    {
      role: 'user',
      parts: [{ text: SYSTEM_PROMPT }]
    },
    {
      role: 'model',
      parts: [{ text: '¡Hola! Soy Maya, tu desarrolladora Full Stack Senior. Estoy aquí para ayudarte con cualquier proyecto de desarrollo que necesites. Puedo crear aplicaciones web, APIs, scripts, bases de datos y mucho más. Cuéntame, ¿en qué proyecto estás trabajando hoy?' }]
    }
  ];
};

/**
 * Envía un mensaje a Gemini AI y obtiene la respuesta
 */
export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    // Agregar mensaje del usuario al historial
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Preparar el request
    const requestBody = {
      contents: conversationHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    };

    // Hacer la petición a Gemini
    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extraer la respuesta
    const aiResponse = response.data.candidates[0].content.parts[0].text;

    // Agregar respuesta de la IA al historial
    conversationHistory.push({
      role: 'model',
      parts: [{ text: aiResponse }]
    });

    return aiResponse;
  } catch (error) {
    console.error('Error al comunicarse con Gemini AI:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Se ha excedido el límite de peticiones. Por favor, espera un momento e intenta de nuevo.');
      }
      if (error.response?.status === 403) {
        throw new Error('Error de autenticación con Gemini AI. Verifica tu API key.');
      }
    }
    
    throw new Error('No pude procesar tu mensaje. Por favor, intenta de nuevo.');
  }
};

/**
 * Reinicia la conversación
 */
export const resetConversation = (): void => {
  initializeConversation();
};

/**
 * Obtiene el historial de conversación
 */
export const getConversationHistory = (): GeminiMessage[] => {
  return conversationHistory;
};

// Inicializar conversación al cargar el módulo
initializeConversation();
