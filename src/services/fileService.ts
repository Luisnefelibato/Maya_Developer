/**
 * Servicio para manejar la carga y procesamiento de archivos
 */

export interface AttachedFile {
  name: string;
  content: string;
  type: string;
  size: number;
}

/**
 * Lee el contenido de un archivo como texto
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Procesa múltiples archivos y retorna su contenido
 */
export const processFiles = async (files: FileList | File[]): Promise<AttachedFile[]> => {
  const filesArray = Array.from(files);
  const processedFiles: AttachedFile[] = [];
  
  for (const file of filesArray) {
    try {
      const content = await readFileAsText(file);
      processedFiles.push({
        name: file.name,
        content,
        type: file.type,
        size: file.size
      });
    } catch (error) {
      console.error(`Error al procesar ${file.name}:`, error);
    }
  }
  
  return processedFiles;
};

/**
 * Formatea los archivos adjuntos para enviar a Gemini
 */
export const formatFilesForGemini = (files: AttachedFile[]): string => {
  if (files.length === 0) return '';
  
  let formatted = '\n\n**Archivos adjuntos:**\n\n';
  
  files.forEach((file, index) => {
    formatted += `### Archivo ${index + 1}: ${file.name}\n\n`;
    formatted += '```\n';
    formatted += file.content;
    formatted += '\n```\n\n';
  });
  
  return formatted;
};

/**
 * Valida si un archivo es de tipo texto
 */
export const isTextFile = (file: File): boolean => {
  const textExtensions = [
    'txt', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp',
    'cs', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'html', 'css',
    'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'yml', 'md', 'sql',
    'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd', 'r', 'm', 'pl',
    'lua', 'vim', 'dockerfile', 'makefile', 'gitignore', 'env'
  ];
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  return textExtensions.includes(extension || '');
};

/**
 * Valida el tamaño máximo de archivo (5MB por defecto)
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Obtiene un ícono para el tipo de archivo
 */
export const getFileIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    js: '📜',
    jsx: '⚛️',
    ts: '📘',
    tsx: '⚛️',
    py: '🐍',
    java: '☕',
    c: '©️',
    cpp: '©️',
    cs: '🎯',
    php: '🐘',
    rb: '💎',
    go: '🔷',
    rs: '🦀',
    swift: '🦅',
    kt: '🟣',
    html: '🌐',
    css: '🎨',
    scss: '🎨',
    json: '📋',
    xml: '📄',
    yaml: '⚙️',
    yml: '⚙️',
    md: '📝',
    txt: '📄',
    sql: '🗄️',
    sh: '🖥️',
    dockerfile: '🐳',
    makefile: '🔨'
  };
  
  return iconMap[extension || ''] || '📄';
};

/**
 * Formatea el tamaño del archivo para mostrar
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Crea un resumen de los archivos adjuntos para mostrar en el mensaje
 */
export const createFilesSummary = (files: AttachedFile[]): string => {
  if (files.length === 0) return '';
  
  const summary = files.map(file => 
    `📎 ${file.name} (${formatFileSize(file.size)})`
  ).join('\n');
  
  return `\n\n**Archivos adjuntos:**\n${summary}`;
};
