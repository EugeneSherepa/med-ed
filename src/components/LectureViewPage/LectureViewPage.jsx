import { useState, useEffect, useRef, useMemo } from "react";
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
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?enablejsapi=1`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  if (url.includes("iframe.mediadelivery.net") && !url.includes("?")) return `${url}?autoplay=false`;
  return url;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const resolvePdfUrl = (url) => {
  if (!url) return url;
  if (url.startsWith("http")) return `${API_URL}/lectures/pdf-proxy?url=${encodeURIComponent(url)}`;
  return resolveImageUrl(url);
};

const parseSeconds = (tc) => {
  const parts = tc.split(":").map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + parts[1];
};

// Parses questions HTML into mixed timecode + plain-text items.
// Timecode items carry a `tcIndex` that matches their position in the timecodes-only list.
const parseMixedContent = (html) => {
  if (!html) return [];
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ");
  const tcRegex = /^(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–]\s*(.+)/;
  const items = [];
  let tcIndex = 0;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(tcRegex);
    if (match) {
      items.push({ type: "timecode", time: match[1], label: match[2].trim(), seconds: parseSeconds(match[1]), tcIndex: tcIndex++ });
    } else {
      items.push({ type: "text", content: trimmed });
    }
  }
  return items;
};

const SlidesCarousel = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageDataSources, setPageDataSources] = useState([]);
  const canvasRefs = useRef({});
  const resolvedUrl = resolvePdfUrl(pdfUrl);

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
          <Swiper modules={[Navigation]} navigation spaceBetween={16} slidesPerView="auto" className="lvp-slides-swiper">
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTimecodeIdx, setActiveTimecodeIdx] = useState(-1);
  const iframeRef = useRef(null);
  const playOriginRef = useRef(null);
  const timecodesRef = useRef(null);
  const tcButtonRefs = useRef([]);
  const seekingRef = useRef(false);
  const seekTimeoutRef = useRef(null);
  // Ref copy of timecodes so event handlers don't need to be recreated on every render
  const timecodesDataRef = useRef([]);

  useEffect(() => {
    api
      .get(`/lectures/${lectureId}`)
      .then((res) => setLecture(res.data))
      .catch(() => navigate(`/lectures/${courseSlug}`))
      .finally(() => setIsLoading(false));
  }, [lectureId]);

  const mixedContent = useMemo(() => parseMixedContent(lecture?.questions), [lecture?.questions]);
  const timecodes = useMemo(() => mixedContent.filter((i) => i.type === "timecode"), [mixedContent]);

  // Keep ref in sync so event-handler closures always see the latest timecodes
  useEffect(() => { timecodesDataRef.current = timecodes; }, [timecodes]);

  // Only re-render when the active timecode index actually changes (not on every timeupdate)
  const applyTime = (t) => {
    const tcs = timecodesDataRef.current;
    let newIdx = -1;
    for (let i = 0; i < tcs.length; i++) {
      if (tcs[i].seconds <= t) newIdx = i;
      else break;
    }
    setActiveTimecodeIdx((prev) => (prev === newIdx ? prev : newIdx));
  };

  // Receive time/state events from embedded players
  useEffect(() => {
    const handler = (e) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!data || typeof data !== "object") return;

        // Bunny player.js protocol
        if (data.context === "player.js") {
          if (data.event === "ready") {
            const iframe = iframeRef.current;
            if (iframe) {
              ["timeupdate", "play", "pause", "seeked"].forEach((ev) => {
                iframe.contentWindow.postMessage(
                  JSON.stringify({ context: "player.js", method: "addEventListener", value: ev }), "*"
                );
              });
            }
          }
          if (data.event === "seeked") {
            seekingRef.current = false;
            clearTimeout(seekTimeoutRef.current);
          }
          if (data.event === "timeupdate" && !seekingRef.current) {
            const raw = data.value;
            const t = typeof raw === "object" ? (raw?.currentTime ?? raw?.seconds) : Number(raw);
            if (!isNaN(t)) {
              playOriginRef.current = { seconds: t, timestamp: Date.now() };
              applyTime(t);
            }
          }
          if (data.event === "play") setIsPlaying(true);
          if (data.event === "pause") setIsPlaying(false);
          return;
        }

        // YouTube infoDelivery
        if (data.event === "infoDelivery") {
          if (data.info?.currentTime != null && !seekingRef.current) {
            const t = Number(data.info.currentTime);
            playOriginRef.current = { seconds: t, timestamp: Date.now() };
            applyTime(t);
          }
          if (data.info?.playerState != null) setIsPlaying(data.info.playerState === 1);
        }
      } catch {}
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Fallback interval for when the player sends no events (e.g. mid-seek, YouTube buffering)
  useEffect(() => {
    if (!isPlaying || !playOriginRef.current) return;
    const id = setInterval(() => {
      if (seekingRef.current || !playOriginRef.current) return;
      const { seconds, timestamp } = playOriginRef.current;
      applyTime(seconds + (Date.now() - timestamp) / 1000);
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    if (iframe.src.includes("youtube.com")) {
      setTimeout(() => {
        iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1 }), "*");
      }, 300);
    }
  };

  const seekTo = (seconds) => {
    seekingRef.current = true;
    clearTimeout(seekTimeoutRef.current);
    seekTimeoutRef.current = setTimeout(() => { seekingRef.current = false; }, 3000);

    playOriginRef.current = { seconds, timestamp: Date.now() };
    setIsPlaying(true);
    applyTime(seconds); // highlight immediately without waiting for player

    const iframe = iframeRef.current;
    if (!iframe) return;
    const { src } = iframe;
    if (src.includes("youtube.com")) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }), "*"
      );
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo" }), "*"
      );
    } else if (src.includes("iframe.mediadelivery.net")) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ context: "player.js", method: "setCurrentTime", value: seconds }), "*"
      );
      iframe.contentWindow.postMessage(
        JSON.stringify({ context: "player.js", method: "play" }), "*"
      );
    }
  };

  useEffect(() => {
    if (activeTimecodeIdx < 0) return;
    tcButtonRefs.current[activeTimecodeIdx]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeTimecodeIdx]);

  if (isLoading) return <div className="lvp-loading">Завантаження лекції...</div>;
  if (!lecture) return null;

  const course = lecture.course;
  const typeLabel = TYPE_LABELS[course?.type] ?? "";
  const embedUrl = getEmbedUrl(lecture.videoUrl);
  const hasSidebar = mixedContent.length > 0 || !!lecture.test;

  return (
    <div className="lectures-page">
      <DashboardLeft currentLink="/lectures" />

      <main className="lvp-content">
        <nav className="lcp-breadcrumb">
          <Link to="/lectures"><img src={iconMain} alt="" /></Link>
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
                  ref={iframeRef}
                  src={embedUrl}
                  title={lecture.title}
                  onLoad={handleIframeLoad}
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
                className="lvp-download-btn"
                target="_blank"
                rel="noreferrer"
              >
                Завантажити лекцію
              </a>
            )}
          </div>

          {hasSidebar && (
            <div className="lvp-sidebar-col">
              {mixedContent.length > 0 && (
                <aside className="lvp-sidebar">
                  <h3 className="lvp-sidebar-title">
                    {timecodes.length > 0 ? "Таймкоди" : "Питання до лекції"}
                  </h3>
                  <div className="lvp-timecodes" ref={timecodesRef}>
                    {mixedContent.map((item, i) =>
                      item.type === "timecode" ? (
                        <button
                          key={i}
                          ref={(el) => { tcButtonRefs.current[item.tcIndex] = el; }}
                          className={`lvp-timecode${item.tcIndex === activeTimecodeIdx ? " lvp-timecode--active" : ""}`}
                          onClick={() => seekTo(item.seconds)}
                        >
                          <span className="lvp-timecode-time">{item.time}</span>
                          <span className="lvp-timecode-label">{item.label}</span>
                        </button>
                      ) : (
                        <p key={i} className="lvp-timecode-text">{item.content}</p>
                      )
                    )}
                  </div>
                </aside>
              )}

              {lecture.test && (
                <button className="lvp-test-btn" onClick={() => navigate(`/test/${lecture.test.id}`)}>
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
