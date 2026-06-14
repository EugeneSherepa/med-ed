import { useState, useEffect } from "react";
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

const emptyLecture = { title: "", videoUrl: "", semester: 1, questions: "", pdfUrl: "" };

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

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", subtitle: "", confirmText: "", cancelText: "", onConfirm: null });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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
    setShowForm(true);
  };

  const handleEdit = (lec) => {
    setEditingId(lec.id);
    setFormData({ title: lec.title, videoUrl: lec.videoUrl || "", semester: lec.semester, questions: lec.questions || "", pdfUrl: lec.pdfUrl || "" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData, order: lectures.length };
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
      <ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.title} subtitle={modalConfig.subtitle} confirmText={modalConfig.confirmText} cancelText={modalConfig.cancelText} showIcon={true} onConfirm={modalConfig.onConfirm} onCancel={closeModal} />

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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={lectures.map((l) => l.id)} strategy={verticalListSortingStrategy}>
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
            <h3 className="alc-form-title">{editingId ? "Редагування лекції" : "Нова лекція"}</h3>

            <div className="form-group full-width">
              <label>Назва лекції *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required placeholder="Осі і площини тіла людини. Хребці" />
            </div>

            <div className="form-group">
              <label>Семестр</label>
              <input type="number" min={1} value={formData.semester} onChange={(e) => setFormData((p) => ({ ...p, semester: Number(e.target.value) }))} style={{ width: 120 }} />
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
              <label>Конспект лекції (PDF)</label>
              <div className="alc-field-row">
                <label className="alc-upload-btn">
                  {pdfUploading ? "Завантаження..." : "📄 Завантажити PDF"}
                  <input type="file" accept="application/pdf" onChange={handlePdfUpload} style={{ display: "none" }} />
                </label>
                {formData.pdfUrl && (
                  <>
                    <a href={resolveImageUrl(formData.pdfUrl)} target="_blank" rel="noreferrer" className="alc-pdf-link">Переглянути PDF</a>
                    <button type="button" className="img-remove-btn" onClick={() => setFormData((p) => ({ ...p, pdfUrl: "" }))}>✕</button>
                  </>
                )}
              </div>
            </div>

            <div className="alc-form-actions">
              <button type="submit" className="button-pink-small" disabled={isSaving}>{isSaving ? "Збереження..." : editingId ? "Оновити лекцію" : "Створити лекцію"}</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Скасувати</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
