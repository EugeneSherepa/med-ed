import './AboutText.scss';
import icon from '../../assets/logo-second.svg';

export const AboutText = () => {
  return (
    <div className="about-text">
      <div className="page-width">
        <h2 className="about-text-heading">Історія створення</h2>
        <div className="about-text-block">
          <div className="about-text-block-title">2020 рік</div>
          <div className="about-text-block-text about-text-block-text-desktop">
            Валерія, тоді ще першокурсниця, зіткнулася з викликом, який знайомий
            кожному студенту-медику: океан інформації, але без чіткого курсу.
            Матеріали розрізнені, наочності бракує, а знання засвоюються важко.
            Але замість того, щоб здатися, вона вирішила
            <br />
            <strong>діяти...</strong>
          </div>
          <div className="about-text-block-text about-text-block-text-mobile">
            Валерія, тоді ще першокурсниця, зіткнулася з викликом, який знайомий
            кожному студенту-медику: океан інформації, але без чіткого курсу.
            Матеріали розрізнені, наочності бракує, а знання засвоюються важко.
            Але замість того, щоб здатися, вона вирішила{'  '}
            <strong>діяти...</strong>
          </div>
          <div className="about-text-block-text-second">
            Валерія почала створювати зручні гайди, структуруючи матеріали, щоб
            допомогти собі та одногрупникам. Ця проста ідея — «зробити складне
            зрозумілим» — стала основою ITS Med.
          </div>
        </div>
      </div>
    </div>
  );
};
