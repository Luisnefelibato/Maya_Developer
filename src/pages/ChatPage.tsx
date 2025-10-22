import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaStop, FaTrash, FaFileCode } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { sendMessageToGemini, resetConversation } from '../services/geminiService';
import { textToSpeech } from '../services/elevenLabsService';
import { extractFilesFromText } from '../services/codeExtractor';
import FileCard from '../components/FileCard';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Scroll al final de los mensajes cuando se agregue uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar Web Speech API para reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcripción:', transcript);
        
        // Agregar mensaje del usuario
        const userMessage: Message = {
          sender: 'user',
          content: transcript,
          isAudio: false,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, userMessage]);
        
        // Procesar el mensaje con Gemini
        await processMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Error de reconocimiento de voz:', event.error);
        setIsRecording(false);
        if (event.error === 'no-speech') {
          alert('No detecté ningún audio. Por favor, intenta de nuevo.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Iniciar grabación de audio con Web Speech API
  const startRecording = (): void => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error al iniciar reconocimiento de voz:', error);
        alert('No se pudo acceder al micrófono. Verifica los permisos.');
      }
    } else {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome, Edge o Safari.');
    }
  };
  
  // Detener grabación de audio
  const stopRecording = (): void => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  // Procesar mensaje con Gemini y generar audio
  const processMessage = async (messageText: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Obtener respuesta de Gemini AI
      const aiResponse = await sendMessageToGemini(messageText);
      
      // Extraer archivos de código de la respuesta
      const files = extractFilesFromText(aiResponse);
      
      // Generar audio de la respuesta con ElevenLabs
      let audioUrl: string | undefined;
      try {
        setIsSpeaking(true);
        const audioBlob = await textToSpeech(aiResponse);
        audioUrl = URL.createObjectURL(audioBlob);
        
        // Reproducir el audio
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };
        
        audio.play().catch(err => {
          console.error('Error al reproducir audio:', err);
          setIsSpeaking(false);
        });
      } catch (audioError) {
        console.error('Error al generar audio:', audioError);
        setIsSpeaking(false);
        // Continuar sin audio si falla
      }
      
      // Agregar respuesta de Maya
      const mayaMessage: Message = {
        sender: 'maya',
        content: aiResponse,
        isAudio: !!audioUrl,
        audioUrl: audioUrl,
        files: files.length > 0 ? files : undefined,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, mayaMessage]);
      
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      const errorMessage = error instanceof Error ? error.message : 'Hubo un error al procesar tu mensaje.';
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'maya',
          content: `Lo siento, ${errorMessage}`,
          isAudio: false,
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enviar mensaje de texto
  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Agregar mensaje del usuario
    const userMsg: Message = {
      sender: 'user',
      content: userMessage,
      isAudio: false,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMsg]);
    
    // Procesar con Gemini
    await processMessage(userMessage);
  };
  
  // Reiniciar la conversación
  const handleResetConversation = (): void => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar la conversación?')) {
      resetConversation();
      setMessages([]);
      
      // Detener audio si está reproduciéndose
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsSpeaking(false);
    }
  };
  
  // Reproducir audio
  const playAudio = (audioUrl: string): void => {
    // Detener audio actual si existe
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    setIsSpeaking(true);
    
    audio.onended = () => {
      setIsSpeaking(false);
      currentAudioRef.current = null;
    };
    
    audio.play().catch(err => {
      console.error('Error al reproducir audio:', err);
      setIsSpeaking(false);
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="chat-container gradient-border">
        {/* Historial de mensajes */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.6)' }}>
              <FaRobot style={{ fontSize: '4rem', color: 'var(--maya-primary)', marginBottom: '1rem' }} />
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ¡Hola! Soy Maya, tu desarrolladora Full Stack Senior
              </h2>
              <p style={{ textAlign: 'center', maxWidth: '500px', lineHeight: '1.6' }}>
                Puedo ayudarte a crear aplicaciones completas en múltiples lenguajes: JavaScript, Python, PHP, Java, y más.
                <br /><br />
                Háblame de tu proyecto y generaré el código que necesitas. ¡Los archivos se pueden descargar al instante!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index}
                style={{ 
                  display: 'flex', 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '1rem'
                }}
              >
                <div className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                  <div className="message-header">
                    {msg.sender === 'user' ? (
                      <>
                        <span style={{ fontWeight: '500' }}>Tú</span>
                        <FaUser style={{ fontSize: '0.875rem' }} />
                      </>
                    ) : (
                      <>
                        <FaRobot style={{ color: 'var(--maya-primary)' }} />
                        <span className="gradient-text" style={{ fontWeight: '500' }}>Maya</span>
                      </>
                    )}
                  </div>
                  
                  <div>
                    {msg.sender === 'user' ? (
                      <p>{msg.content}</p>
                    ) : (
                      <div>
                        <ReactMarkdown 
                          components={{
                            pre: ({ node, ...props }) => <pre style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }} {...props} />,
                            code: ({ node, ...props }) => <code style={{ fontFamily: 'monospace' }} {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                        
                        {msg.isAudio && msg.audioUrl && (
                          <button
                            onClick={() => playAudio(msg.audioUrl!)}
                            className="button-primary"
                            style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            disabled={isSpeaking}
                          >
                            <span>{isSpeaking ? '🔊 Reproduciendo...' : '🔊 Escuchar respuesta'}</span>
                          </button>
                        )}
                        
                        {/* Mostrar archivos generados */}
                        {msg.files && msg.files.length > 0 && (
                          <div className="files-container">
                            <div className="files-header">
                              <FaFileCode />
                              <span>{msg.files.length} archivo{msg.files.length > 1 ? 's' : ''} generado{msg.files.length > 1 ? 's' : ''}</span>
                            </div>
                            {msg.files.map((file, fileIndex) => (
                              <FileCard key={fileIndex} file={file} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
              <div className="message message-bot">
                <div className="message-header">
                  <FaRobot style={{ color: 'var(--maya-primary)' }} />
                  <span className="gradient-text" style={{ fontWeight: '500' }}>Maya</span>
                </div>
                <div className="loader">
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                  <div className="loader-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Controles y entrada de usuario */}
        <div className="chat-input-container">
          <button
            onClick={handleResetConversation}
            style={{ 
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              marginRight: '0.5rem',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              cursor: 'pointer'
            }}
            title="Reiniciar conversación"
            disabled={isLoading}
          >
            <FaTrash />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder="Cuéntame sobre tu proyecto..."
            disabled={isLoading || isRecording}
            className="chat-input"
          />
          
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim() || isRecording}
            className="chat-button"
            style={{ 
              backgroundColor: input.trim() ? 'var(--maya-primary)' : 'rgba(99, 102, 241, 0.5)',
              cursor: input.trim() && !isLoading && !isRecording ? 'pointer' : 'not-allowed'
            }}
          >
            <FaPaperPlane />
          </button>
          
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="chat-button recording"
              title="Detener grabación"
            >
              <FaStop />
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={isLoading}
              className="chat-button"
              style={{ 
                backgroundColor: isLoading ? 'rgba(139, 92, 246, 0.5)' : 'var(--maya-secondary)',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              title="Hablar con Maya"
            >
              <FaMicrophone />
            </button>
          )}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem', marginTop: '1rem' }}>
        <p>
          Powered by <strong style={{ color: 'var(--maya-primary)' }}>Google Gemini AI</strong> y{' '}
          <strong style={{ color: 'var(--maya-secondary)' }}>ElevenLabs</strong>
        </p>
        {isRecording && (
          <p style={{ color: '#ef4444', marginTop: '0.5rem', fontWeight: '600' }}>
            🎤 Escuchando... Habla ahora y presiona detener cuando termines.
          </p>
        )}
        {isSpeaking && (
          <p style={{ color: 'var(--maya-accent)', marginTop: '0.5rem', fontWeight: '600' }}>
            🔊 Maya está hablando...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
