import { Header } from '../../../components/Header/Header';
import { AboutCource } from '../../../components/AboutCource/AboutCource';
import { Footer } from '../../../components/Footer/Footer';
import team from '../../../data/AboutCourse/Pharmacy/team';
import reviews from '../../../data/AboutCourse/Pharmacy/reviews';
import heroImage from '../../../assets/pharmacy.png';
import iconDoc from '../../../assets/icon-doc.svg';
import iconPerson from '../../../assets/icon-person.svg';
import cardImage from '../../../assets/steps/step_two_medicine.png';

const tags = [
  {
    logo: iconDoc,
    text: '32 занять',
  },
  {
    logo: iconPerson,
    text: 'Групи з 6 осіб',
  },
];

const content = {
  first_title: 'Опис курсу',
  second_title: 'Що ви дізнаєтесь на цьому курсі?',
  first_text:
    'КРОК-1 Фармація — це інтенсивний курс підготовки, що поєднує теоретичну базу та практичні завдання. Програма структурована для глибокого розуміння основ хімії, біології та медичних дисциплін.<br><br>Ми працюємо за системою flipped classroom: спочатку вивчаєш лекції з теорією вдома, а на практичному занятті в Zoom закріплюєш знання через тести та інтерактивні завдання разом із викладачем.<br><br>Вартість за лекцію + практику: 350 грн<br>Повний курс: 11 200 грн (можлива оплата частинами — щотижня або щомісяця).',
  second_text:
    '<li>Глибоке розуміння основ хімії</li>Аналіз і систематизація знань з аналітичної, органічної, фізичної та колоїдної хімій.<br><br><li>Практичні навички розв’язання тестів</li>Закріплення теорії через розбір тестових завдань КРОК-1 і інтерактивні вправи на заняттях.<br><br><li>Інтеграція загально-медичних дисциплін</li>Вивчення патофізіології, фармакології та мікробіології, які є важливими для успішної підготовки.<br><br><li>Покращення англійської мови</li>Опанування термінології, необхідної для складання іспитів та майбутньої практики.<br><br><li>Стратегія ефективного навчання</li>Навчитеся працювати за системою flipped classroom: самостійне вивчення лекцій та активна робота на практичних заняттях.<br><br><li>Підготовка до успішного складання КРОК-1</li>Упевнено структуруйте свої знання, щоб скласти іспит на високий бал.',
};

export const Pharmacy = () => {
  return (
    <>
      <Header />
      <AboutCource
        image={heroImage}
        title={'КРОК-1. Фармація'}
        tags={tags}
        team={team}
        reviews={reviews}
        content={content}
        cardImage={cardImage}
        price={'350грн'}
        cardTitle={'Курс включає:'}
        cardContent={
          '<li>Чітку структуру матеріалів.</li><li>Доступ до записів лекцій</li><li>Підтримку викладача і можливість отримати відповіді на свої питання</li><li>Ефективну підготовку до КРОК-1 без зайвих зусиль!</li>'
        }
      />
      <Footer />
    </>
  );
};
