import { useState, useEffect, useMemo } from "react";
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
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./AdminTestsList.scss";

const EXAM_LABELS = { KROK_1: "КРОК_1", KROK_2: "КРОК_2", KROK_3: "КРОК_3" };

const TYPE_TABS = [
  { value: "BASE",    label: "Бази" },
  { value: "AMPS",    label: "АМПС" },
  { value: "BOOKLET", label: "Буклети" },
  { value: "LECTURE", label: "Лекції" },
];

const getTestTitle = (test) => {
  if (test.type === "BASE" || test.type === "LECTURE") return test.title || "Без назви";
  if (test.type === "AMPS") {
    let s = `${test.year} АМПС`;
    if (test.language) s += ` (${test.language === "en" ? "Eng" : "Укр"})`;
    return s;
  }
  let s = `${test.year}`;
  if (test.day) s += ` день ${test.day}`;
  if (test.language) s += ` (${test.language === "en" ? "Eng" : "Укр"})`;
  if (test.variant) s += ` варіант ${test.variant}`;
  return s;
};

const SortableRow = ({ test, idx, duplicatingId, onEdit, onQuestions, onAnalytics, onDuplicate, onDelete, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: test.id });

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
      <td className="text-muted text-sm">{idx + 1}</td>
      <td className="test-title">{getTestTitle(test)}</td>
      <td>{test.type === "LECTURE" ? "—" : test.category}</td>
      <td>{test.type === "LECTURE" ? "—" : (EXAM_LABELS[test.examType] ?? test.examType)}</td>
      <td>
        <div className="status-dropdown-wrapper">
          <select
            className={`status-select ${test.status === "PUBLISHED" ? "published" : "draft"}`}
            value={test.status || "DRAFT"}
            onChange={(e) => onStatusChange(test.id, e.target.value)}
          >
            <option value="DRAFT">Чернетка</option>
            <option value="PUBLISHED">Активний</option>
          </select>
        </div>
      </td>
      <td>{test._count?.questions || test.questions?.length || 0}</td>
      <td className="admin-table-actions">
        <button className="action-btn questions" onClick={() => onQuestions(test.id)}>☰ Питання</button>
        <button className="action-btn edit" onClick={() => onEdit(test.id)}>✎ Редагувати</button>
        <button className="action-btn analytics" onClick={() => onAnalytics(test.id)}>📊 Аналітика</button>
        {test.type !== "LECTURE" && (
          <button className="action-btn duplicate" disabled={duplicatingId === test.id} onClick={() => onDuplicate(test.id)}>
            {duplicatingId === test.id ? "…" : "⧉ Дублювати"}
          </button>
        )}
        <button className="action-btn delete" onClick={() => onDelete(test.id)}>✕</button>
      </td>
    </tr>
  );
};

export const AdminTestsList = () => {
  const [testType, setTestType] = useState("BASE");
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const [modalConfig, setModalConfig] = useState({
    isOpen: false, title: "", subtitle: "",
    confirmText: "Підтвердити", cancelText: "Скасувати", onConfirm: () => {},
  });
  const closeModal = () => setModalConfig((p) => ({ ...p, isOpen: false }));

  const showNotification = (title, subtitle) =>
    setModalConfig({ isOpen: true, title, subtitle, confirmText: "Окей", cancelText: "", showIcon: false, onConfirm: closeModal });

  const fetchTests = () => {
    setIsLoading(true);
    setIsDirty(false);
    setFilterExam("");
    setSearchQuery("");
    api.get("/tests", { params: { type: testType, limit: 1000 } })
      .then((res) => {
        const all = (res.data.data || res.data).sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
        setTests(all);
      })
      .catch(() => showNotification("Помилка", "Не вдалося завантажити список тестів."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchTests(); }, [testType]);

  const availableExams = useMemo(() => [...new Set(tests.map((t) => t.examType).filter(Boolean))], [tests]);

  const visibleTests = useMemo(() => {
    let list = tests;
    if (filterExam) list = list.filter((t) => t.examType === filterExam);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) =>
        `${t.title || ""} ${t.year || ""} ${t.category || ""} ${t.examType || ""}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tests, filterExam, searchQuery]);

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const visibleIds = visibleTests.map((t) => t.id);
    const oldIndex = visibleIds.indexOf(active.id);
    const newIndex = visibleIds.indexOf(over.id);
    const reorderedVisible = arrayMove(visibleTests, oldIndex, newIndex);

    setTests((prev) => {
      const copy = [...prev];
      reorderedVisible.forEach((t, i) => {
        const pos = copy.findIndex((x) => x.id === t.id);
        copy[pos] = { ...copy[pos], _tempOrder: i };
      });
      return copy
        .sort((a, b) => (a._tempOrder ?? Infinity) - (b._tempOrder ?? Infinity))
        .map(({ _tempOrder, ...t }) => t);
    });
    setIsDirty(true);
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      await api.patch("/admin/tests/reorder", { items: tests.map((t, i) => ({ id: t.id, sortOrder: i })) });
      setTests((prev) => prev.map((t, i) => ({ ...t, sortOrder: i })));
      setIsDirty(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      title: "Видалити цей тест?",
      subtitle: "Це також видалить усі питання та спроби користувачів! Цю дію не можна скасувати.",
      confirmText: "Видалити", cancelText: "Скасувати",
      onConfirm: async () => {
        try {
          await api.delete(`/tests/${id}`);
          setTests((prev) => prev.filter((t) => t.id !== id));
          showNotification("Видалено", "Тест успішно видалено з бази даних.");
        } catch {
          showNotification("Помилка", "Не вдалося видалити тест. Спробуйте пізніше.");
        }
      },
    });
  };

  const handleDuplicate = async (id) => {
    setDuplicatingId(id);
    try {
      const res = await api.post(`/admin/tests/${id}/duplicate`);
      setTests((prev) => [res.data, ...prev]);
      showNotification("Скопійовано", "Тест продубльовано як чернетку.");
    } catch {
      showNotification("Помилка", "Не вдалося продублювати тест.");
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    try {
      await api.patch(`/tests/${id}`, { status: newStatus });
    } catch {
      showNotification("Помилка", "Не вдалося оновити статус.");
      fetchTests();
    }
  };

  return (
    <div className="admin-list-container">
      <ConfirmModal
        isOpen={modalConfig.isOpen} title={modalConfig.title} subtitle={modalConfig.subtitle}
        confirmText={modalConfig.confirmText} cancelText={modalConfig.cancelText}
        showIcon={modalConfig.showIcon ?? true} onConfirm={modalConfig.onConfirm} onCancel={closeModal}
      />

      <div className="admin-list-header">
        <h2>Управління тестами</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {savedMsg && <span className="abr-saved">✓ Збережено</span>}
          {isDirty && (
            <button className="btn-cancel" onClick={handleSaveOrder} disabled={isSaving}>
              {isSaving ? "Збереження..." : "↕ Зберегти порядок"}
            </button>
          )}
          <button className="button-pink-small" onClick={() => navigate("/admin/tests/new")}>+ Створити тест</button>
        </div>
      </div>

      <div className="abr-tabs">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`abr-tab ${testType === tab.value ? "active" : ""}`}
            onClick={() => setTestType(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="atl-toolbar">
        <div className="admin-search-bar" style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="🔍 Пошук за назвою, роком, категорією..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {availableExams.length > 1 && testType !== "LECTURE" && (
          <select className="abr-filter" value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
            <option value="">Всі іспити</option>
            {availableExams.map((e) => <option key={e} value={e}>{EXAM_LABELS[e] ?? e}</option>)}
          </select>
        )}
      </div>

      {isLoading ? (
        <div className="admin-loading">Завантаження...</div>
      ) : (
        <div className="admin-table-scroll">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={visibleTests.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th style={{ width: 40 }}>#</th>
                    <th>Назва / Рік</th>
                    <th>Спеціальність</th>
                    <th>Іспит</th>
                    <th>Статус</th>
                    <th>Питань</th>
                    <th>Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTests.length === 0 ? (
                    <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Тестів не знайдено</td></tr>
                  ) : (
                    visibleTests.map((test, idx) => (
                      <SortableRow
                        key={test.id}
                        test={test}
                        idx={idx}
                        duplicatingId={duplicatingId}
                        onEdit={(id) => navigate(`/admin/tests/${id}/edit`)}
                        onQuestions={(id) => navigate(`/admin/tests/${id}/questions`)}
                        onAnalytics={(id) => navigate(`/admin/tests/${id}/analytics`)}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))
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
