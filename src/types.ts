// Tipos para los mensajes del chat
export interface Message {
    sender: 'user' | 'maya';
    content: string;
    isAudio: boolean;
    audioUrl?: string;
  }
  
  // Tipos para las respuestas de la API
  export interface ChatResponse {
    response: string;
    session_id: string;
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