import './Card.scss';
import arrow from '../../assets/icon-arrow-link.svg';
import cardDot from '../../assets/card-dot.svg';
import { Link } from 'react-router-dom';

export const Card = ({ card }) => {
  const { url, image, tag, caption, title, text, start, price } = card;

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
        {tag && (
          <div className="card-image-tag" key={tag}>
            {tag}
          </div>
        )}
      </div>
      <div className="card-information-wrapper">
        <div className="card-information">
          {caption && <div className="card-information-caption">{caption}</div>}
          <div className="card-information-heading">
            <h4 className="card-information-heading-title">{title}</h4>
            {caption && <img src={arrow} />}
          </div>
          <div
            className={`card-information-text ${!caption ? 'no-caption' : ''}`}
          >
            {text}
          </div>
        </div>
        <div className="card-bottom">
          {start && (
            <div className="card-bottom-mentor">
              <div className='card-bottom-mentor-heading'>
                Старт
              </div>
              <div className="card-bottom-mentor-info">
                <div className="card-bottom-mentor-info-position">
                  {start.first}
                </div>
                <div className="card-bottom-mentor-info-name">
                  {start.second}
                </div>
              </div>
            </div>
          )}
          <div className="card-bottom-price">{price}</div>
        </div>
      </div>
      <Link to={url || "/"} className="card-link"></Link>
    </div>
  );
};
