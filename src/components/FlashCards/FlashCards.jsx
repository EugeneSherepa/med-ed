import './FlashCards.scss';
import flashcard from '../../assets/gistology.png';
import heart from '../../assets/heart-circle.png';

export const FlashCards = () => {
  return (
    <div className="page-width flashcards">
      <h3 className="flashcards-title">флеш-картки</h3>
      <div className="flashcards-text">
        Флеш-картки з гістології — це двосторонні картки,
        <br /> де з титульної сторони мікропрепарат, а з іншої — короткий
        конспет до мікропрепарату.
      </div>
      <div className="flashcards-text">
        Ідеально підходять для підготовки до пари,
        <br /> до модуля, іспиту (і навіть для того, щоб згадати нормальну
        гістологію на патоморфології).
      </div>
      <div className="flashcards-wrapper">
        <a
          href="https://drive.google.com/file/d/1iVMrIod-jDoOWqvPFnK8Me4Spk-_lYlj/view?usp=sharing"
          target="_blank"
          className="flashcards-wrapper-photo"
        >
          <img src={flashcard} alt="" />
          <div className="flashcards-wrapper-photo-overlay">переглянути</div>
        </a>
        <div className="flashcards-wrapper-text">
          <div className="flashcards-wrapper-text-item">
            <img src={heart} />
            <div className="flashcards-wrapper-text-item-text">
              124 флеш-картки
            </div>
          </div>
          <div className="flashcards-wrapper-text-item">
            <img src={heart} />
            <div className="flashcards-wrapper-text-item-text">
              практична коробочка
            </div>
          </div>
          <div className="flashcards-wrapper-text-item">
            <img src={heart} />
            <div className="flashcards-wrapper-text-item-text">
              майже до кожної картки
              <br />
              QR-код на лекцію з візуалізацією
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
