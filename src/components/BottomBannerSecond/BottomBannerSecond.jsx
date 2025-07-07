import './BottomBannerSecond.scss';
import textUnderline from '../../assets/text-marker.svg';
import firstBubble from '../../assets/BottomBannerBubbles/first.svg';
import secondBubble from '../../assets/BottomBannerBubbles/second.svg';
import thirdBubble from '../../assets/BottomBannerBubbles/third.svg';
import forthBubble from '../../assets/BottomBannerBubbles/forth.svg';

export const BottomBannerSecond = () => {
  return (
    <div className="bottombanner">
      <img src={firstBubble} className="bottombanner-first" />
      <div className="page-width">
        <div className="bottombanner-heading-wrapper">
          <h2 className="bottombanner-heading bottombanner-heading-desktop">
            <img src={secondBubble} className="bottombanner-second" />
            IT’s Med Ed{' '}
            <span className="bottombanner-heading-subheading">
              — це платформа,
              <br />
              створена студентами для студентів
              <div className="bottombanner-heading-subheading-underline">
                <img src={textUnderline} />
              </div>
            </span>
          </h2>
          <h2 className="bottombanner-heading bottombanner-heading-mobile">
            <img src={secondBubble} className="bottombanner-second" />
            IT’s Med Ed{' '}<br />
            <span className="bottombanner-heading-subheading">
              — це платформа, створена студентами для студентів
              <div className="bottombanner-heading-subheading-underline">
                <img src={textUnderline} />
              </div>
            </span>
          </h2>
        </div>
        <div className="bottombanner-text bottombanner-text-desktop">
          Ми зробили навчання наочним та простим.
          <br />
          Весь необхідний матеріал в одному місці.
          <br />
          Почни сьогодні!
        </div>
        <div className="bottombanner-text bottombanner-text-mobile">
          Ми зробили навчання наочним та простим.
          <br />
          Весь необхідний матеріал в одному місці.
        </div>
        <a href="" className="button-primary-big">
          Почати навчання
        </a>
        <img src={thirdBubble} className="bottombanner-third" />
        <img src={forthBubble} className="bottombanner-forth" />
      </div>
    </div>
  );
};
