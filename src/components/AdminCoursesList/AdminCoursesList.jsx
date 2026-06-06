import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { AdminImagePicker } from "../AdminImagePicker/AdminImagePicker";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

const TYPE_OPTIONS = [
  { value: "PREPARATION", label: "Підготовка до пар" },
  { value: "EXAM", label: "Іспити" },
];

const emptyForm = { title: "", slug: "", type: "PREPARATION", icon: "", color: "#ecf6f9", sortOrder: 0 };

export const AdminCoursesList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", subtitle: "", confirmText: "", cancelText: "", onConfirm: null });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const fetchCourses = () => {
    api.get("/admin/courses").then((res) => setCourses(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

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
        <button className="button-pink-small" onClick={handleNew}>+ Новий курс</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#f9fafb", padding: 24, borderRadius: 12, marginBottom: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-fixel, sans-serif)", fontSize: 16, color: "#252c3f" }}>
            {editingId ? "Редагувати курс" : "Новий курс"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
              <select value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontFamily: "inherit", fontSize: 14 }}>
                {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Колір картки</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="color" value={formData.color} onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))} style={{ width: 48, height: 36, border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <span style={{ fontFamily: "inherit", fontSize: 13, color: "#6b7280" }}>{formData.color}</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Іконка курсу</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="button" className="img-pick-btn" onClick={() => setPickerOpen(true)}>
                📷 {formData.icon ? "Змінити іконку" : "Додати іконку"}
              </button>
              {formData.icon && (
                <>
                  <img src={formData.icon} alt="icon" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                  <button type="button" className="img-remove-btn" onClick={() => setFormData((p) => ({ ...p, icon: "" }))}>✕</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="button-pink-small" disabled={isSaving}>{isSaving ? "Збереження..." : editingId ? "Зберегти" : "Створити"}</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: "8px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13 }}>Скасувати</button>
          </div>
        </form>
      )}

      {isLoading ? <div style={{ padding: 40, color: "#9ca3af", fontFamily: "inherit" }}>Завантаження...</div> : (
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
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
                <tr key={c.id}>
                  <td>
                    {c.icon ? <img src={c.icon} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} /> : <span style={{ color: "#9ca3af" }}>—</span>}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: c.color, marginRight: 8, border: "1px solid #e5e7eb", verticalAlign: "middle" }} />
                    {c.title}
                  </td>
                  <td className="text-muted">{c.slug}</td>
                  <td>{c.type === "PREPARATION" ? "Підготовка" : "Іспити"}</td>
                  <td>{c._count?.lectures ?? 0}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="action-btn questions" onClick={() => navigate(`/admin/lectures/${c.id}`)}>☰ Лекції</button>
                    <button className="action-btn edit" onClick={() => handleEdit(c)}>✎ Редагувати</button>
                    <button className="action-btn delete" onClick={() => handleDelete(c.id)}>✕</button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Курсів ще немає</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
