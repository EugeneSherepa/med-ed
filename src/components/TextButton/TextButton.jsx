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
        <a href="https://t.me/its_meded?text=%D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82,%20%D1%85%D0%BE%D1%87%D1%83%%D0%B4%D0%BE%D1%94%D0%B4%D0%BD%D0%B0%D1%82%D0%B8%D1%81%D1%8C%20%D0%B4%D0%BE%%D0%B2%D0%B0%D1%88%D0%BE%D1%97%20%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D0%B8!" target="_blank" className="button-primary-big">
          Приєднатись
        </a>
      </div>
    </div>
  )
}