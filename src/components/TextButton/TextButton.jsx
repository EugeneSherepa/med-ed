import "./TextButton.scss"

export const TextButton = () => {
  return (
    <div className="page-width">
      <div className="text-button">
        <h2 className="text-button-title">
          Приєднуйся до нашої команди
        </h2>
        <div className="text-button-text">
          Стань тим, хто робить медичну освіту якісною, сучасною та зрозумілою!
        </div>
        <a href="" className="button-primary-big">
          Приєднатись
        </a>
      </div>
    </div>
  )
}