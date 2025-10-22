import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import ChatPage from './pages/ChatPage.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="gradient-bg">
        <Navbar />
        <main style={{ flex: '1 1 auto' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;