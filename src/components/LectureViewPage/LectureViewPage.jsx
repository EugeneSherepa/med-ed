import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";
import { resolveImageUrl } from "../../utils/imageUrl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "swiper/css";
import "swiper/css/navigation";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "photoswipe/style.css";
import "./LectureViewPage.scss";
import iconCaret from "../../assets/icon-caret-dropdown.svg";
import iconMain from "../../assets/main-dashboard.svg";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const TYPE_LABELS = { PREPARATION: "Підготовка до пар", EXAM: "Іспити" };

const getEmbedUrl = (url) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
};

const SlidesCarousel = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageDataSources, setPageDataSources] = useState([]);
  const canvasRefs = useRef({});
  const resolvedUrl = resolveImageUrl(pdfUrl);

  const renderedCount = pageDataSources.filter(Boolean).length;
  const allPagesReady = numPages !== null && renderedCount === numPages;

  const handlePageRenderSuccess = (index) => {
    const canvas = canvasRefs.current[index];
    if (!canvas) return;
    setPageDataSources((prev) => {
      const next = [...prev];
      next[index] = { src: canvas.toDataURL("image/jpeg", 0.92), width: canvas.width, height: canvas.height };
      return next;
    });
  };

  const openLightbox = async (clickedIndex) => {
    if (!allPagesReady) return;
    const { default: PhotoSwipe } = await import("photoswipe");
    const pswp = new PhotoSwipe({ dataSource: pageDataSources, index: clickedIndex, bgOpacity: 0.9 });
    pswp.init();
  };

  return (
    <Document
      file={resolvedUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      loading={<div className="lvp-pdf-loading">Завантаження конспекту...</div>}
      error={<div className="lvp-pdf-loading">Не вдалося завантажити конспект.</div>}
    >
      {numPages && (
        <>
          {!allPagesReady && (
            <div className="lvp-pdf-progress">
              Підготовка слайдів: {renderedCount} / {numPages}
            </div>
          )}
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={16}
            slidesPerView="auto"
            className="lvp-slides-swiper"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <SwiperSlide key={i} className="lvp-slide">
                <div
                  className={`lvp-slide-link${allPagesReady ? "" : " lvp-slide-loading"}`}
                  onClick={() => openLightbox(i)}
                >
                  <Page
                    pageNumber={i + 1}
                    width={1200}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    canvasRef={(el) => { canvasRefs.current[i] = el; }}
                    onRenderSuccess={() => handlePageRenderSuccess(i)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </Document>
  );
};

export const LectureViewPage = () => {
  const { courseSlug, lectureId } = useParams();
  const navigate = useNavigate();

  const [lecture, setLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/lectures/${lectureId}`)
      .then((res) => setLecture(res.data))
      .catch(() => navigate(`/lectures/${courseSlug}`))
      .finally(() => setIsLoading(false));
  }, [lectureId]);

  if (isLoading)
    return <div className="lvp-loading">Завантаження лекції...</div>;
  if (!lecture) return null;

  const course = lecture.course;
  const typeLabel = TYPE_LABELS[course?.type] ?? "";
  const embedUrl = getEmbedUrl(lecture.videoUrl);

  return (
    <div className="lectures-page">
      <DashboardLeft currentLink="/lectures" />

      <main className="lvp-content">
        <nav className="lcp-breadcrumb">
          <Link to="/lectures">
            <img src={iconMain} alt="" />
          </Link>
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

            {lecture.pdfUrl && (
              <div className="lvp-slides-section">
                <h2 className="lvp-slides-title">Конспект лекції</h2>
                <SlidesCarousel pdfUrl={lecture.pdfUrl} />
              </div>
            )}

            {lecture.pdfUrl && (
              <a
                href={resolveImageUrl(lecture.pdfUrl)}
                download
                className="lvp-download-btn"
                target="_blank"
                rel="noreferrer"
              >
                Завантажити лекцію
              </a>
            )}
          </div>

          {(lecture.questions || lecture.test) && (
            <div className="lvp-sidebar-col">
              {lecture.questions && (
                <aside className="lvp-sidebar">
                  <h3 className="lvp-sidebar-title">Таймкоди до Лекції</h3>
                  <div
                    className="lvp-sidebar-content"
                    dangerouslySetInnerHTML={{ __html: lecture.questions }}
                  />
                </aside>
              )}
              {lecture.test && (
                <button
                  className="lvp-test-btn"
                  onClick={() => navigate(`/test/${lecture.test.id}`)}
                >
                  Пройти тест до лекції
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
