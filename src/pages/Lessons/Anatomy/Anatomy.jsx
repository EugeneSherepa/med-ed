import { Header } from '../../../components/Header/Header';
import { LessonInfo } from '../../../components/LessonInfo/LessonInfo';
import { BreakLine } from '../../../components/BreakLine/BreakLine';
import { Cards } from '../../../components/Cards/Cards';
import { Testimonials } from '../../../components/Testimonials/Testimonails';
import { BottomBanner } from '../../../components/BottomBanner/BottomBanner';
import { ReviewsSlider } from '../../../components/ReviewsSlider/ReviewsSlider';
import { FaqCards } from '../../../components/FaqCards/FaqCards';
import { Footer } from '../../../components/Footer/Footer';
import cards from '../../../data/Lessons/Anatomy/cards';
import reviews from '../../../data/Lessons/Anatomy/reviews';
import rostislav from '../../../assets/mentors/rostislav-anatomiya.jpg';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: rostislav,
    title: 'Анатомія',
    text: 'перетворює нудні простирадла тексту на корисні малюнки, а складні теми розкладає на прості та зрозумілі інфоблоки',
    author: 'Анатомія – це лав, коли її навчає Ростислав! ❤️',
  },
];

export const Anatomy = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'Анатомія'}
        text={
          'Курс анатомії охоплює всі аспекти будови та функціонування людського тіла. Наш курс дає змогу студентам глибоко зрозуміти кожну систему організму, зосереджуючись на ключових темах, необхідних для складання КРОК 1'
        }
        firstSem={'30 тем з опорно-рухового апарату та спланхнології'}
        secondSem={
          '35 тем з анатомії ЦНС, органів чуття, серця та судин і нервів тіла людини'
        }
        bottomText={
          'Матеріал лекцій та уроків itsmeded постійно оновлюється відповідно до найактуальніших клінічних рекомендацій. Для цього використовуються авторитетні ресурси, зокрема <b>AMBOSS</b>, <b>Osmosis</b> та <b>UpToDate</b>.'
        }
        courseBest={
          '<li>Побудований на авторитетних міжнародних джерелах, що гарантує якість і актуальність знань.</li><li>Уроки та практичні заняття інтерактивні — з використанням 3D-атласів, тестів та завдань, що стимулюють активне засвоєння.</li><li>Складна інформація подається доступно й зрозуміло, з опорою на візуальні матеріали для полегшеного сприйняття.</li><br>Адаптуємо уроки під тематичний план вашого ВНЗ.<br>'
        }
        caption={
          'Кожна тема курсу закріплюється тестами та практичними вправами, щоб ви відчували впевненість у своїх знаннях.'
        }
      />
      <BreakLine />
      <Cards cards={cards} title={'формат навчання та ціни'} text={"Ми займаємось за системою flipped classroom, тобто спочатку надсилаємо вам в чат запис лекції з тайм-кодами і презентацією, яку ви вдома переглядаєте самостійно, а потім вас вже запрошуємо на практичне заняття в зум (тривалістю година-півтори), де наш викладач буде вас опитувати, ви будете грати в ігри, вирішувати тести КРОК-1, STEP-1 і клінічні кейси, 3Д атлас Complete Anatomy.<br>Така система дозволяє запамʼятати і вивчити більший обʼєм інформації 🫂"}/>
      <Testimonials
        dpt={192}
        dpb={132}
        title={'Викладач анатомії'}
        testimonials={testimonials}
      />
      <ReviewsSlider reviews={reviews} dpt={64} dpb={262} />
      <BottomBanner />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
