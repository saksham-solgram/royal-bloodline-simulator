import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { PlayPage } from './pages/PlayPage'
import { HostPage } from './pages/HostPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<PlayPage />} />
        <Route path="/host" element={<HostPage />} />
      </Routes>
    </BrowserRouter>
  )
}
