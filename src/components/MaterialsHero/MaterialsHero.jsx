import './MaterialsHero.scss';
import photo from '../../assets/materials-image.webp';

export const MaterialsHero = () => {
  return (
    <div className="materials-hero">
      <div className="page-width">
        <div className="materials-hero-wrapper">
          <img src={photo} alt="Our team photo" />
          <div className="materials-hero-wrapper-text">
            <h1 className="materials-hero-wrapper-text-title">матеріали</h1>
            <div className='materials-hero-wrapper-text-text desktop'>
              Систематизовані матеріали,
              <br />
              <br />
              клінічні кейси та інтерактивні завдання
              <br />
              <br />
              для успішного складання КРОК
            </div>
            <div className='materials-hero-wrapper-text-text mobile'>
              Систематизовані матеріали, клінічні кейси та інтерактивні завдання для успішного складання КРОК
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
