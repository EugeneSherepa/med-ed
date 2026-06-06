import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";
import "./LectureCoursePage.scss";
import iconCaret from "../../assets/icon-caret-dropdown.svg";
import iconLock from "../../assets/icon-close-second.svg";

const TYPE_LABELS = { PREPARATION: "Підготовка до пар", EXAM: "Іспити" };

export const LectureCoursePage = () => {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSemester, setFilterSemester] = useState("");

  useEffect(() => {
    api
      .get(`/courses/${courseSlug}`)
      .then((res) => setCourse(res.data))
      .catch(() => navigate("/lectures"))
      .finally(() => setIsLoading(false));
  }, [courseSlug]);

  const lectures = course?.lectures ?? [];
  const semesters = [...new Set(lectures.map((l) => l.semester))].sort((a, b) => a - b);

  const filtered = useMemo(
    () => filterSemester ? lectures.filter((l) => l.semester === Number(filterSemester)) : lectures,
    [lectures, filterSemester],
  );

  if (isLoading) return <div className="lcp-loading">Завантаження...</div>;
  if (!course) return null;

  const typeLabel = TYPE_LABELS[course.type] ?? course.type;

  return (
    <div className="lectures-page">
      <DashboardLeft currentLink="/lectures" />

      <main className="lcp-content">
        <nav className="lcp-breadcrumb">
          <Link to="/lectures">Головна</Link>
          <img src={iconCaret} alt=">" className="lcp-breadcrumb-caret" />
          <Link to={`/lectures?type=${course.type}`}>{typeLabel}</Link>
          <img src={iconCaret} alt=">" className="lcp-breadcrumb-caret" />
          <span>{course.title}</span>
        </nav>

        <div className="lcp-header">
          <h1 className="lcp-title">{course.title}</h1>
          <div className="lcp-progress-row">
            <div className="lcp-progress-bar">
              <div className="lcp-progress-fill" style={{ width: "0%" }} />
            </div>
            <span className="lcp-count">{lectures.length} лекцій</span>
          </div>
        </div>

        <div className="lcp-filters">
          <button
            className={`lcp-filter-btn ${!filterSemester ? "active" : ""}`}
            onClick={() => setFilterSemester("")}
          >
            Всі
          </button>
          {semesters.map((sem) => (
            <button
              key={sem}
              className={`lcp-filter-btn ${filterSemester === String(sem) ? "active" : ""}`}
              onClick={() => setFilterSemester(String(sem))}
            >
              {sem} семестр
            </button>
          ))}
        </div>

        <div className="lcp-list">
          {filtered.map((lecture) => (
            <div
              key={lecture.id}
              className="lcp-lecture-row"
              onClick={() => navigate(`/lectures/${courseSlug}/${lecture.id}`)}
            >
              <div className="lcp-lecture-left">
                <span className="lcp-lecture-title">{lecture.title}</span>
              </div>
              <button className="lcp-lecture-btn">Переглянути</button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="lcp-empty">Лекцій не знайдено</div>
          )}
        </div>
      </main>
    </div>
  );
};
