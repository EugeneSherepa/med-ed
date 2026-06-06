import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
import { RichTextarea } from "../RichTextarea/RichTextarea";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminLectureForm.scss";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const emptyLecture = { title: "", videoUrl: "", semester: 1, order: 0, questions: "", pdfUrl: "" };

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
  const [slides, setSlides] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", subtitle: "", confirmText: "", cancelText: "", onConfirm: null });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const fetchLectures = async () => {
    const [coursesRes, lecturesRes] = await Promise.all([
      api.get("/admin/courses"),
      api.get(`/admin/courses/${courseId}/lectures`),
    ]);
    const course = coursesRes.data.find((c) => c.id === Number(courseId));
    setCourseTitle(course?.title ?? "");
    setLectures(lecturesRes.data);
    setIsLoading(false);
  };

  useEffect(() => { fetchLectures(); }, [courseId]);

  const handleNew = () => {
    setEditingId(null);
    setFormData({ ...emptyLecture, order: lectures.length });
    setSlides([]);
    setShowForm(true);
  };

  const handleEdit = async (lec) => {
    setEditingId(lec.id);
    setFormData({ title: lec.title, videoUrl: lec.videoUrl || "", semester: lec.semester, order: lec.order, questions: lec.questions || "", pdfUrl: lec.pdfUrl || "" });
    setSlides((lec.slides ?? []).map((s) => ({ id: s.id, imageUrl: s.imageUrl })));
    setShowForm(true);
  };

  const handleSlideAdd = (url) => {
    setSlides((prev) => [...prev, { imageUrl: url }]);
  };

  const handleSlideRemove = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSlideMoveUp = (index) => {
    if (index === 0) return;
    setSlides((prev) => { const c = [...prev]; [c[index - 1], c[index]] = [c[index], c[index - 1]]; return c; });
  };

  const handleSlideMoveDown = (index) => {
    setSlides((prev) => { if (index >= prev.length - 1) return prev; const c = [...prev]; [c[index], c[index + 1]] = [c[index + 1], c[index]]; return c; });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, slides };
      if (editingId) {
        await api.patch(`/admin/lectures/${editingId}`, payload);
      } else {
        await api.post(`/admin/courses/${courseId}/lectures`, payload);
      }
      await fetchLectures();
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Видалити лекцію?",
      subtitle: "Це видалить лекцію та всі її слайди.",
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
      <ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.title} subtitle={modalConfig.subtitle} confirmText={modalConfig.confirmText} cancelText={modalConfig.cancelText} showIcon={true} onConfirm={modalConfig.onConfirm} onCancel={closeModal} />
      <AdminImagePicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleSlideAdd} />

      <div className="admin-list-header">
        <div>
          <button className="alc-back-btn" onClick={() => navigate("/admin/courses")}>← Курси</button>
          <h2>{courseTitle} — Лекції</h2>
        </div>
        <button className="button-pink-small" onClick={handleNew}>+ Нова лекція</button>
      </div>

      <div className="alc-layout">
        <div className="alc-list-panel">
          {isLoading ? (
            <div className="alc-loading">Завантаження...</div>
          ) : lectures.length === 0 ? (
            <div className="alc-empty">Лекцій ще немає</div>
          ) : (
            <div className="alc-list">
              {lectures.map((lec, idx) => (
                <div key={lec.id} className={`alc-list-item ${editingId === lec.id ? "active" : ""}`} onClick={() => handleEdit(lec)}>
                  <span className="alc-list-num">{idx + 1}</span>
                  <div className="alc-list-info">
                    <span className="alc-list-title">{lec.title}</span>
                    <span className="alc-list-meta">{lec.semester} сем.</span>
                  </div>
                  <button className="alc-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(lec.id); }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="alc-form">
            <h3 className="alc-form-title">{editingId ? "Редагування лекції" : "Нова лекція"}</h3>

            <div className="form-group full-width">
              <label>Назва лекції *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required placeholder="Осі і площини тіла людини. Хребці" />
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <label>Семестр</label>
                <input type="number" min={1} value={formData.semester} onChange={(e) => setFormData((p) => ({ ...p, semester: Number(e.target.value) }))} />
              </div>
              <div className="form-group half-width">
                <label>Порядок</label>
                <input type="number" min={0} value={formData.order} onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Відео URL (YouTube / Vimeo)</label>
              <input type="text" value={formData.videoUrl} onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." />
            </div>

            <div className="form-group full-width">
              <label>Питання лекції (HTML)</label>
              <RichTextarea value={formData.questions} onChange={(e) => setFormData((p) => ({ ...p, questions: e.target.value }))} rows={5} placeholder="<ul><li>Анатомічна номенклатура.</li></ul>" />
            </div>

            <div className="form-group full-width">
              <label>PDF для завантаження</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <label className="alc-upload-btn">
                  {pdfUploading ? "Завантаження..." : "📄 Завантажити PDF"}
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
                </label>
                {formData.pdfUrl && (
                  <>
                    <a href={formData.pdfUrl.startsWith("http") ? formData.pdfUrl : `${API_URL}${formData.pdfUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#1d4ed8" }}>Переглянути PDF</a>
                    <button type="button" className="img-remove-btn" onClick={() => setFormData((p) => ({ ...p, pdfUrl: "" }))}>✕</button>
                  </>
                )}
              </div>
            </div>

            <div className="form-group full-width">
              <label>Слайди конспекту</label>
              <button type="button" className="img-pick-btn" onClick={() => setPickerOpen(true)}>📷 Додати слайд</button>

              {slides.length > 0 && (
                <div className="alc-slides-grid">
                  {slides.map((slide, i) => (
                    <div key={i} className="alc-slide-item">
                      <img src={slide.imageUrl.startsWith("http") ? slide.imageUrl : `${API_URL}${slide.imageUrl}`} alt={`Слайд ${i + 1}`} />
                      <div className="alc-slide-controls">
                        <button type="button" onClick={() => handleSlideMoveUp(i)} disabled={i === 0}>↑</button>
                        <span>{i + 1}</span>
                        <button type="button" onClick={() => handleSlideMoveDown(i)} disabled={i === slides.length - 1}>↓</button>
                        <button type="button" className="alc-slide-delete" onClick={() => handleSlideRemove(i)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="submit" className="button-pink-small" disabled={isSaving}>{isSaving ? "Збереження..." : editingId ? "Оновити лекцію" : "Створити лекцію"}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>Скасувати</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
