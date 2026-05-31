import { useState, useEffect } from "react";
import { api } from "../../api";
import "./NotePopover.scss";

export const NotePopover = ({ questionId, onClose, onNoteChange }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    api
      .get(`/notes/${questionId}`)
      .then((res) => setContent(res.data?.content ?? ""))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [questionId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put(`/notes/${questionId}`, { content });
      setSavedMsg(content.trim() ? "Збережено ✓" : "Нотатку видалено");
      onNoteChange?.(questionId, content.trim());
      setTimeout(() => setSavedMsg(""), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="note-popover-backdrop" onClick={onClose} />
      <div className="note-popover">
        <div className="note-popover__title">Нотатки</div>
        {isLoading ? (
          <div className="note-popover__loading">Завантаження...</div>
        ) : (
          <>
            <textarea
              className="note-popover__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ваші нотатки до цього питання..."
            />
            <div className="note-popover__footer">
              <span className="note-popover__status">{savedMsg}</span>
              <button
                className="note-popover__save"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "..." : "Зберегти"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
