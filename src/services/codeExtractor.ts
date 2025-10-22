import { GeneratedFile } from '../types';

/**
 * Mapa de extensiones a lenguajes
 */
const LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  php: 'php',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  java: 'java',
  cs: 'csharp',
  go: 'go',
  rb: 'ruby',
  sql: 'sql',
  json: 'json',
  xml: 'xml',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  sh: 'bash',
  bat: 'batch',
  c: 'c',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  rs: 'rust',
  kt: 'kotlin',
  swift: 'swift',
  dart: 'dart',
  vue: 'vue',
  svelte: 'svelte',
  r: 'r',
  m: 'matlab',
  pl: 'perl',
  lua: 'lua'
};

/**
 * Extrae archivos de código de una respuesta de texto
 * Busca patrones como: ```filename:example.js
 * @param text - Texto que contiene bloques de código
 * @returns Array de archivos generados
 */
export const extractFilesFromText = (text: string): GeneratedFile[] => {
  const files: GeneratedFile[] = [];
  
  // Patrón para detectar bloques de código con filename
  // ```filename:ejemplo.js o ```javascript:ejemplo.js
  const codeBlockPattern = /```(?:filename:|(\w+):)?([^\n]+)\n([\s\S]*?)```/g;
  
  let match;
  while ((match = codeBlockPattern.exec(text)) !== null) {
    const language = match[1] || '';
    const filename = match[2].trim();
    const content = match[3].trim();
    
    // Extraer extensión del nombre de archivo
    const extensionMatch = filename.match(/\.(\w+)$/);
    const extension = extensionMatch ? extensionMatch[1] : 'txt';
    
    // Determinar el lenguaje
    const detectedLanguage = language || LANGUAGE_MAP[extension.toLowerCase()] || extension;
    
    files.push({
      name: filename,
      content: content,
      language: detectedLanguage,
      extension: extension
    });
  }
  
  return files;
};

/**
 * Crea un Blob descargable para un archivo
 * @param file - Archivo generado
 * @returns Blob del archivo
 */
export const createFileBlob = (file: GeneratedFile): Blob => {
  return new Blob([file.content], { type: 'text/plain;charset=utf-8' });
};

/**
 * Descarga un archivo generado
 * @param file - Archivo a descargar
 */
export const downloadFile = (file: GeneratedFile): void => {
  const blob = createFileBlob(file);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Descarga múltiples archivos como ZIP
 * Nota: Requiere librería como JSZip
 * Por ahora, descarga archivos individuales
 */
export const downloadMultipleFiles = (files: GeneratedFile[]): void => {
  files.forEach((file, index) => {
    // Pequeño delay para evitar bloqueos del navegador
    setTimeout(() => {
      downloadFile(file);
    }, index * 300);
  });
};

/**
 * Copia el contenido de un archivo al portapapeles
 * @param file - Archivo a copiar
 */
export const copyFileToClipboard = async (file: GeneratedFile): Promise<void> => {
  try {
    await navigator.clipboard.writeText(file.content);
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    throw new Error('No se pudo copiar al portapapeles');
  }
};

/**
 * Obtiene un icono para un tipo de archivo
 * @param extension - Extensión del archivo
 * @returns Emoji o icono representativo
 */
export const getFileIcon = (extension: string): string => {
  const iconMap: Record<string, string> = {
    js: '📜',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    py: '🐍',
    php: '🐘',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    java: '☕',
    cs: '🎯',
    go: '🔷',
    rb: '💎',
    sql: '🗄️',
    json: '📋',
    xml: '📄',
    yaml: '⚙️',
    yml: '⚙️',
    md: '📝',
    sh: '🖥️',
    txt: '📄',
    vue: '💚',
    svelte: '🧡',
    dart: '🎯',
    rs: '🦀'
  };
  
  return iconMap[extension.toLowerCase()] || '📄';
};

/**
 * Valida el nombre de un archivo
 * @param filename - Nombre del archivo
 * @returns true si es válido
 */
export const isValidFilename = (filename: string): boolean => {
  // Validar que no contenga caracteres prohibidos
  const invalidChars = /[<>:"|?*\x00-\x1f]/g;
  return !invalidChars.test(filename) && filename.length > 0 && filename.length < 255;
};

/**
 * Sanitiza un nombre de archivo
 * @param filename - Nombre del archivo
 * @returns Nombre sanitizado
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[<>:"|?*\x00-\x1f]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 255);
};
