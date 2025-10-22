// Tipos para archivos generados
export interface GeneratedFile {
  name: string;
  content: string;
  language: string;
  extension: string;
}

// Tipos para los mensajes del chat
export interface Message {
  sender: 'user' | 'maya';
  content: string;
  isAudio: boolean;
  audioUrl?: string;
  files?: GeneratedFile[];
  timestamp?: number;
}

// Tipos para las respuestas de la API
export interface ChatResponse {
  response: string;
  session_id: string;
  files?: GeneratedFile[];
}

export interface TranscriptionResponse {
  text: string;
}

export interface ResetResponse {
  message: string;
  session_id: string;
}

export interface VoiceInfo {
  name: string;
  gender: string;
  locale: string;
}

export interface VoicesResponse {
  voices: VoiceInfo[];
  current_voice: string;
}

export interface HealthResponse {
  status: string;
  model: string;
  ollama_url: string;
  voice: string;
}

// Tipos para props de componentes
export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Tipos para Gemini AI
export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
    safetyRatings: any[];
  }[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

// Tipos para ElevenLabs
export interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface ElevenLabsRequest {
  text: string;
  model_id?: string;
  voice_settings?: ElevenLabsVoiceSettings;
}

// Tipos para GitHub
export interface GitHubRepo {
  name: string;
  description: string;
  private: boolean;
}

export interface GitHubFile {
  path: string;
  content: string;
  message: string;
}