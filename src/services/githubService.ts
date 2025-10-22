import axios from 'axios';
import { GeneratedFile } from '../types';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'Luisnefelibato';
const GITHUB_API_URL = 'https://api.github.com';

// Nota: Para operaciones de escritura necesitarás un Personal Access Token
// Por seguridad, esto debería manejarse a través de un backend
let GITHUB_TOKEN: string | null = null;

/**
 * Configura el token de GitHub para operaciones autenticadas
 */
export const setGitHubToken = (token: string): void => {
  GITHUB_TOKEN = token;
  localStorage.setItem('github_token', token);
};

/**
 * Obtiene el token de GitHub desde localStorage
 */
export const getGitHubToken = (): string | null => {
  if (!GITHUB_TOKEN) {
    GITHUB_TOKEN = localStorage.getItem('github_token');
  }
  return GITHUB_TOKEN;
};

/**
 * Elimina el token de GitHub
 */
export const clearGitHubToken = (): void => {
  GITHUB_TOKEN = null;
  localStorage.removeItem('github_token');
};

/**
 * Verifica si hay un token configurado
 */
export const hasGitHubToken = (): boolean => {
  return !!getGitHubToken();
};

/**
 * Obtiene los headers para peticiones autenticadas
 */
const getAuthHeaders = () => {
  const token = getGitHubToken();
  return {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': token ? `token ${token}` : undefined
  };
};

/**
 * Lista los repositorios del usuario
 */
export const listRepositories = async (username: string = GITHUB_USERNAME) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/users/${username}/repos`,
      {
        headers: getAuthHeaders(),
        params: {
          sort: 'updated',
          per_page: 30
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al listar repositorios:', error);
    throw new Error('No se pudieron obtener los repositorios');
  }
};

/**
 * Obtiene información de un repositorio específico
 */
export const getRepository = async (repoName: string, username: string = GITHUB_USERNAME) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${username}/${repoName}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener repositorio:', error);
    throw new Error('No se pudo obtener el repositorio');
  }
};

/**
 * Crea un nuevo repositorio
 * Requiere autenticación
 */
export const createRepository = async (
  name: string,
  description: string,
  isPrivate: boolean = false
) => {
  if (!hasGitHubToken()) {
    throw new Error('Se requiere autenticación para crear repositorios');
  }

  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/user/repos`,
      {
        name,
        description,
        private: isPrivate,
        auto_init: true
      },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear repositorio:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 422) {
        throw new Error('El repositorio ya existe o el nombre no es válido');
      }
      if (error.response?.status === 401) {
        throw new Error('Token de autenticación inválido');
      }
    }
    throw new Error('No se pudo crear el repositorio');
  }
};

/**
 * Obtiene el contenido de un archivo en un repositorio
 */
export const getFileContent = async (
  repoName: string,
  filePath: string,
  username: string = GITHUB_USERNAME
) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/contents/${filePath}`,
      { headers: getAuthHeaders() }
    );
    
    // El contenido viene en base64
    const content = atob(response.data.content);
    return {
      content,
      sha: response.data.sha,
      ...response.data
    };
  } catch (error) {
    console.error('Error al obtener archivo:', error);
    throw new Error('No se pudo obtener el archivo');
  }
};

/**
 * Crea o actualiza un archivo en un repositorio
 * Requiere autenticación
 */
export const createOrUpdateFile = async (
  repoName: string,
  filePath: string,
  content: string,
  commitMessage: string,
  sha?: string,
  username: string = GITHUB_USERNAME
) => {
  if (!hasGitHubToken()) {
    throw new Error('Se requiere autenticación para crear/actualizar archivos');
  }

  try {
    // Codificar contenido en base64
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    const response = await axios.put(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/contents/${filePath}`,
      {
        message: commitMessage,
        content: encodedContent,
        sha: sha // Solo necesario para actualizaciones
      },
      { headers: getAuthHeaders() }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error al crear/actualizar archivo:', error);
    throw new Error('No se pudo crear/actualizar el archivo');
  }
};

/**
 * Sube múltiples archivos generados a un repositorio
 */
export const uploadFilesToRepository = async (
  repoName: string,
  files: GeneratedFile[],
  username: string = GITHUB_USERNAME
) => {
  if (!hasGitHubToken()) {
    throw new Error('Se requiere autenticación para subir archivos');
  }

  const results = [];
  
  for (const file of files) {
    try {
      const result = await createOrUpdateFile(
        repoName,
        file.name,
        file.content,
        `Add ${file.name} - Generated by Maya`,
        undefined,
        username
      );
      results.push({ file: file.name, success: true, data: result });
    } catch (error) {
      results.push({ file: file.name, success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
  }
  
  return results;
};

/**
 * Obtiene la estructura de archivos de un repositorio
 */
export const getRepositoryTree = async (
  repoName: string,
  username: string = GITHUB_USERNAME
) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/git/trees/main?recursive=1`,
      { headers: getAuthHeaders() }
    );
    return response.data.tree;
  } catch (error) {
    console.error('Error al obtener árbol de repositorio:', error);
    throw new Error('No se pudo obtener la estructura del repositorio');
  }
};

/**
 * Crea un fork de un repositorio
 */
export const forkRepository = async (
  owner: string,
  repoName: string
) => {
  if (!hasGitHubToken()) {
    throw new Error('Se requiere autenticación para hacer fork');
  }

  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/repos/${owner}/${repoName}/forks`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al hacer fork:', error);
    throw new Error('No se pudo hacer fork del repositorio');
  }
};

/**
 * Lista las issues de un repositorio
 */
export const listIssues = async (
  repoName: string,
  username: string = GITHUB_USERNAME
) => {
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/issues`,
      {
        headers: getAuthHeaders(),
        params: {
          state: 'open',
          per_page: 30
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al listar issues:', error);
    throw new Error('No se pudieron obtener las issues');
  }
};

/**
 * Crea una nueva issue
 */
export const createIssue = async (
  repoName: string,
  title: string,
  body: string,
  username: string = GITHUB_USERNAME
) => {
  if (!hasGitHubToken()) {
    throw new Error('Se requiere autenticación para crear issues');
  }

  try {
    const response = await axios.post(
      `${GITHUB_API_URL}/repos/${username}/${repoName}/issues`,
      { title, body },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear issue:', error);
    throw new Error('No se pudo crear la issue');
  }
};

export { GITHUB_USERNAME };
