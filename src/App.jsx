import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Leadership from './pages/Leadership';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Benefactors from './pages/Benefactors';
import Recruitment from './pages/Recruitment';
import CustomForm from './pages/CustomForm';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import Login from './pages/Login';
import DevDashboard from './pages/dev/DevDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AIBot from './components/AIBot';
import { AuthProvider } from './context/AuthContext';
import { hydrate } from './lib/store';

export default function App() {
  useEffect(() => {
    hydrate();
  }, []);
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-black text-gray-200 relative">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/events" element={<Events />} />
              <Route path="/benefactors" element={<Benefactors />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/forms/:formId" element={<CustomForm />} />
              <Route path="/workshops" element={<Workshops />} />
              <Route path="/workshops/:id" element={<WorkshopDetail />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dev/dashboard"
                element={
                  <ProtectedRoute roles={["developer"]}>
                    <DevDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
