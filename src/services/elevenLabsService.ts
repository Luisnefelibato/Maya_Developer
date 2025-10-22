import axios from 'axios';
import { ElevenLabsRequest, ElevenLabsVoiceSettings } from '../types';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

/**
 * Configuración de voz optimizada para conversación natural
 */
const DEFAULT_VOICE_SETTINGS: ElevenLabsVoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.5,
  use_speaker_boost: true
};

/**
 * Convierte texto a voz usando ElevenLabs
 * @param text - Texto a convertir en audio
 * @returns Promise con el Blob de audio
 */
export const textToSpeech = async (text: string): Promise<Blob> => {
  try {
    // Limpiar el texto de código para la síntesis de voz
    const cleanText = cleanTextForSpeech(text);

    if (!cleanText.trim()) {
      throw new Error('El texto está vacío después de limpiarlo');
    }

    const requestData: ElevenLabsRequest = {
      text: cleanText,
      model_id: 'eleven_multilingual_v2',
      voice_settings: DEFAULT_VOICE_SETTINGS
    };

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      requestData,
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'blob'
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al generar audio con ElevenLabs:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Error de autenticación con ElevenLabs. Verifica tu API key.');
      }
      if (error.response?.status === 429) {
        throw new Error('Se ha excedido el límite de caracteres de ElevenLabs. Por favor, espera un momento.');
      }
    }
    
    throw new Error('No pude generar el audio. Por favor, intenta de nuevo.');
  }
};

/**
 * Transcribe audio a texto usando la API de Web Speech o servicios externos
 * Nota: ElevenLabs no tiene transcripción, usar Web Speech API del navegador
 */
export const speechToText = async (audioBlob: Blob): Promise<string> => {
  // Esta funcionalidad se maneja mejor con la Web Speech API del navegador
  // o con servicios como Google Speech-to-Text o Whisper de OpenAI
  // Por ahora, retornamos un placeholder
  return new Promise((resolve, reject) => {
    reject(new Error('La transcripción debe manejarse con Web Speech API del navegador'));
  });
};

/**
 * Limpia el texto para síntesis de voz
 * - Remueve bloques de código
 * - Limpia caracteres especiales de markdown
 * - Mantiene solo el texto legible
 */
const cleanTextForSpeech = (text: string): string => {
  let cleaned = text;

  // Remover bloques de código (```code```)
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '[código generado]');
  
  // Remover código inline (`code`)
  cleaned = cleaned.replace(/`[^`]+`/g, '');
  
  // Remover enlaces markdown [text](url)
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remover headers markdown (###)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
  
  // Remover énfasis markdown (**, *, _, __)
  cleaned = cleaned.replace(/(\*\*|__)(.*?)\1/g, '$2');
  cleaned = cleaned.replace(/(\*|_)(.*?)\1/g, '$2');
  
  // Remover listas markdown (-, *, +)
  cleaned = cleaned.replace(/^[\*\-\+]\s+/gm, '');
  
  // Remover números de listas
  cleaned = cleaned.replace(/^\d+\.\s+/gm, '');
  
  // Limpiar múltiples espacios y líneas vacías
  cleaned = cleaned.replace(/\n\s*\n/g, '\n');
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Truncar si es muy largo (ElevenLabs tiene límites)
  const MAX_LENGTH = 5000;
  if (cleaned.length > MAX_LENGTH) {
    cleaned = cleaned.substring(0, MAX_LENGTH) + '...';
  }
  
  return cleaned.trim();
};

/**
 * Obtiene información sobre las voces disponibles
 */
export const getAvailableVoices = async (): Promise<any> => {
  try {
    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener voces de ElevenLabs:', error);
    throw new Error('No pude obtener las voces disponibles');
  }
};

/**
 * Obtiene la información de la voz actual
 */
export const getCurrentVoiceInfo = async (): Promise<any> => {
  try {
    const response = await axios.get(
      `${ELEVENLABS_API_URL}/voices/${ELEVENLABS_VOICE_ID}`,
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al obtener información de la voz:', error);
    throw new Error('No pude obtener la información de la voz');
  }
};

export { ELEVENLABS_VOICE_ID, ELEVENLABS_API_KEY };
