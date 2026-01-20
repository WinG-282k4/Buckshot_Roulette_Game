import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuidePage from './pages/GuidePage';
import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';
import TestPage from './pages/TestPage';
import { useCheckSession } from './hooks/useCheckSession';

function AppContent() {
  // Hook để kiểm tra session khi load trang
  useCheckSession();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
