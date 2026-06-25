import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { RoleProtectedRoute } from "../components/RoleProtectedRoute/RoleProtectedRoute";
import { PublicRoute } from "../components/PublicRoute/PublicRoute";

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
import { PublicOffer } from "../pages/PublicOffer/PublicOffer";

import { Login } from "../pages/Login/Login";
import { Registration } from "../pages/Registration/Registration";
import { CompleteProfile } from "../components/CompleteProfile/CompleteProfile";

import { Account } from "../pages/Account/Account";
import { Booklets } from "../pages/Booklets/Booklets";
import { Bases } from "../pages/Bases/Bases";
import { Amps } from "../pages/Amps/Amps";
import { Saved } from "../pages/Saved/Saved";
import { SavedDetail } from "../pages/Saved/SavedDetail";
import { TestPage } from "../components/TestPage/TestPage";
import { FolderDetail } from "../components/FolderDetail/FolderDetail";
import { Lectures } from "../pages/Lectures/Lectures";
import { LectureCoursePage } from "../components/LectureCoursePage/LectureCoursePage";
import { LectureViewPage } from "../components/LectureViewPage/LectureViewPage";
import { SearchPage } from "../components/SearchPage/SearchPage";

const Admin = lazy(() =>
  import("../pages/Admin/Admin").then((m) => ({ default: m.Admin })),
);
const AdminDashboard = lazy(() =>
  import("../components/AdminDashboard/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);
const AdminTestsList = lazy(() =>
  import("../components/AdminTestsList/AdminTestsList").then((m) => ({
    default: m.AdminTestsList,
  })),
);
const AdminTestForm = lazy(() =>
  import("../components/AdminTestForm/AdminTestForm").then((m) => ({
    default: m.AdminTestForm,
  })),
);
const AdminQuestionsManager = lazy(() =>
  import("../components/AdminQuestionsManager/AdminQuestionsManager").then(
    (m) => ({ default: m.AdminQuestionsManager }),
  ),
);
const AdminUsersList = lazy(() =>
  import("../components/AdminUsersList/AdminUsersList").then((m) => ({
    default: m.AdminUsersList,
  })),
);
const AdminUserDetail = lazy(() =>
  import("../components/AdminUserDetail/AdminUserDetail").then((m) => ({
    default: m.AdminUserDetail,
  })),
);
const AdminReportsList = lazy(() =>
  import("../components/AdminReportsList/AdminReportsList").then((m) => ({
    default: m.AdminReportsList,
  })),
);
const AdminTestAnalytics = lazy(() =>
  import("../components/AdminTestAnalytics/AdminTestAnalytics").then((m) => ({
    default: m.AdminTestAnalytics,
  })),
);
const AdminGlobalQuestions = lazy(() =>
  import("../components/AdminGlobalQuestions/AdminGlobalQuestions").then((m) => ({
    default: m.AdminGlobalQuestions,
  })),
);
const AdminCoursesList = lazy(() =>
  import("../components/AdminCoursesList/AdminCoursesList").then((m) => ({
    default: m.AdminCoursesList,
  })),
);
const AdminLectureForm = lazy(() =>
  import("../components/AdminLectureForm/AdminLectureForm").then((m) => ({
    default: m.AdminLectureForm,
  })),
);

const AdminLoader = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      color: "#6b7280",
      fontFamily: "sans-serif",
    }}
  >
    Завантаження...
  </div>
);

const AppRouter = () => {
  const { currentUser, isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing */}
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

        {/* Auth */}
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

        {/* Protected student pages — TEMP: restricted to ADMIN/TEACHER only */}
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
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Account />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/booklets"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Booklets />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/test/:testId"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <TestPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/results/:testId"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <TestPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/bases"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Bases />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/saved"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Saved />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/saved/folder/:folderId"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <FolderDetail />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/saved/:slug"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <SavedDetail />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/amps"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Amps />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <SearchPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/lectures"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Lectures />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/lectures/:courseSlug"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <LectureCoursePage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/lectures/:courseSlug/:lectureId"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <LectureViewPage />
            </RoleProtectedRoute>
          }
        />

        {/* Admin (lazy-loaded — admin-only, large bundle) */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
              <Suspense fallback={<AdminLoader />}>
                <Admin currentUser={currentUser} />
              </Suspense>
            </RoleProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="tests"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminTestsList />
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminReportsList />
              </Suspense>
            }
          />
          <Route
            path="tests/new"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminTestForm />
              </Suspense>
            }
          />
          <Route
            path="tests/:testId/edit"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminTestForm />
              </Suspense>
            }
          />
          <Route
            path="tests/:testId/questions"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminQuestionsManager />
              </Suspense>
            }
          />
          <Route
            path="tests/:testId/analytics"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminTestAnalytics />
              </Suspense>
            }
          />
          <Route
            path="global-questions"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminGlobalQuestions />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminUsersList />
              </Suspense>
            }
          />
          <Route
            path="users/:userId"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminUserDetail />
              </Suspense>
            }
          />
          <Route
            path="courses"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminCoursesList />
              </Suspense>
            }
          />
          <Route
            path="lectures/:courseId"
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminLectureForm />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
