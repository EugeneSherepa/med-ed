import './AboutIconText.scss';
import icon from '../../assets/logo-second.svg';

export const AboutIconText = () => {
  return (
    <div className="about-icon-text">
      <div className="page-width">
        <h2 className="about-icon-text-heading">
          “ITS Med – це не просто підготовка до іспитів.... <br />
          Це шлях до успіху в медицині з підтримкою та досвідом команди, яка
          вірить у кожного студента”
        </h2>
        <div className="about-icon-text-logo">
          <img src={icon} alt="Логотип 'It`s Med Ed'" />
        </div>
        <div className="about-icon-text-text">
          Наші заняття — це не нудне зубріння, а інтерактивний досвід з
          реальними знаннями та практикою.
          <br />
          Ми створюємо для вас сучасні, адаптовані матеріали, щоб кожна тема
          була не просто вивчена, а засвоєна
        </div>
      </div>
    </div>
  );
};
