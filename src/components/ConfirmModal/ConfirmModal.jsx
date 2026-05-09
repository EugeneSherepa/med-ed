import "./ConfirmModal.scss";
import Caution from "../../assets/icon-caution.svg";

export const ConfirmModal = ({
  isOpen,
  title,
  subtitle,
  confirmText = "Підтвердити",
  cancelText = "Скасувати",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div
        className="confirm-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal-icon">
          <img src={Caution} alt="" />
        </div>

        <h3 className="confirm-modal-title">{title}</h3>
        {subtitle && <p className="confirm-modal-subtitle">{subtitle}</p>}

        <div className="confirm-modal-actions">
          {cancelText && (
            <button className="confirm-modal-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="confirm-modal-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
