import './MaterialsLine.scss';

export const MaterialsLine = () => {
  return (
    <div className="materialsline">
      <div className="materialsline-backrgound">
        <div className="page-width">
          <div className="materialsline-title">
            <h2 className="materialsline-title-big">
              ГОТУЙСЯ
              <br />
              ДО КРОКУ
            </h2>
            <div className="materialsline-title-small">
              З нашими збірниками!
            </div>
            <a
              href="https://t.me/its_meded?text=Привіт!%20Хочу%20замовити%20ваші%20друковані%20матеріали!%20📚%20Розкажіть,%20що%20у%20вас%20є!"
              target="_blank"
              className="button-primary-big materialsline-title-button"
            >
              Замовити
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
