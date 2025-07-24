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
        <a href="" className="button-primary-big">
          Написати нам
        </a>
      </div>
    </div>
  );
};
