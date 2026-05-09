import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { Booklets } from "../pages/Booklets/Booklets";
import { Bases } from "../pages/Bases/Bases";
import { Admin } from "../pages/Admin/Admin";
import { AdminTestForm } from "../components/AdminTestForm/AdminTestForm";
import { AdminTestsList } from "../components/AdminTestsList/AdminTestsList";
import { PublicOffer } from "../pages/PublicOffer/PublicOffer";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { RoleProtectedRoute } from "../components/RoleProtectedRoute/RoleProtectedRoute";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";
import { CompleteProfile } from "../components/CompleteProfile/CompleteProfile";
import { TestPage } from "../components/TestPage/TestPage";
import { AdminUsersList } from "../components/AdminUsersList/AdminUsersList.jsx";
import { AdminDashboard } from "../components/AdminDashboard/AdminDashboard";
import { AdminQuestionsManager } from "../components/AdminQuestionsManager/AdminQuestionsManager";
import { AdminReportsList } from "../components/AdminReportsList/AdminReportsList";
import { Saved } from "../pages/Saved/Saved";
import { SavedDetail } from "../pages/Saved/SavedDetail";
import { Amps } from "../pages/Amps/Amps";
import { useAuth } from "../context/AuthContext";

const AppRouter = () => {
  const { currentUser, isLoading } = useAuth();

  return (
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
        <Route
          path="/booklets"
          element={
            <ProtectedRoute>
              <Booklets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:testId"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:testId"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bases"
          element={
            <ProtectedRoute>
              <Bases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved/:slug"
          element={
            <ProtectedRoute>
              <SavedDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/amps"
          element={
            <ProtectedRoute>
              <Amps />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Admin currentUser={currentUser} />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="tests" element={<AdminTestsList />} />
          <Route path="reports" element={<AdminReportsList />} />
          <Route path="tests/new" element={<AdminTestForm />} />
          <Route path="tests/:testId/edit" element={<AdminTestForm />} />
          <Route
            path="tests/:testId/questions"
            element={<AdminQuestionsManager />}
          />
          <Route path="users" element={<AdminUsersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
