import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home/Home';
import { About } from '../pages/About/About';
import { Materials } from '../pages/Materials/Materials';
import { Team } from '../pages/Team/Team';
import { Reviews } from '../pages/Reviews/Reviews';
import { Contact } from '../pages/Contact/Contact';
import { StepOne } from '../pages/StepOne/StepOne';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/team" element={<Team />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/step-one" element={<StepOne />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
