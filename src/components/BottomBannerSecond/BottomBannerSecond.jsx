import './BottomBannerSecond.scss';
import textUnderline from '../../assets/text-marker.svg';
import firstBubble from '../../assets/BottomBannerBubbles/first.svg';
import secondBubble from '../../assets/BottomBannerBubbles/second.svg';
import thirdBubble from '../../assets/BottomBannerBubbles/third.svg';
import forthBubble from '../../assets/BottomBannerBubbles/forth.svg';

export const BottomBannerSecond = () => {
  return (
    <div className="bottombanner-secondwrapper">
      <img src={firstBubble} className="bottombanner-secondwrapper-first" />
      <div className="page-width">
        <div className="bottombanner-secondwrapper-heading-wrapper">
          <h2 className="bottombanner-secondwrapper-heading bottombanner-secondwrapper-heading-desktop">
            <img src={secondBubble} className="bottombanner-secondwrapper-second" />
            IT’s Med Ed{' '}
            <span className="bottombanner-secondwrapper-heading-subheading">
              — це платформа,
              <br />
              створена студентами для студентів
              <div className="bottombanner-secondwrapper-heading-subheading-underline">
                <img src={textUnderline} />
              </div>
            </span>
          </h2>
          <h2 className="bottombanner-secondwrapper-heading bottombanner-secondwrapper-heading-mobile">
            <img src={secondBubble} className="bottombanner-secondwrapper-second" />
            IT’s Med Ed{' '}<br />
            <span className="bottombanner-secondwrapper-heading-subheading">
              — це платформа, створена студентами для студентів
              <div className="bottombanner-secondwrapper-heading-subheading-underline">
                <img src={textUnderline} />
              </div>
            </span>
          </h2>
        </div>
        <div className="bottombanner-secondwrapper-text bottombanner-secondwrapper-text-desktop">
          Ми зробили навчання наочним та простим.
          <br />
          Весь необхідний матеріал в одному місці.
          <br />
          Почни сьогодні!
        </div>
        <div className="bottombanner-secondwrapper-text bottombanner-secondwrapper-text-mobile">
          Ми зробили навчання наочним та простим.
          <br />
          Весь необхідний матеріал в одному місці.
        </div>
        <a href="" className="button-primary">
          Почати навчання
        </a>
        <img src={thirdBubble} className="bottombanner-secondwrapper-third" />
        <img src={forthBubble} className="bottombanner-secondwrapper-forth" />
      </div>
    </div>
  );
};
