import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminCoursesList.scss";

const TYPE_OPTIONS = [
  { value: "PREPARATION", label: "Підготовка до пар" },
  { value: "EXAM", label: "Іспити" },
];

const emptyForm = { title: "", slug: "", type: "PREPARATION", icon: "", color: "#ecf6f9", sortOrder: 0 };

const SortableCourseRow = ({ course, onEdit, onDelete, onNavigate }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td>
        <span className="abr-handle" {...attributes} {...listeners}>⠿</span>
      </td>
      <td>
        {course.icon
          ? <img src={resolveImageUrl(course.icon)} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
          : <span className="text-muted">—</span>
        }
      </td>
      <td style={{ fontWeight: 500 }}>
        <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: course.color, marginRight: 8, border: "1px solid #e5e7eb", verticalAlign: "middle" }} />
        {course.title}
      </td>
      <td className="text-muted">{course.slug}</td>
      <td>{course.type === "PREPARATION" ? "Підготовка" : "Іспити"}</td>
      <td>{course._count?.lectures ?? 0}</td>
      <td style={{ display: "flex", gap: 8 }}>
        <button className="action-btn questions" onClick={() => onNavigate(course.id)}>☰ Лекції</button>
        <button className="action-btn edit" onClick={() => onEdit(course)}>✎ Редагувати</button>
        <button className="action-btn delete" onClick={() => onDelete(course.id)}>✕</button>
      </td>
    </tr>
  );
};

export const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", subtitle: "", confirmText: "", cancelText: "", onConfirm: null });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const fetchCourses = () => {
    api.get("/admin/courses").then((res) => setCourses(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = courses.findIndex((c) => c.id === active.id);
    const newIndex = courses.findIndex((c) => c.id === over.id);
    setCourses(arrayMove(courses, oldIndex, newIndex));
    setIsDirty(true);
  };

  const handleSaveOrder = async () => {
    setIsReordering(true);
    try {
      await api.patch("/admin/courses/reorder", {
        items: courses.map((c, i) => ({ id: c.id, sortOrder: i })),
      });
      setCourses((prev) => prev.map((c, i) => ({ ...c, sortOrder: i })));
      setIsDirty(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } finally {
      setIsReordering(false);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({ title: course.title, slug: course.slug, type: course.type, icon: course.icon || "", color: course.color || "#ecf6f9", sortOrder: course.sortOrder });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await api.patch(`/admin/courses/${editingId}`, formData);
      } else {
        await api.post("/admin/courses", formData);
      }
      fetchCourses();
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Видалити курс?",
      subtitle: "Це також видалить усі лекції цього курсу. Цю дію не можна скасувати.",
      confirmText: "Видалити",
      cancelText: "Скасувати",
      onConfirm: async () => {
        await api.delete(`/admin/courses/${id}`);
        fetchCourses();
        closeModal();
      },
    });
  };

  return (
    <div className="admin-list-container">
      <ConfirmModal isOpen={modalConfig.isOpen} title={modalConfig.title} subtitle={modalConfig.subtitle} confirmText={modalConfig.confirmText} cancelText={modalConfig.cancelText} showIcon={true} onConfirm={modalConfig.onConfirm} onCancel={closeModal} />
      <AdminImagePicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => setFormData((p) => ({ ...p, icon: url }))} />

      <div className="admin-list-header">
        <h2>Курси лекцій</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {savedMsg && <span className="abr-saved">✓ Збережено</span>}
          {isDirty && (
            <button className="btn-cancel" onClick={handleSaveOrder} disabled={isReordering}>
              {isReordering ? "Збереження..." : "↕ Зберегти порядок"}
            </button>
          )}
          <button className="button-pink-small" onClick={handleNew}>+ Новий курс</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-inline-form">
          <h3>{editingId ? "Редагувати курс" : "Новий курс"}</h3>

          <div className="form-grid">
            <div className="form-group">
              <label>Назва курсу *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required placeholder="АНАТОМІЯ" />
            </div>
            <div className="form-group">
              <label>Slug (унікальний) *</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))} required placeholder="anatomy" />
            </div>
            <div className="form-group">
              <label>Тип</label>
              <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Колір картки</label>
              <div className="color-row">
                <input type="color" value={formData.color} onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))} />
                <span>{formData.color}</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Іконка курсу</label>
            <div className="color-row">
              <button type="button" className="img-pick-btn" onClick={() => setPickerOpen(true)}>
                📷 {formData.icon ? "Змінити іконку" : "Додати іконку"}
              </button>
              {formData.icon && (
                <>
                  <img src={resolveImageUrl(formData.icon)} alt="icon" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                  <button type="button" className="img-remove-btn" onClick={() => setFormData((p) => ({ ...p, icon: "" }))}>✕</button>
                </>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="button-pink-small" disabled={isSaving}>{isSaving ? "Збереження..." : editingId ? "Зберегти" : "Створити"}</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Скасувати</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="admin-loading">Завантаження...</div>
      ) : (
        <div className="admin-table-scroll">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={courses.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>Іконка</th>
                    <th>Назва</th>
                    <th>Slug</th>
                    <th>Тип</th>
                    <th>Лекцій</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <SortableCourseRow
                      key={c.id}
                      course={c}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onNavigate={(id) => navigate(`/admin/lectures/${id}`)}
                    />
                  ))}
                  {courses.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Курсів ще немає</td></tr>
                  )}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
