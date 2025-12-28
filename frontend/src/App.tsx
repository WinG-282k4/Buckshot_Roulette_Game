import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import RoomPage from './pages/RoomPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
