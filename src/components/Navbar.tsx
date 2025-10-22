import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaRobot } from 'react-icons/fa';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaRobot style={{ color: 'var(--maya-primary)', fontSize: '1.5rem' }} />
          <span className="gradient-text">Maya Full Stack</span>
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Inicio
          </Link>
          <Link to="/chat" className="button-primary">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCode />
              <span>Iniciar Chat</span>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;