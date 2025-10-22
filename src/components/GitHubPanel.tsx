import React, { useState, useEffect } from 'react';
import { FaGithub, FaPlus, FaUpload, FaKey, FaTimes } from 'react-icons/fa';
import { GeneratedFile } from '../types';
import {
  hasGitHubToken,
  setGitHubToken,
  clearGitHubToken,
  listRepositories,
  createRepository,
  uploadFilesToRepository
} from '../services/githubService';

interface GitHubPanelProps {
  files: GeneratedFile[];
  onClose: () => void;
}

const GitHubPanel: React.FC<GitHubPanelProps> = ({ files, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setTokenInput] = useState('');
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [newRepoName, setNewRepoName] = useState('');
  const [newRepoDesc, setNewRepoDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCreateRepo, setShowCreateRepo] = useState(false);

  useEffect(() => {
    setIsAuthenticated(hasGitHubToken());
    if (hasGitHubToken()) {
      loadRepositories();
    }
  }, []);

  const loadRepositories = async () => {
    try {
      setIsLoading(true);
      const repos = await listRepositories();
      setRepositories(repos);
    } catch (error) {
      setMessage('Error al cargar repositorios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = () => {
    if (token.trim()) {
      setGitHubToken(token);
      setIsAuthenticated(true);
      setMessage('¡Autenticado correctamente!');
      loadRepositories();
      setTokenInput('');
    }
  };

  const handleLogout = () => {
    clearGitHubToken();
    setIsAuthenticated(false);
    setRepositories([]);
    setSelectedRepo('');
    setMessage('Sesión cerrada');
  };

  const handleCreateRepo = async () => {
    if (!newRepoName.trim()) {
      setMessage('El nombre del repositorio es requerido');
      return;
    }

    try {
      setIsLoading(true);
      await createRepository(newRepoName, newRepoDesc);
      setMessage(`Repositorio "${newRepoName}" creado exitosamente`);
      setNewRepoName('');
      setNewRepoDesc('');
      setShowCreateRepo(false);
      await loadRepositories();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al crear repositorio');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadFiles = async () => {
    if (!selectedRepo) {
      setMessage('Selecciona un repositorio');
      return;
    }

    if (files.length === 0) {
      setMessage('No hay archivos para subir');
      return;
    }

    try {
      setIsLoading(true);
      const results = await uploadFilesToRepository(selectedRepo, files);
      
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      setMessage(`✅ ${successful} archivo(s) subido(s)${failed > 0 ? `, ❌ ${failed} fallido(s)` : ''}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error al subir archivos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="github-panel">
      <div className="github-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaGithub style={{ color: 'var(--maya-primary)', fontSize: '1.5rem' }} />
          <h3>GitHub Integration</h3>
        </div>
        <button onClick={onClose} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <div className="github-panel-content">
        {!isAuthenticated ? (
          <div className="github-auth">
            <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              Para subir archivos a GitHub, necesitas un Personal Access Token.
            </p>
            <a 
              href="https://github.com/settings/tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'var(--maya-primary)', marginBottom: '1rem', display: 'inline-block' }}
            >
              Crear token en GitHub →
            </a>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="password"
                placeholder="Personal Access Token"
                value={token}
                onChange={(e) => setTokenInput(e.target.value)}
                className="chat-input"
                style={{ flex: 1 }}
              />
              <button onClick={handleAuthenticate} className="button-primary">
                <FaKey /> Autenticar
              </button>
            </div>
          </div>
        ) : (
          <div className="github-authenticated">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--maya-primary)' }}>✓ Autenticado</span>
              <button onClick={handleLogout} className="button-secondary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                Cerrar sesión
              </button>
            </div>

            {!showCreateRepo ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Seleccionar repositorio:
                  </label>
                  <select
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    className="chat-input"
                    disabled={isLoading}
                  >
                    <option value="">-- Selecciona un repositorio --</option>
                    {repositories.map((repo) => (
                      <option key={repo.name} value={repo.name}>
                        {repo.name} {repo.private ? '🔒' : '🌐'}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button 
                    onClick={handleUploadFiles} 
                    className="button-primary"
                    disabled={isLoading || !selectedRepo || files.length === 0}
                    style={{ flex: 1 }}
                  >
                    <FaUpload /> Subir {files.length} archivo(s)
                  </button>
                  <button 
                    onClick={() => setShowCreateRepo(true)} 
                    className="button-secondary"
                  >
                    <FaPlus /> Nuevo Repo
                  </button>
                </div>
              </>
            ) : (
              <div className="create-repo-form">
                <h4 style={{ marginBottom: '1rem' }}>Crear Nuevo Repositorio</h4>
                <input
                  type="text"
                  placeholder="Nombre del repositorio"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="chat-input"
                  style={{ marginBottom: '0.5rem' }}
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  className="chat-input"
                  rows={3}
                  style={{ marginBottom: '0.5rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleCreateRepo} className="button-primary" disabled={isLoading}>
                    <FaPlus /> Crear
                  </button>
                  <button onClick={() => setShowCreateRepo(false)} className="button-secondary">
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className="github-message" style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            backgroundColor: 'rgba(99, 102, 241, 0.2)', 
            borderRadius: '0.5rem',
            color: 'white'
          }}>
            {message}
          </div>
        )}

        {isLoading && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div className="loader">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubPanel;
