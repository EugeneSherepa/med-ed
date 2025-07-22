import './TeamImage.scss';
import tramImage from '../../assets/team.jpg';

export const TeamImage = () => {
  return (
    <div className='team-image-wrapper'>
      <div className="page-width-left">
        <div className="team-image">
          <div className="team-image-left">
            <h4 className="team-image-left-heading">
              Ми ростемо та шукаємо однодумців
            </h4>
            <div className="team-image-left-text">
              IT’S MED ED допомагає майбутнім лікарям впевнено складати іспити.
              Ми створюємо сучасні освітні матеріали, працюємо за інноваційними
              методиками та підтримуємо кожного студента на шляху до його
              професійної мети.
            </div>
            <div className="team-image-left-blocks">
              <div className="team-image-left-blocks-block">
                <div className="team-image-left-blocks-block-title">No. 1</div>
                <div className="team-image-left-blocks-block-text">
                  Гнучкий графік та зручний формат
                </div>
              </div>
              <div className="team-image-left-blocks-block">
                <div className="team-image-left-blocks-block-title">No. 2</div>
                <div className="team-image-left-blocks-block-text">
                  Доступ до сучасних освітніх ресурсів
                </div>
              </div>
            </div>
          </div>
          <div className="team-image-right">
            <img src={tramImage} alt="Our team" />
          </div>
        </div>
      </div>
    </div>
  );
};
