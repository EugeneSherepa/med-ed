import './Bubbles.scss';
import bubbleFirst from '../../assets/bubble-first.svg';
import bubbleSecond from '../../assets/bubble-second.svg';
import bubbleThird from '../../assets/bubble-third.svg';
import bubbleFirstMobile from '../../assets/bubble-first-mobile.svg';
import bubbleSecondMobile from '../../assets/bubble-second-mobile.svg';
import bubbleThirdMobile from '../../assets/bubble-third-mobile.svg';

export const Bubbles = () => {
  return (
    <div className="bubbles">
      <h2 className="page-width bubbles-title">
        Довіряють нам
        <br />
        вже більше 1000 студентів!
      </h2>
      <div className='page-width bubbles-wrapper bubbles-wrapper-desktop'>
        <div className='bubbles-wrapper-first'>
          <img src={bubbleFirst} alt="" />
        </div>
        <div className='bubbles-wrapper-second'>
          <img src={bubbleSecond} alt="" />
        </div>
        <div className='bubbles-wrapper-third'>
          <img src={bubbleThird} alt="" />
        </div>
      </div>
      <div className='bubbles-wrapper bubbles-wrapper-mobile'>
        <div className='bubbles-wrapper-mobile-first'>
          <img src={bubbleFirstMobile} alt="" />
        </div>
        <div className='bubbles-wrapper-mobile-second'>
          <img src={bubbleSecondMobile} alt="" />
        </div>
        <div className='bubbles-wrapper-mobile-third'>
          <img src={bubbleThirdMobile} alt="" />
        </div>
      </div>
    </div>
  );
};
