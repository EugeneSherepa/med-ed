import './LessonInfo.scss';
import textUnderline from '../../assets/text-marker.svg';

export const LessonInfo = ({ title, text, firstSem, secondSem, bottomText, caption }) => {
  return (
    <div className="lessoninfo">
      <div className="page-width">
        <div className="lessoninfo-top">
          <div className="lessoninfo-tag">курс</div>
          <h1 className="lessoninfo-top-title">{title}</h1>
          <div className="lessoninfo-top-text">{text}</div>
        </div>
        <div className="lessoninfo-center">
          <div className="lessoninfo-center-item">
            <div className="lessoninfo-tag-pink">тривалість</div>= кількості
            твоїх тижневих пар
          </div>
          <div className="lessoninfo-center-item">
            <div className="lessoninfo-tag-pink">формат</div>
            індивідуальні уроки та групи
          </div>
        </div>
        <div className="lessoninfo-bottom">
          <h2 className="lessoninfo-bottom-title">Програма</h2>
        </div>
        <div className="lessoninfo-bottom-wrapper">
          <div className="lessoninfo-center-item">
            <div className="lessoninfo-tag-pink">1 семестр</div>
            {firstSem}
          </div>
          <div className="lessoninfo-center-item">
            <div className="lessoninfo-tag-pink">2 семестр</div>
            {secondSem}
          </div>
        </div>
        <div className='lessoninfo-bottom-text'>
          {bottomText}
        </div>
        <div className='lessoninfo-bottom-caption'>
          {caption}
          <div className='lessoninfo-bottom-caption-underline'>
            <img src={textUnderline} />
          </div>
        </div>
      </div>
    </div>
  );
};
