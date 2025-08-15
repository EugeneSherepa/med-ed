import './StepTwoHeader.scss';

export const StepTwoHeader = () => {
  return (
    <div className="steptwo-header">
      <div className="page-width">
        <h1 className="steptwo-header-title">Підготовка до крок-2</h1>
        <div className="steptwo-header-text">
          Ми допомагаємо засвоїти, а не зубрити навчальний матеріал
          <br />
          35 лекцій і 35 практичних занять – це твій шлях до успішного складання
          КРОК 2.
        </div>
        <div className="steptwo-header-tags">
          <div className="steptwo-header-tags-tag">
            <b>ТИ:</b>
            Подаєш заявку на курс
          </div>
          <div className="steptwo-header-tags-tag">
            <b>мИ:</b>
            Проводимо лекції та практичні заняття
          </div>
          <div className="steptwo-header-tags-tag-green">
            <b>Результат:</b>
            Ти складаєш КРОК 2 на високий бал і впевнено крокуєш далі
          </div>
        </div>
      </div>
    </div>
  );
};
