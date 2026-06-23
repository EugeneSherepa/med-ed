import { useState, useEffect, useRef } from "react";
import { api } from "../../api";
import { resolveImageUrl } from "../../utils/imageUrl";
import "./AdminImagePicker.scss";

export const AdminImagePicker = ({ isOpen, onClose, onSelect }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [deletingFilename, setDeletingFilename] = useState(null);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/images");
      setImages(res.data);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchImages();
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    try {
      await api.post("/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages();
    } catch {
      // silent
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(resolveImageUrl(url));
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleSelect = (url) => {
    if (onSelect) onSelect(resolveImageUrl(url));
    onClose();
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Видалити ${filename}?`)) return;
    setDeletingFilename(filename);
    try {
      await api.delete(`/admin/images/${filename}`);
      setImages((prev) => prev.filter((img) => img.filename !== filename));
    } catch {
      // silent
    } finally {
      setDeletingFilename(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="img-picker-overlay" onClick={onClose}>
      <div className="img-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="img-picker-header">
          <h3>Менеджер зображень</h3>
          <button className="img-picker-close" onClick={onClose}>✕</button>
        </div>

        {/* Upload section */}
        <div className="img-picker-upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="img-upload-input"
            style={{ display: "none" }}
          />
          <label htmlFor="img-upload-input" className="img-upload-label">
            {uploadPreview
              ? <img src={uploadPreview} alt="preview" className="img-upload-preview" />
              : <span>📁 Оберіть зображення</span>}
          </label>
          {uploadFile && (
            <div className="img-upload-actions">
              <span className="img-upload-name">{uploadFile.name}</span>
              <button
                className="button-pink-small"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Завантаження..." : "↑ Завантажити"}
              </button>
              <button
                className="img-upload-cancel"
                onClick={() => { setUploadFile(null); setUploadPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="img-picker-gallery-header">
          <span>Завантажені зображення ({images.length})</span>
          <button className="img-refresh-btn" onClick={fetchImages} title="Оновити">↻</button>
        </div>

        {isLoading ? (
          <div className="img-picker-loading">Завантаження...</div>
        ) : images.length === 0 ? (
          <div className="img-picker-empty">Зображень ще немає</div>
        ) : (
          <div className="img-picker-gallery">
            {images.map((img) => (
              <div key={img.filename} className="img-picker-item">
                <img
                  src={resolveImageUrl(img.url)}
                  alt={img.filename}
                  className="img-picker-thumb"
                  onClick={() => handleSelect(img.url)}
                  title="Натисніть, щоб використати"
                />
                <div className="img-picker-item-actions">
                  <button
                    className={`img-action-btn copy ${copiedUrl === img.url ? "copied" : ""}`}
                    onClick={() => handleCopy(img.url)}
                    title="Копіювати URL"
                  >
                    {copiedUrl === img.url ? "✓" : "📋"}
                  </button>
                  {onSelect && (
                    <button
                      className="img-action-btn use"
                      onClick={() => handleSelect(img.url)}
                      title="Використати"
                    >
                      ✓ Вставити
                    </button>
                  )}
                  <button
                    className="img-action-btn delete"
                    onClick={() => handleDelete(img.filename)}
                    disabled={deletingFilename === img.filename}
                    title="Видалити"
                  >
                    {deletingFilename === img.filename ? "…" : "✕"}
                  </button>
                </div>
                <div className="img-picker-item-name">{img.filename.slice(0, 20)}…</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
