import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Creado con <FaHeart style={{ color: 'var(--maya-accent)' }} /> para ayudarte con Python
        </p>
        <p className="footer-text" style={{ marginTop: '0.5rem' }}>
          © {new Date().getFullYear()} Create by Luisfercode@2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;