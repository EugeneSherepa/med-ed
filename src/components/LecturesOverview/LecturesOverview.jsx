import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { resolveImageUrl } from "../../utils/imageUrl";
import "./LecturesOverview.scss";
import searchIcon from "../../assets/icon-search.svg";
import changeProfile from "../../assets/change-profile.svg";
import imageRobot from "../../assets/photo-robot-lms.png";

const TYPE_TABS = [
  { value: "PREPARATION", label: "Підготовка до пар" },
  { value: "EXAM", label: "Іспити" },
];

export const LecturesOverview = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("type") || "PREPARATION";

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    api
      .get("/courses", { params: { type: activeTab } })
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setIsLoading(false));
  }, [activeTab]);

  const filtered = searchQuery
    ? courses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : courses;

  return (
    <div className="lectures-page">
      <DashboardLeft
        currentLink="/lectures"
        showMobileSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Пошук серед курсів..."
      />

      <main className="lectures-content">
        <div className="lectures-content-left">
          <div className="lectures-topbar">
            <div className="lectures-topbar-left">
              <div className="lectures-topbar-left-top">
                Привіт, бджілко <span>👋</span>
              </div>
              <div className="lectures-topbar-left-bottom">
                Ми поруч на кожному етапі навчання!
              </div>
            </div>
            <div className="lectures-search">
              <input
                type="text"
                placeholder="Пошук серед курсів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img src={searchIcon} alt="search" />
            </div>
          </div>

          <div className="lectures-tabs">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`lectures-tab ${activeTab === tab.value ? "active" : ""}`}
                onClick={() => setSearchParams({ type: tab.value })}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h2 className="lectures-section-title">Мої курси</h2>

          {isLoading ? (
            <div className="lectures-loading">Завантаження курсів...</div>
          ) : filtered.length === 0 ? (
            <div className="lectures-empty">
              <span className="lectures-empty-bee">🐝</span>
              <p>Порожньо як вулик без бджіл.</p>
              <p>Курсів у цьому розділі ще немає.</p>
            </div>
          ) : (
            <div className="lectures-grid">
              {filtered.map((course) => (
                <div
                  key={course.id}
                  className="course-card"
                  style={{ backgroundColor: course.color || "#ecf6f9" }}
                  onClick={() => navigate(`/lectures/${course.slug}`)}
                >
                  {course.icon && (
                    <img
                      src={course.icon}
                      alt={course.title}
                      className="course-card-icon"
                    />
                  )}
                  <h3 className="course-card-title">{course.title}</h3>
                  <div className="course-card-meta">
                    <div className="course-card-progress-bar">
                      <div
                        className="course-card-progress-fill"
                        style={{ width: "0%" }}
                      />
                    </div>
                    <span className="course-card-count">
                      {course._count?.lectures ?? 0} лекцій
                    </span>
                  </div>
                  <button className="course-card-btn">Перейти до курсу</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lectures-content-right">
          <div className="lectures-content-right-header">
            <div className="lectures-content-right-header-title">Профіль</div>
            <Link
              to="/account"
              className="lectures-content-right-header-button"
            >
              <img
                src={changeProfile}
                className="left-panel-links-link-image"
                alt="Account"
              />
            </Link>
          </div>
          <div className="lectures-content-right-profile">
            <img
              src={
                currentUser?.photo
                  ? resolveImageUrl(currentUser.photo)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || "")}&background=random`
              }
              alt="Profile Avatar"
            />
            <div className="lectures-content-right-profile-title">
              {currentUser?.name || ""}
            </div>
            <div className="lectures-content-right-profile-text">
              {[
                currentUser?.course ? `Студент(ка) ${currentUser.course} курсу` : null,
                currentUser?.institution
                  ? currentUser.institution.split(" ").map((w) => w[0].toUpperCase()).join("")
                  : null,
              ].filter(Boolean).join(" ")}
            </div>
          </div>
          <div className="lectures-content-right-bottom">
            <img src={imageRobot} alt="" />
            <div className="lectures-content-right-bottom-text">
              <b>Є питання?</b>
              <br />
              Запитай у нашого бота 🐝
              <br />
              24/7 відповідає на найпоширеніші запитання про курси, оплату та
              навчання.
            </div>
            <a
              href=""
              className="button-pink lectures-content-right-bottom-button"
            >
              Написати
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
