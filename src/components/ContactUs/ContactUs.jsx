import "./ContactUs.scss"

export const ContactUs = () => {
  return (
    <div className="contact-us">
      <div className="page-width">
        <h1 className="contact-us-title">Зв’яжіться з нами</h1>
        <div className="contact-us-text">
          Маєш запитання щодо курсів або навчальних матеріалів?
          <br />
          <br />
          Напиши нам, і ми допоможемо знайти найкраще рішення!
        </div>
        <a href="https://t.me/its_meded?text=%D0%9F%D1%80%D0%B8%D0%B2%D1%96%D1%82!%20%D0%9C%D0%B0%D1%8E%20%D0%B4%D0%BE%20%D0%B2%D0%B0%D1%81%20%D1%89%D0%BE%D0%B4%D0%BE%20..." target="_blank" className="button-primary-big">
          Написати нам
        </a>
      </div>
    </div>
  );
};
