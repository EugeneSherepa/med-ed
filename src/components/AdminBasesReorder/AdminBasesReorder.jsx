import { useState, useEffect } from "react";
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
import "./AdminBasesReorder.scss";

const EXAM_LABELS = { KROK_1: "Крок-1", KROK_2: "Крок-2", KROK_3: "Крок-3" };

const TYPE_TABS = [
  { value: "BASE",    label: "Бази" },
  { value: "AMPS",    label: "АМПС" },
  { value: "BOOKLET", label: "Буклети" },
];

const getTestTitle = (t) => {
  if (t.type === "BASE" || t.type === "LECTURE") return t.title || "Без назви";
  if (t.type === "AMPS") {
    let s = `${t.year} АМПС`;
    if (t.day) s += ` день ${t.day}`;
    if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
    return s;
  }
  let s = `${t.year}`;
  if (t.day) s += ` день ${t.day}`;
  if (t.language) s += ` (${t.language === "en" ? "Eng" : "Укр"})`;
  if (t.variant) s += ` варіант ${t.variant}`;
  return s;
};

const SortableTestItem = ({ test, idx }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: test.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="abr-item">
      <span className="abr-handle" {...attributes} {...listeners}>⠿</span>
      <span className="abr-index">{idx + 1}</span>
      <span className="abr-title">{getTestTitle(test)}</span>
      <span className="abr-meta">
        {EXAM_LABELS[test.examType] ?? test.examType} · {test.category}
      </span>
      <span className={`abr-status ${test.status === "PUBLISHED" ? "published" : "draft"}`}>
        {test.status === "PUBLISHED" ? "Активний" : "Чернетка"}
      </span>
    </div>
  );
};

export const AdminBasesReorder = () => {
  const [testType, setTestType] = useState("BASE");
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [filterExam, setFilterExam] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    setIsLoading(true);
    setIsDirty(false);
    setFilterExam("");
    api
      .get("/tests", { params: { type: testType, limit: 1000 } })
      .then((res) => {
        const all = (res.data.data || res.data).sort(
          (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
        );
        setTests(all);
      })
      .finally(() => setIsLoading(false));
  }, [testType]);

  const visibleTests = filterExam ? tests.filter((t) => t.examType === filterExam) : tests;
  const availableExams = [...new Set(tests.map((t) => t.examType))];

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
      return copy.sort((a, b) => {
        const aO = a._tempOrder ?? Infinity;
        const bO = b._tempOrder ?? Infinity;
        return aO - bO;
      }).map(({ _tempOrder, ...t }) => t);
    });

    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const items = tests.map((t, i) => ({ id: t.id, sortOrder: i }));
      await api.patch("/admin/tests/reorder", { items });
      setTests((prev) => prev.map((t, i) => ({ ...t, sortOrder: i })));
      setIsDirty(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>Порядок тестів</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {availableExams.length > 1 && (
            <select
              className="abr-filter"
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
            >
              <option value="">Всі іспити</option>
              {availableExams.map((e) => (
                <option key={e} value={e}>{EXAM_LABELS[e] ?? e}</option>
              ))}
            </select>
          )}
          {savedMsg && <span className="abr-saved">✓ Збережено</span>}
          <button
            className="button-pink-small"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? "Збереження..." : "Зберегти порядок"}
          </button>
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

      <p className="abr-hint">
        Перетягуйте рядки, щоб змінити порядок. Зміни застосовуються після натискання «Зберегти порядок».
      </p>

      {isLoading ? (
        <div className="abr-loading">Завантаження...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleTests.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="abr-list">
              {visibleTests.map((test, idx) => (
                <SortableTestItem key={test.id} test={test} idx={idx} />
              ))}
              {visibleTests.length === 0 && (
                <div className="abr-empty">Тестів не знайдено</div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
