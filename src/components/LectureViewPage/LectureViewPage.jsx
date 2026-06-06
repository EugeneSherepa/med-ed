import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";
import "./LectureViewPage.scss";
import iconCaret from "../../assets/icon-caret-dropdown.svg";
import iconClose from "../../assets/icon-close-second.svg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TYPE_LABELS = { PREPARATION: "Підготовка до пар", EXAM: "Іспити" };

const getEmbedUrl = (url) => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

export const LectureViewPage = () => {
  const { courseSlug, lectureId } = useParams();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomedSlide, setZoomedSlide] = useState(null);

  useEffect(() => {
    api
      .get(`/lectures/${lectureId}`)
      .then((res) => setLecture(res.data))
      .catch(() => navigate(`/lectures/${courseSlug}`))
      .finally(() => setIsLoading(false));
  }, [lectureId]);

  if (isLoading) return <div className="lvp-loading">Завантаження лекції...</div>;
  if (!lecture) return null;

  const course = lecture.course;
  const typeLabel = TYPE_LABELS[course?.type] ?? "";
  const embedUrl = getEmbedUrl(lecture.videoUrl);

  return (
    <div className="lectures-page">
      <DashboardLeft currentLink="/lectures" />

      <main className="lvp-content">
        <nav className="lcp-breadcrumb">
          <Link to="/lectures">Головна</Link>
          <img src={iconCaret} alt=">" className="lcp-breadcrumb-caret" />
          <Link to={`/lectures?type=${course?.type}`}>{typeLabel}</Link>
          <img src={iconCaret} alt=">" className="lcp-breadcrumb-caret" />
          <Link to={`/lectures/${courseSlug}`}>{course?.title}</Link>
        </nav>

        <h1 className="lvp-title">{lecture.title}</h1>

        <div className="lvp-body">
          <div className="lvp-main">
            {embedUrl ? (
              <div className="lvp-video-wrapper">
                <iframe
                  src={embedUrl}
                  title={lecture.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="lvp-no-video">Відео ще не додано</div>
            )}

            {lecture.slides?.length > 0 && (
              <div className="lvp-slides-section">
                <h2 className="lvp-slides-title">Конспект лекції</h2>
                <div className="lvp-slides-carousel">
                  {lecture.slides.map((slide) => (
                    <div
                      key={slide.id}
                      className="lvp-slide"
                      onClick={() => setZoomedSlide(slide.imageUrl)}
                      title="Натисніть для збільшення"
                    >
                      <img
                        src={slide.imageUrl.startsWith("http") ? slide.imageUrl : `${API_URL}${slide.imageUrl}`}
                        alt={`Слайд ${slide.order + 1}`}
                      />
                      <div className="lvp-slide-zoom-hint">🔍</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lecture.pdfUrl && (
              <a
                href={lecture.pdfUrl.startsWith("http") ? lecture.pdfUrl : `${API_URL}${lecture.pdfUrl}`}
                download
                className="lvp-download-btn"
              >
                Завантажити лекцію
              </a>
            )}
          </div>

          {lecture.questions && (
            <aside className="lvp-sidebar">
              <h3 className="lvp-sidebar-title">Питання лекції</h3>
              <div
                className="lvp-sidebar-content"
                dangerouslySetInnerHTML={{ __html: lecture.questions }}
              />
            </aside>
          )}
        </div>
      </main>

      {zoomedSlide && (
        <div className="lvp-zoom-overlay" onClick={() => setZoomedSlide(null)}>
          <button className="lvp-zoom-close" onClick={() => setZoomedSlide(null)}>
            <img src={iconClose} alt="Закрити" />
          </button>
          <img
            src={zoomedSlide.startsWith("http") ? zoomedSlide : `${API_URL}${zoomedSlide}`}
            alt="Збільшений слайд"
            className="lvp-zoom-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
