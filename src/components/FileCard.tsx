import React, { useState } from 'react';
import { FaDownload, FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import { GeneratedFile } from '../types';
import { downloadFile, copyFileToClipboard, getFileIcon } from '../services/codeExtractor';

interface FileCardProps {
  file: GeneratedFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyFileToClipboard(file);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleDownload = () => {
    downloadFile(file);
  };

  return (
    <div className="file-card">
      <div className="file-card-header">
        <div className="file-info">
          <span className="file-icon">{getFileIcon(file.extension)}</span>
          <div>
            <h4 className="file-name">{file.name}</h4>
            <span className="file-language">{file.language}</span>
          </div>
        </div>
        <div className="file-actions">
          <button
            onClick={handleCopy}
            className="file-action-btn"
            title="Copiar código"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
          <button
            onClick={handleDownload}
            className="file-action-btn"
            title="Descargar archivo"
          >
            <FaDownload />
          </button>
        </div>
      </div>
      <div className="file-preview">
        <pre>
          <code className={`language-${file.language}`}>
            {file.content.substring(0, 300)}
            {file.content.length > 300 && '...'}
          </code>
        </pre>
      </div>
      <div className="file-footer">
        <FaCode style={{ fontSize: '0.875rem', color: 'var(--maya-primary)' }} />
        <span>{file.content.split('\n').length} líneas</span>
        <span>•</span>
        <span>{file.content.length} caracteres</span>
      </div>
    </div>
  );
};

export default FileCard;
