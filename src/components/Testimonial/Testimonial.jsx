import "./Testimonial.scss"

export const Testimonial = ({ testimonial }) => {
  const {image, title, text, author} = testimonial;

  return (
    <div className="testimonial">
      <div className="testimonial-image">
        <img src={image} alt={`Студет(ка) ${author}`} />
      </div>
      <div className="testimonial-information">
        <div className="testimonial-information-wrapper">
          <div className="testimonial-information-wrapper-title">
            {title}
          </div>
          <div className="testimonial-information-wrapper-text">
            {text}
          </div>
          <div className="testimonial-information-wrapper-author">
            {author}
          </div>
        </div>
      </div>
    </div>
  )
}