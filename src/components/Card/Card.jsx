import './Card.scss';
import clock from '../../assets/icon-clock.svg';
import arrow from '../../assets/icon-arrow-link.svg';
import cardDot from '../../assets/card-dot.svg';

export const Card = ({ card }) => {
  const { url, image, tags, caption, title, text, mentor, price } = card;

  return (
    <div className="card">
      <div className="card-dots">
        <img src={cardDot} />
        <img src={cardDot} />
        <img src={cardDot} />
        <img src={cardDot} />
        <img src={cardDot} />
        <img src={cardDot} />
      </div>
      <div className="card-image">
        <img src={image} alt={`${title} Фото`} />
        <div className="card-image-tags">
          {Object.values(tags).map((tag) => (
            <div className="card-image-tag" key={tag}>
              <img src={clock} alt="Clock Icon" />
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="card-information">
        <div className="card-information-caption">{caption}</div>
        <div className="card-information-heading">
          <h4 className="card-information-heading-title">{title}</h4>
          <img src={arrow} />
        </div>
        <div className="card-information-text">{text}</div>
      </div>
      <div className="card-bottom">
        {mentor && (
          <div className="card-bottom-mentor">
            <img src={mentor.image} alt={`${mentor.name} Фото`} />
            <div className="card-bottom-mentor-info">
              <div className="card-bottom-mentor-info-position">
                {mentor.position}
              </div>
              <div className="card-bottom-mentor-info-name">{mentor.name}</div>
            </div>
          </div>
        )}
        <div className="card-bottom-price">{price}</div>
      </div>
      <a href={url} className="card-link"></a>
    </div>
  );
};
