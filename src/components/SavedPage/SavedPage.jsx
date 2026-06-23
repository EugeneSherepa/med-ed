import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLeft } from "../DashboardLeft/DashboardLeft";
import { api } from "../../api";
import { getTestSlug } from "../../utils/savedSlug";
import "./SavedPage.scss";
import searchIcon from "../../assets/icon-search.svg";
import IconCaret from "../../assets/icon-caret-dropdown-second.svg";
import iconTrash from "../../assets/icon-trash.svg";
import iconFolder from "../../assets/folder.svg";
import iconCaretRight from "../../assets/icon-caret-button.svg";
import iconDoc from "../../assets/icon-doc.svg";

const EXAM_LABELS = { KROK_1: "Крок-1", KROK_2: "Крок-2", KROK_3: "Крок-3" };
const TYPE_LABELS = { BOOKLET: "Буклет", BASE: "База", AMPS: "АМПС", LECTURE: "Лекція" };

const getTestTitle = (test) => {
  if (test.type === "BASE" || test.type === "LECTURE") return test.title;
  if (test.type === "AMPS") {
    let title = `${test.year} АМПС`;
    if (test.day) title += ` день ${test.day}`;
    if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
    return title;
  }
  let title = `${test.year}`;
  if (test.day) title += ` день ${test.day}`;
  if (test.language) title += ` (${test.language === "en" ? "Eng" : "Укр"})`;
  if (test.variant) title += ` варіант ${test.variant}`;
  return title;
};

export const SavedPage = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(true);

  useEffect(() => {
    api
      .get("/saved-questions")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    api
      .get("/folders")
      .then((res) => setFolders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setFoldersLoading(false));

    api
      .get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err))
      .finally(() => setNotesLoading(false));
  }, []);

  const availableExams = [...new Set(groups.map((g) => g.test.examType))];
  const availableCategories = [...new Set(groups.map((g) => g.test.category))];
  const availableTypes = [...new Set(groups.map((g) => g.test.type))];

  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const title = getTestTitle(g.test).toLowerCase();
      if (searchQuery && !title.includes(searchQuery.toLowerCase()))
        return false;
      if (filterExam && g.test.examType !== filterExam) return false;
      if (filterCategory && g.test.category !== filterCategory) return false;
      if (filterType && g.test.type !== filterType) return false;
      return true;
    });
  }, [groups, searchQuery, filterExam, filterCategory, filterType]);

  const handleDeleteGroup = async (e, testId) => {
    e.stopPropagation();
    if (!window.confirm("Видалити всі збережені питання цього тесту?")) return;
    try {
      await api.delete(`/saved-questions/by-test/${testId}`);
      setGroups((prev) => prev.filter((g) => g.test.id !== testId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (test) => {
    navigate(`/saved/${getTestSlug(test)}`);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreating(true);
    try {
      const res = await api.post("/folders", { name: newFolderName.trim() });
      setFolders((prev) => [res.data, ...prev]);
      setNewFolderName("");
      setShowCreateInput(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteFolder = async (e, folderId) => {
    e.stopPropagation();
    if (!window.confirm("Видалити папку?")) return;
    try {
      await api.delete(`/folders/${folderId}`);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameStart = (e, folder) => {
    e.stopPropagation();
    setRenamingId(folder.id);
    setRenameValue(folder.name);
  };

  const handleRenameSubmit = async (e, folderId) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    try {
      await api.patch(`/folders/${folderId}`, { name: renameValue.trim() });
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, name: renameValue.trim() } : f,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setRenamingId(null);
    }
  };

  const handleDeleteNote = async (e, questionId) => {
    e.stopPropagation();
    if (!window.confirm("Видалити нотатку?")) return;
    try {
      await api.put(`/notes/${questionId}`, { content: "" });
      setNotes((prev) => prev.filter((n) => n.questionId !== questionId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="saved-page">
      <DashboardLeft
        currentLink="/saved"
        showMobileSearch={true}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Пошук серед збережених..."
      />

      <main className="saved-page__content">
        <section>
          <h2 className="saved-section-title">Збережені питання</h2>

          <div className="saved-page__header-actions">
            <div className="saved-page__search desktop-search-only">
              <input
                type="text"
                placeholder="Пошук серед збережених..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img src={searchIcon} alt="search" className="search-icon" />
            </div>

            <div className="saved-page__filters">
              <div className="select-wrapper">
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                >
                  <option value="">Усі іспити</option>
                  {availableExams.map((e) => (
                    <option key={e} value={e}>
                      {EXAM_LABELS[e] ?? e}
                    </option>
                  ))}
                </select>
                <img src={IconCaret} alt="" className="select-caret" />
              </div>
              <div className="select-wrapper">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Усі категорії</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <img src={IconCaret} alt="" className="select-caret" />
              </div>
              <div className="select-wrapper">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="">Тип</option>
                  {availableTypes.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t] ?? t}
                    </option>
                  ))}
                </select>
                <img src={IconCaret} alt="" className="select-caret" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="saved-state-msg">Завантаження...</div>
          ) : filteredGroups.length === 0 ? (
            <div className="saved-state-msg">
              Поки порожньо.
              <br />
              Збережи те, до чого хочеш повернутися — ми все запам'ятаємо 📌
            </div>
          ) : (
            <div className="saved-page__list">
              {filteredGroups.map((g) => (
                <div
                  key={g.test.id}
                  className="saved-card"
                  onClick={() => handleCardClick(g.test)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleCardClick(g.test)
                  }
                >
                  <div className="saved-card__left">
                    <div className="saved-card__title">
                      {getTestTitle(g.test)}
                    </div>
                    <div className="saved-card__subtitle">
                      кількість збережених питань: {g.questions.length}
                    </div>
                  </div>
                  <div className="saved-card__actions">
                    <button
                      className="saved-card__delete-btn"
                      onClick={(e) => handleDeleteGroup(e, g.test.id)}
                      title="Видалити групу"
                    >
                      <img src={iconTrash} alt="Видалити" />
                    </button>
                    <img
                      src={iconCaretRight}
                      alt=""
                      className="saved-card__chevron"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="saved-folders-section">
          <div className="saved-folders-header">
            <h2 className="saved-section-title">Мої папки</h2>
            {!showCreateInput ? (
              <button
                className="saved-folders-create-btn"
                onClick={() => setShowCreateInput(true)}
              >
                + Створити папку
              </button>
            ) : (
              <form
                className="saved-folders-create-form"
                onSubmit={handleCreateFolder}
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Назва папки..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  maxLength={60}
                />
                <button
                  type="submit"
                  disabled={isCreating || !newFolderName.trim()}
                >
                  {isCreating ? "..." : "Зберегти"}
                </button>
                <button
                  type="button"
                  className="saved-folders-cancel-btn"
                  onClick={() => {
                    setShowCreateInput(false);
                    setNewFolderName("");
                  }}
                >
                  Скасувати
                </button>
              </form>
            )}
          </div>

          {foldersLoading ? (
            <div className="saved-state-msg saved-state-msg--small">
              Завантаження...
            </div>
          ) : folders.length === 0 && !showCreateInput ? (
            <div className="saved-state-msg saved-state-msg--small">
              Поки немає папок. Створи першу, щоб організувати свої тести!
            </div>
          ) : (
            <div className="saved-folders-list">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="saved-folder-card"
                  onClick={() =>
                    renamingId !== folder.id &&
                    navigate(`/saved/folder/${folder.id}`)
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    renamingId !== folder.id &&
                    navigate(`/saved/folder/${folder.id}`)
                  }
                >
                  <div className="saved-folder-card__icon">
                    <img src={iconFolder} alt="" />
                  </div>
                  <div className="saved-folder-card__body">
                    {renamingId === folder.id ? (
                      <form
                        className="saved-folder-rename-form"
                        onSubmit={(e) => handleRenameSubmit(e, folder.id)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          maxLength={60}
                        />
                        <button type="submit">Зберегти</button>
                      </form>
                    ) : (
                      <>
                        <div className="saved-folder-card__name">
                          {folder.name}
                        </div>
                        <div className="saved-folder-card__count">
                          {folder._count?.questions ?? 0}{" "}
                          {folder._count?.questions === 1 ? "питання" : "питань"}
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className="saved-folder-card__actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="saved-folder-card__action-btn"
                      title="Перейменувати"
                      onClick={(e) => handleRenameStart(e, folder)}
                    >
                      ✎
                    </button>
                    <button
                      className="saved-folder-card__action-btn saved-folder-card__action-btn--delete"
                      title="Видалити"
                      onClick={(e) => handleDeleteFolder(e, folder.id)}
                    >
                      <img src={iconTrash} alt="Видалити" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
