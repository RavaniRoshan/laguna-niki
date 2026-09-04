import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OpenSourcePage from './pages/OpenSourcePage';
import LabPage from './pages/LabPage';
import GamesPage from './pages/GamesPage';
import BootLoader from './components/BootLoader';

export default function App() {
  return (
    <BrowserRouter>
      <BootLoader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/opensource" element={<OpenSourcePage />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/games" element={<GamesPage />} />
        {/* Fallback route */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
