import { useState, useEffect } from "react";
import { api } from "../../api";
import "./FolderPickerPopover.scss";
import iconFolder from "../../assets/folder.svg";

export const FolderPickerPopover = ({ questionId, onClose }) => {
  const [folders, setFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    api
      .get(`/folders?questionId=${questionId}`)
      .then((res) => {
        setFolders(res.data);
        const preAdded = res.data
          .filter((f) => f.hasQuestion)
          .map((f) => f.id);
        setAddedIds(new Set(preAdded));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [questionId]);

  const handleAdd = async (folderId) => {
    setAdding(folderId);
    try {
      await api.post(`/folders/${folderId}/questions`, { questionId });
      setAddedIds((prev) => new Set(prev).add(folderId));
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (folderId) => {
    setAdding(folderId);
    try {
      await api.delete(`/folders/${folderId}/questions/${questionId}`);
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(folderId);
        return next;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  return (
    <>
      <div className="folder-picker-backdrop" onClick={onClose} />
      <div className="folder-picker-popover">
        <div className="folder-picker-popover__title">Додати до папки</div>
        {isLoading ? (
          <div className="folder-picker-popover__state">Завантаження...</div>
        ) : folders.length === 0 ? (
          <div className="folder-picker-popover__state">Немає папок</div>
        ) : (
          <ul className="folder-picker-popover__list">
            {folders.map((folder) => {
              const added = addedIds.has(folder.id);
              return (
                <li key={folder.id} className="folder-picker-popover__item">
                  <span className="folder-picker-popover__name">
                    <img src={iconFolder} alt="" />
                    {folder.name}
                  </span>
                  <button
                    className={`folder-picker-popover__btn${added ? " folder-picker-popover__btn--added" : ""}`}
                    onClick={() => adding !== folder.id && (added ? handleRemove(folder.id) : handleAdd(folder.id))}
                    disabled={adding === folder.id}
                  >
                    {adding === folder.id ? "..." : added ? "-" : "+"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};
