import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaLightbulb, FaRocket } from 'react-icons/fa';
import { FeatureCardProps } from '../types.ts';
import mayaImage from '../assets/maya.png';

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tu asistente <span className="gradient-text">Python</span> con inteligencia artificial
          </h1>
          <p className="hero-description">
            Maya te ayuda a crear, optimizar y depurar código Python. 
            Desde conceptos básicos hasta patrones avanzados de diseño.
          </p>
          <div className="hero-buttons">
            <Link 
              to="/chat" 
              className="button-primary"
            >
              Iniciar conversación
            </Link>
            <a 
              href="#features" 
              className="button-secondary"
            >
              Conocer más
            </a>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={mayaImage} 
            alt="Maya Python Assistant" 
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="features-title gradient-text">
          ¿Cómo puede ayudarte Maya?
        </h2>
        <div className="features-grid">
          <FeatureCard 
            icon={<FaCode />}
            title="Código optimizado" 
            description="Aprende a escribir código Python más eficiente y limpio con las mejores prácticas del sector."
          />
          <FeatureCard 
            icon={<FaLightbulb />}
            title="Explica conceptos" 
            description="Entenderás claramente cómo funcionan las bibliotecas, algoritmos y patrones de diseño."
          />
          <FeatureCard 
            icon={<FaRocket />}
            title="Desarrollo rápido" 
            description="Acelera tu proceso de desarrollo con sugerencias inteligentes y soluciones probadas."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            ¿Listo para mejorar tus habilidades en Python?
          </h2>
          <p className="cta-description">
            Comienza a conversar con Maya y lleva tu código al siguiente nivel.
          </p>
          <Link 
            to="/chat" 
            className="button-primary"
          >
            Chatear con Maya
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;