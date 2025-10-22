import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaPaperPlane, FaRobot, FaUser, FaStop, FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { Message } from '../types';

// Usar la ruta proxy en lugar de la URL directa
const API_URL = '/api';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(`session_${Date.now()}`);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Scroll al final de los mensajes cuando se agregue uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Iniciar grabación de audio
  const startRecording = async (): Promise<void> => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Enviar audio y obtener respuesta
        try {
          setIsLoading(true);
          
          // Primero transcribe el audio para mostrar lo que se dijo
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('session_id', sessionId);
          
          const transcriptionResponse = await axios.post(`${API_URL}/transcribe`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
          
          // Agrega el mensaje del usuario
          setMessages(prev => [
            ...prev, 
            { 
              sender: 'user', 
              content: transcriptionResponse.data.text, 
              isAudio: false 
            }
          ]);
          
          // Envía el audio para obtener respuesta en audio
          const audioResponse = await axios.post(`${API_URL}/voice-chat`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob'
          });
          
          const responseUrl = URL.createObjectURL(audioResponse.data);
          
          // Reproduce la respuesta automáticamente
          const audio = new Audio(responseUrl);
          audio.play();
          
          // También obtener respuesta en texto para mostrar
          const textResponse = await axios.post(`${API_URL}/chat`, {
            message: transcriptionResponse.data.text,
            session_id: sessionId
          });
          
          setMessages(prev => [
            ...prev, 
            { 
              sender: 'maya', 
              content: textResponse.data.response, 
              isAudio: true, 
              audioUrl: responseUrl 
            }
          ]);
          
        } catch (error) {
          console.error('Error al procesar audio:', error);
          setMessages(prev => [
            ...prev, 
            { 
              sender: 'maya', 
              content: 'Lo siento, hubo un error al procesar tu audio.', 
              isAudio: false 
            }
          ]);
        } finally {
          setIsLoading(false);
          setIsRecording(false);
        }
      });
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error al iniciar grabación:', error);
      alert('No se pudo acceder al micrófono.');
    }
  };
  
  // Detener grabación de audio
  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      // Detener los tracks de audio para liberar el micrófono
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Enviar mensaje de texto
  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { sender: 'user', content: userMessage, isAudio: false }]);
    
    try {
      setIsLoading(true);
      
      // Obtener respuesta en texto
      const textResponse = await axios.post(`${API_URL}/chat`, {
        message: userMessage,
        session_id: sessionId
      });
      
      // Obtener respuesta en audio
      const audioResponse = await axios.post(`${API_URL}/speak`, {
        message: userMessage,
        session_id: sessionId
      }, {
        responseType: 'blob'
      });
      
      const audioUrl = URL.createObjectURL(audioResponse.data);
      
      // Reproducir el audio
      const audio = new Audio(audioUrl);
      audio.play();
      
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'maya', 
          content: textResponse.data.response, 
          isAudio: true, 
          audioUrl: audioUrl 
        }
      ]);
      
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'maya', 
          content: 'Lo siento, hubo un error al procesar tu mensaje.', 
          isAudio: false 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reiniciar la conversación
  const resetConversation = async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/reset`, {
        session_id: sessionId
      });
      setMessages([]);
      setSessionId(`session_${Date.now()}`);
    } catch (error) {
      console.error('Error al reiniciar conversación:', error);
    }
  };
  
  // Reproducir audio
  const playAudio = (audioUrl: string): void => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="chat-container gradient-border">
        {/* Historial de mensajes */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.6)' }}>
              <FaRobot style={{ fontSize: '4rem', color: 'var(--maya-primary)', marginBottom: '1rem' }} />
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Maya está lista para ayudarte</h2>
              <p style={{ textAlign: 'center', maxWidth: '400px' }}>
                Envía un mensaje o usa el micrófono para hablar con Maya. 
                Pregunta lo que quieras sobre Python y desarrollo de software.
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
                        
                        {msg.isAudio && (
                          <button
                            onClick={() => playAudio(msg.audioUrl!)}
                            className="button-primary"
                            style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          >
                            <span>Reproducir audio</span>
                          </button>
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
            onClick={resetConversation}
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
          >
            <FaTrash />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Escribe tu mensaje..."
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
        <p>Maya está conectada a la API en <code style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>https://mayaweb.onrender.com</code> (a través de proxy)</p>
        {isRecording && (
          <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>
            Grabando... Haz clic en el botón de detener cuando termines.
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;