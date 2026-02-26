import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Import the new Footer
import HomePage from './pages/HomePage'; 
import KeyboardPage from './pages/KeyboardPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RagaCard from './pages/RagaCard';
import AboutUs from './pages/AboutUs';

function App() {
  return (
    <Router>
      {/* flex flex-col min-h-screen: 
        Ensures the page takes full height and allows the footer to stay at the bottom.
      */}
      <div className="bg-black min-h-screen flex flex-col">
        
        {/* Navbar stays at the top of every page */}
        <Navbar />

        {/* flex-grow: 
          This container will expand to fill all available space, 
          pushing the footer down to the very bottom.
        */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/keyboard" element={<KeyboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/raga" element={<RagaCard />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>

        {/* Footer stays at the bottom of every page */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;