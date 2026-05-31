import { useState } from "react";
import { api } from "../../api";
import "./ReportModal.scss";

export const ReportModal = ({ isOpen, onClose, questionId, testId }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await api.post("/reports", {
        comment,
        questionId,
        testId
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setComment("");
      }, 2000);
    } catch (error) {
      setSubmitError("Не вдалося надіслати скаргу. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="report-modal">
        {isSuccess ? (
          <div className="success-message">
            <div className="report-modal-title">Дякуємо!</div>
            <p className="report-modal-text">Вашу скаргу надіслано. Ми перевіримо це питання найближчим часом.</p>
          </div>
        ) : (
          <>
            <div className="report-modal-title">Повідомити про помилку</div>
            <p className="report-modal-text">Опишіть, що саме не так із цим питанням:</p>
            <form onSubmit={handleSubmit}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Наприклад: Неправильна відповідь у базі, помилка в тексті..."
                required
              />
              {submitError && (
                <p className="report-modal-error">{submitError}</p>
              )}
              <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-cancel">Скасувати</button>
                <button type="submit" disabled={isSubmitting} className="btn-submit">
                  {isSubmitting ? "Надсилаємо..." : "Надіслати скаргу"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};