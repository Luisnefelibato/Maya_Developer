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
            Tu desarrolladora <span className="gradient-text">Full Stack Senior</span> con inteligencia artificial
          </h1>
          <p className="hero-description">
            Maya te ayuda a crear aplicaciones completas, desde frontend hasta backend.
            Desarrollo conversacional con generación de código en múltiples lenguajes.
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
            alt="Maya Full Stack Developer Assistant" 
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
            title="Código Full Stack" 
            description="Genera código en JavaScript, TypeScript, Python, PHP, Java, y más. Frontend y Backend integrados."
          />
          <FeatureCard 
            icon={<FaLightbulb />}
            title="Conversación natural" 
            description="Habla con Maya de forma natural. Explícale tu proyecto y ella creará los archivos que necesitas."
          />
          <FeatureCard 
            icon={<FaRocket />}
            title="Descarga inmediata" 
            description="Todos los archivos generados se pueden descargar al instante. Código listo para usar en producción."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">
            ¿Listo para desarrollar tu próximo proyecto?
          </h2>
          <p className="cta-description">
            Comienza a conversar con Maya y crea aplicaciones Full Stack con código de calidad profesional.
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