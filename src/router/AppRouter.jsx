import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { About } from '../pages/About/About';
import { Materials } from '../pages/Materials/Materials';
import { Team } from '../pages/Team/Team';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
