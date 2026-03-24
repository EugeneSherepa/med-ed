import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { About } from "../pages/About/About";
import { Materials } from "../pages/Materials/Materials";
import { Team } from "../pages/Team/Team";
import { Reviews } from "../pages/Reviews/Reviews";
import { Contact } from "../pages/Contact/Contact";
import { StepOne } from "../pages/StepOne/StepOne";
import { StepTwo } from "../pages/StepTwo/StepTwo";
import { Anatomy } from "../pages/Lessons/Anatomy/Anatomy";
import { Physiology } from "../pages/Lessons/Physiology/Physiology";
import { Biochemistry } from "../pages/Lessons/Biochemistry/Biochemistry";
import { Pathomorphology } from "../pages/Lessons/Pathomorphology/Pathomorphology";
import { Pharmacology } from "../pages/Lessons/Pharmacology/Pharmacology";
import { Medicine } from "../pages/AboutCourse/Medicine/Medicine";
import { Stomatology } from "../pages/AboutCourse/StepOneStomatology/Stomatology";
import { FAQ } from "../pages/FAQ/FAQ";
import { Policy } from "../pages/Policy/Policy";
import { Login } from "../pages/Login/Login";
import { Registration } from "../pages/Registration/Registration";
import { Account } from "../pages/Account/Account";
import { PublicOffer } from "../pages/PublicOffer/PublicOffer";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";
import { CompleteProfile } from "../components/CompleteProfile/CompleteProfile";

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
      <Route path="/step-two" element={<StepTwo />} />
      <Route path="/lessons/anatomy" element={<Anatomy />} />
      <Route path="/lessons/physiology" element={<Physiology />} />
      <Route path="/lessons/biochemistry" element={<Biochemistry />} />
      <Route path="/lessons/pathomorphology" element={<Pathomorphology />} />
      <Route path="/lessons/pharmacology" element={<Pharmacology />} />
      <Route path="/about/medicine" element={<Medicine />} />
      <Route path="/about/stomatology" element={<Stomatology />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/public-offer" element={<PublicOffer />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Registration />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
