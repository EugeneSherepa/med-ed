import './AboutCource.scss';
import { TeamComponent } from '../Team/TeamComponent';
import { ReviewsSlider } from '../ReviewsSlider/ReviewsSlider';
import breadcrumbIcon from '../../assets/icon-breadcrumb.svg';
import cardDot from '../../assets/card-dot.svg';
import { useState } from 'react';

export const AboutCource = ({
  image,
  title,
  tags,
  team,
  reviews,
  content,
  cardImage,
  cardTitle,
  cardContent,
  showCard = true,
  showBreadcrumbs = true,
  mpt = 112,
}) => {
  const [activeButton, setActiveButton] = useState(1);

  return (
    <div
      className="about-course"
      style={{
        '--mpt': `${mpt}px`,
      }}
    >
      <div className="page-width">
        {showBreadcrumbs !== false && (
          <div className="about-course-breadcrumbs">
            <div className="about-course-breadcrumbs-item">Іспити</div>
            <div className="about-course-breadcrumbs-item">
              <div className="about-course-breadcrumbs-item-image">
                <img src={breadcrumbIcon} />
              </div>
            </div>
            <div className="about-course-breadcrumbs-item">
              <a href="/step-one">Підготовка до КРОК-1</a>
            </div>
            <div className="about-course-breadcrumbs-item">
              <div className="about-course-breadcrumbs-item-image">
                <img src={breadcrumbIcon} />
              </div>
            </div>
            <div className="about-course-breadcrumbs-item">{title}</div>
          </div>
        )}
        <div className="about-course-wrapper">
          <div className="about-course-wrapper-left">
            <div className="about-course-wrapper-left-hero">
              <img src={image} alt="Course Image" />
            </div>
            <h1 className="about-course-wrapper-left-title">{title}</h1>
            {tags && (
              <div className="about-course-wrapper-left-tags">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="about-course-wrapper-left-tags-tag"
                  >
                    <img src={tag.logo} />
                    {tag.text}
                  </div>
                ))}
              </div>
            )}
            <div className="about-course-wrapper-left-buttons">
              <button
                className={
                  activeButton === 1 ? 'button-primary' : 'button-secondary'
                }
                onClick={() => setActiveButton(1)}
              >
                Про курс
              </button>
              <button
                className={
                  activeButton === 2 ? 'button-primary' : 'button-secondary'
                }
                onClick={() => setActiveButton(2)}
              >
                Викладачі
              </button>
              <button
                className={
                  activeButton === 3 ? 'button-primary' : 'button-secondary'
                }
                onClick={() => setActiveButton(3)}
              >
                Відгуки
              </button>
            </div>
          </div>
          <div className="about-course-wrapper-right">
            {showCard !== false && (
              <div className="about-course-wrapper-right-card">
                <div className="about-course-wrapper-right-card-wrapper">
                  <div className="about-course-wrapper-right-card-dots">
                    <img src={cardDot} />
                    <img src={cardDot} />
                    <img src={cardDot} />
                    <img src={cardDot} />
                    <img src={cardDot} />
                    <img src={cardDot} />
                  </div>
                  <img
                    src={cardImage}
                    className="about-course-wrapper-right-card-image"
                  />
                  <div className="about-course-wrapper-right-card-header">
                    <h5 className="about-course-wrapper-right-card-header-title">
                      Курс {title}
                    </h5>
                  </div>
                  <a href="" className="button-primary">
                    Почати навачання
                  </a>
                  <div className="about-course-wrapper-right-card-content">
                    <h6 className="about-course-wrapper-right-card-content-title">
                      {cardTitle}
                    </h6>
                    <div dangerouslySetInnerHTML={{ __html: cardContent }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="about-course-wrapper-content">
        {activeButton === 2 && (
          <TeamComponent dpt={0} dpb={0} showText={'false'} team={team} />
        )}
        {activeButton === 3 && (
          <ReviewsSlider dpt={0} dpb={0} showtitle={false} reviews={reviews} />
        )}
        {activeButton === 1 && (
          <div className="page-width">
            <div className="about-course-wrapper-content-wrapper">
              <h3 className="about-course-wrapper-content-title">
                {content.first_title}
              </h3>
              <div
                className="about-course-wrapper-content-text about-course-wrapper-content-text-first"
                dangerouslySetInnerHTML={{ __html: content.first_text }}
              />
              <h3 className="about-course-wrapper-content-title">
                {content.second_title}
              </h3>
              <div
                className="about-course-wrapper-content-text"
                dangerouslySetInnerHTML={{ __html: content.second_text }}
              />
              {content.link && (
                <a
                  className="about-course-wrapper-content-text-link"
                  target="_blank"
                  href={content.link}
                >
                  Дивитись весь план курсу
                </a>
              )}
              <h3 className="about-course-wrapper-content-title">
                {content.third_title}
              </h3>
              <div
                className="about-course-wrapper-content-text"
                dangerouslySetInnerHTML={{ __html: content.third_text }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
