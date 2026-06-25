import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { api } from "../../api";
import { resolveImageUrl } from "../../utils/imageUrl";
import { RichTextarea } from "../RichTextarea/RichTextarea";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminLectureForm.scss";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyLecture = { title: "", videoUrl: "", semester: 1, questions: "", pdfUrl: "", vocabularyUrl: "" };

const SortableLectureItem = ({ lec, idx, isActive, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lec.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`alc-list-item ${isActive ? "active" : ""}`}
      onClick={() => onEdit(lec)}
    >
      <span className="alc-drag-handle" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
        ⠿
      </span>
      <span className="alc-list-num">{idx + 1}</span>
      <div className="alc-list-info">
        <span className="alc-list-title">{lec.title}</span>
        <span className="alc-list-meta">{lec.semester} сем.</span>
      </div>
      <button
        className="alc-delete-btn"
        onClick={(e) => { e.stopPropagation(); onDelete(lec.id); }}
      >
        ✕
      </button>
    </div>
  );
};

export const AdminLectureForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [lectures, setLectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyLecture);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [showPdfPicker, setShowPdfPicker] = useState(false);
  const [pdfLibrary, setPdfLibrary] = useState([]);
  const [pdfLibraryLoading, setPdfLibraryLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoFileRef = useRef(null);
  const [showVideoPicker, setShowVideoPicker] = useState(false);
  const [streamVideos, setStreamVideos] = useState([]);
  const [streamLoading, setStreamLoading] = useState(false);

  const [lectureTest, setLectureTest] = useState(null);
  const [testTitle, setTestTitle] = useState("");
  const [testSaving, setTestSaving] = useState(false);

  const [lecturePostTest, setLecturePostTest] = useState(null);
  const [postTestTitle, setPostTestTitle] = useState("");
  const [postTestSaving, setPostTestSaving] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", subtitle: "", confirmText: "", cancelText: "", onConfirm: null });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const hasAutoSelected = useRef(false);

  const fetchLectures = async () => {
    const [coursesRes, lecturesRes] = await Promise.all([
      api.get("/admin/courses"),
      api.get(`/admin/courses/${courseId}/lectures`),
    ]);
    const course = coursesRes.data.find((c) => c.id === Number(courseId));
    setCourseTitle(course?.title ?? "");
    const lecs = lecturesRes.data;
    setLectures(lecs);
    setIsLoading(false);
    if (!hasAutoSelected.current && lecs.length > 0) {
      hasAutoSelected.current = true;
      const first = lecs[0];
      setEditingId(first.id);
      setFormData({ title: first.title, videoUrl: first.videoUrl || "", semester: first.semester, questions: first.questions || "", pdfUrl: first.pdfUrl || "", vocabularyUrl: first.vocabularyUrl || "" });
      setLectureTest(first.test || null);
      setTestTitle("");
      setLecturePostTest(first.postTest || null);
      setPostTestTitle("");
      setShowForm(true);
    }
  };

  useEffect(() => { fetchLectures(); }, [courseId]);

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = lectures.findIndex((l) => l.id === active.id);
    const newIndex = lectures.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(lectures, oldIndex, newIndex);
    setLectures(reordered);
    await api.patch(`/admin/courses/${courseId}/lectures/reorder`, {
      items: reordered.map((l, i) => ({ id: l.id, order: i })),
    });
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData({ ...emptyLecture });
    setLectureTest(null);
    setTestTitle("");
    setLecturePostTest(null);
    setPostTestTitle("");
    setShowForm(true);
  };

  const handleEdit = (lec) => {
    setEditingId(lec.id);
    setFormData({ title: lec.title, videoUrl: lec.videoUrl || "", semester: lec.semester, questions: lec.questions || "", pdfUrl: lec.pdfUrl || "", vocabularyUrl: lec.vocabularyUrl || "" });
    setLectureTest(lec.test || null);
    setTestTitle("");
    setLecturePostTest(lec.postTest || null);
    setPostTestTitle("");
    setShowForm(true);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/admin/upload/pdf", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFormData((p) => ({ ...p, pdfUrl: res.data.url }));
    } finally {
      setPdfUploading(false);
    }
  };

  const handleOpenPdfPicker = async () => {
    setShowPdfPicker(true);
    if (pdfLibrary.length > 0) return;
    setPdfLibraryLoading(true);
    try {
      const res = await api.get("/admin/pdfs");
      setPdfLibrary(res.data);
    } finally {
      setPdfLibraryLoading(false);
    }
  };

  const isBunnyStreamUrl = (url) => url?.includes("iframe.mediadelivery.net");

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    setVideoProgress(0);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", formData.title || file.name);
    try {
      const res = await api.post("/admin/upload/video", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          setVideoProgress(Math.round((ev.loaded / ev.total) * 100));
        },
      });
      const embedUrl = res.data.url;
      setFormData((p) => ({ ...p, videoUrl: embedUrl }));
      if (editingId) {
        await api.patch(`/admin/lectures/${editingId}`, { videoUrl: embedUrl });
        await fetchLectures();
      }
    } finally {
      setVideoUploading(false);
      setVideoProgress(0);
      if (videoFileRef.current) videoFileRef.current.value = "";
    }
  };

  const handleOpenVideoPicker = async () => {
    setShowVideoPicker(true);
    if (streamVideos.length > 0) return;
    setStreamLoading(true);
    try {
      const res = await api.get("/admin/stream/videos");
      setStreamVideos(res.data);
    } finally {
      setStreamLoading(false);
    }
  };

  const handleSelectStreamVideo = async (video) => {
    setShowVideoPicker(false);
    setFormData((p) => ({ ...p, videoUrl: video.embedUrl }));
    if (editingId) {
      await api.patch(`/admin/lectures/${editingId}`, { videoUrl: video.embedUrl });
      await fetchLectures();
    }
  };

  const handleRemoveVideo = async () => {
    setFormData((p) => ({ ...p, videoUrl: "" }));
    if (editingId) {
      await api.patch(`/admin/lectures/${editingId}`, { videoUrl: "" });
      await fetchLectures();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/lectures/${editingId}`, { ...formData });
      } else {
        const res = await api.post(`/admin/courses/${courseId}/lectures`, { ...formData, order: lectures.length });
        setEditingId(res.data.id);
        setLectureTest(res.data.test || null);
      }
      await fetchLectures();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateTest = async () => {
    setTestSaving(true);
    try {
      const res = await api.post(`/admin/lectures/${editingId}/test`, { title: testTitle });
      setLectureTest(res.data);
      setTestTitle("");
    } finally {
      setTestSaving(false);
    }
  };

  const handleDeleteTest = () => {
    setModalConfig({
      isOpen: true,
      title: "Видалити тест?",
      subtitle: "Це видалить тест та всі питання до нього. Відновити неможливо.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        await api.delete(`/admin/lectures/${editingId}/test`);
        setLectureTest(null);
        closeModal();
      },
    });
  };

  const handleCreatePostTest = async () => {
    setPostTestSaving(true);
    try {
      const res = await api.post(`/admin/lectures/${editingId}/post-test`, { title: postTestTitle });
      setLecturePostTest(res.data);
      setPostTestTitle("");
    } finally {
      setPostTestSaving(false);
    }
  };

  const handleDeletePostTest = () => {
    setModalConfig({
      isOpen: true,
      title: "Видалити текст до лекції?",
      subtitle: "Це видалить тест та всі питання до нього. Відновити неможливо.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        await api.delete(`/admin/lectures/${editingId}/post-test`);
        setLecturePostTest(null);
        closeModal();
      },
    });
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Видалити лекцію?",
      subtitle: "Це видалить лекцію та всі пов'язані дані.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        await api.delete(`/admin/lectures/${id}`);
        await fetchLectures();
        if (editingId === id) setShowForm(false);
        closeModal();
      },
    });
  };

  return (
    <div className="admin-list-container">
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        showIcon={true}
        onConfirm={modalConfig.onConfirm}
        onCancel={closeModal}
      />

      <div className="admin-list-header">
        <div>
          <button
            className="alc-back-btn"
            onClick={() => navigate("/admin/courses")}
          >
            ← Курси
          </button>
          <h2>{courseTitle} — Лекції</h2>
        </div>
        <button className="button-pink-small" onClick={handleNew}>
          + Нова лекція
        </button>
      </div>

      <div className="alc-layout">
        <div className="alc-list-panel">
          {isLoading ? (
            <div className="alc-loading">Завантаження...</div>
          ) : lectures.length === 0 ? (
            <div className="alc-empty">Лекцій ще немає</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={lectures.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="alc-list">
                  {lectures.map((lec, idx) => (
                    <SortableLectureItem
                      key={lec.id}
                      lec={lec}
                      idx={idx}
                      isActive={editingId === lec.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="alc-form">
            <h3 className="alc-form-title">
              {editingId ? "Редагування лекції" : "Нова лекція"}
            </h3>

            <div className="form-group full-width">
              <label>Назва лекції *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                required
                placeholder="Осі і площини тіла людини. Хребці"
              />
            </div>

            <div className="form-group">
              <label>Семестр</label>
              <input
                type="number"
                min={1}
                value={formData.semester}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    semester: Number(e.target.value),
                  }))
                }
                style={{ width: 120 }}
              />
            </div>

            <div className="form-group full-width">
              <label>Відео</label>
              <div className="alc-video-section">
                {isBunnyStreamUrl(formData.videoUrl) ? (
                  <div className="alc-video-bunny-row">
                    <span className="alc-video-badge">✓ Bunny Stream</span>
                    <label
                      className={`alc-upload-btn${videoUploading ? " alc-upload-btn--disabled" : ""}`}
                    >
                      {videoUploading
                        ? videoProgress < 100
                          ? `Завантаження ${videoProgress}%`
                          : "Обробка..."
                        : "Замінити відео"}
                      <input
                        ref={videoFileRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={videoUploading}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      className="alc-upload-btn"
                      onClick={handleOpenVideoPicker}
                      disabled={videoUploading}
                    >
                      📂 З бібліотеки
                    </button>
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={handleRemoveVideo}
                      disabled={videoUploading}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="alc-field-row">
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            videoUrl: e.target.value,
                          }))
                        }
                        placeholder="YouTube / Vimeo URL"
                        style={{ flex: 1 }}
                      />
                      {formData.videoUrl && (
                        <button
                          type="button"
                          className="img-remove-btn"
                          onClick={() =>
                            setFormData((p) => ({ ...p, videoUrl: "" }))
                          }
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="alc-video-or">або</div>
                    <label
                      className={`alc-upload-btn${videoUploading ? " alc-upload-btn--disabled" : ""}`}
                    >
                      {videoUploading
                        ? videoProgress < 100
                          ? `Завантаження ${videoProgress}%`
                          : "Обробка..."
                        : "🎬 Завантажити відео"}
                      <input
                        ref={videoFileRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        disabled={videoUploading}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      className="alc-upload-btn"
                      onClick={handleOpenVideoPicker}
                      disabled={videoUploading}
                    >
                      📂 Вибрати з бібліотеки
                    </button>
                  </>
                )}
                {videoUploading && (
                  <div className="alc-progress-bar">
                    <div
                      className="alc-progress-fill"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Таймкоди: (00:00 - назва таймкоду)</label>
              <RichTextarea
                value={formData.questions}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, questions: e.target.value }))
                }
                rows={5}
                placeholder="<ul><li>Анатомічна номенклатура.</li></ul>"
              />
            </div>

            <div className="form-group full-width">
              <label>Конспект лекції (PDF)</label>
              <div className="alc-field-row">
                <label className="alc-upload-btn">
                  {pdfUploading ? "Завантаження..." : "📄 Завантажити PDF"}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    style={{ display: "none" }}
                  />
                </label>
                <button
                  type="button"
                  className="alc-upload-btn"
                  onClick={handleOpenPdfPicker}
                >
                  📂 З бібліотеки
                </button>
                {formData.pdfUrl && (
                  <>
                    <a
                      href={resolveImageUrl(formData.pdfUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="alc-pdf-link"
                    >
                      Переглянути PDF
                    </a>
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={() => setFormData((p) => ({ ...p, pdfUrl: "" }))}
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Посилання на словник</label>
              <div className="alc-field-row">
                <input
                  type="url"
                  value={formData.vocabularyUrl}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      vocabularyUrl: e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  style={{ flex: 1 }}
                />
                {formData.vocabularyUrl && (
                  <button
                    type="button"
                    className="img-remove-btn"
                    onClick={() =>
                      setFormData((p) => ({ ...p, vocabularyUrl: "" }))
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {editingId && (
              <div className="form-group full-width alc-test-section">
                <label>Тест до лекції</label>
                {lectureTest ? (
                  <div className="alc-test-info">
                    <span className="alc-test-title">
                      📝 {lectureTest.title}
                    </span>
                    <span className="alc-test-count">
                      {lectureTest._count?.questions ?? 0} питань
                    </span>
                    <button
                      type="button"
                      className="action-btn questions"
                      onClick={() =>
                        navigate(`/admin/tests/${lectureTest.id}/questions`)
                      }
                    >
                      ☰
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={handleDeleteTest}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="alc-test-create">
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder={`Лекція: ${formData.title || "..."}`}
                    />
                    <button
                      type="button"
                      className="button-pink-small"
                      onClick={handleCreateTest}
                      disabled={testSaving}
                    >
                      {testSaving ? "Створення..." : "+ Створити тест"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {editingId && (
              <div className="form-group full-width alc-test-section">
                <label>Текст до лекції</label>
                {lecturePostTest ? (
                  <div className="alc-test-info">
                    <span className="alc-test-title">
                      📝 {lecturePostTest.title}
                    </span>
                    <span className="alc-test-count">
                      {lecturePostTest._count?.questions ?? 0} питань
                    </span>
                    <button
                      type="button"
                      className="action-btn questions"
                      onClick={() =>
                        navigate(`/admin/tests/${lecturePostTest.id}/questions`)
                      }
                    >
                      ☰
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={handleDeletePostTest}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="alc-test-create">
                    <input
                      type="text"
                      value={postTestTitle}
                      onChange={(e) => setPostTestTitle(e.target.value)}
                      placeholder={`Текст до лекції: ${formData.title || "..."}`}
                    />
                    <button
                      type="button"
                      className="button-pink-small"
                      onClick={handleCreatePostTest}
                      disabled={postTestSaving}
                    >
                      {postTestSaving ? "Створення..." : "+ Створити тест"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="alc-form-actions">
              <button
                type="submit"
                className="button-pink-small"
                disabled={isSaving}
              >
                {isSaving
                  ? "Збереження..."
                  : editingId
                    ? "Оновити лекцію"
                    : "Створити лекцію"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Скасувати
              </button>
            </div>
          </form>
        )}
      </div>

      {showPdfPicker && (
        <div
          className="alc-picker-overlay"
          onClick={() => setShowPdfPicker(false)}
        >
          <div
            className="alc-picker-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alc-picker-header">
              <h3>PDF бібліотека</h3>
              <button
                type="button"
                className="alc-picker-close"
                onClick={() => setShowPdfPicker(false)}
              >
                ✕
              </button>
            </div>
            {pdfLibraryLoading ? (
              <div className="alc-picker-loading">Завантаження...</div>
            ) : pdfLibrary.length === 0 ? (
              <div className="alc-picker-loading">PDF файли не знайдено</div>
            ) : (
              <div className="alc-pdf-picker-list">
                {pdfLibrary.map((pdf) => (
                  <button
                    key={pdf.filename}
                    type="button"
                    className="alc-pdf-picker-item"
                    onClick={() => {
                      setFormData((p) => ({ ...p, pdfUrl: pdf.url }));
                      setShowPdfPicker(false);
                    }}
                  >
                    <span className="alc-pdf-picker-icon">📄</span>
                    <span className="alc-pdf-picker-name">{pdf.filename}</span>
                    <span className="alc-pdf-picker-size">
                      {(pdf.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showVideoPicker && (
        <div
          className="alc-picker-overlay"
          onClick={() => setShowVideoPicker(false)}
        >
          <div
            className="alc-picker-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alc-picker-header">
              <h3>Відео бібліотека</h3>
              <button
                type="button"
                className="alc-picker-close"
                onClick={() => setShowVideoPicker(false)}
              >
                ✕
              </button>
            </div>
            {streamLoading ? (
              <div className="alc-picker-loading">Завантаження...</div>
            ) : streamVideos.length === 0 ? (
              <div className="alc-picker-loading">Відео не знайдено</div>
            ) : (
              <div className="alc-picker-grid">
                {streamVideos.map((v) => (
                  <button
                    key={v.guid}
                    type="button"
                    className="alc-picker-item"
                    onClick={() => handleSelectStreamVideo(v)}
                  >
                    <img
                      src={`${API_URL}${v.thumbnailUrl}`}
                      alt={v.title}
                      className="alc-picker-thumb"
                    />
                    <span className="alc-picker-title">{v.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
