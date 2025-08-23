import { Header } from '../../../components/Header/Header';
import { LessonInfo } from '../../../components/LessonInfo/LessonInfo';
import { BreakLine } from '../../../components/BreakLine/BreakLine';
import { Cards } from '../../../components/Cards/Cards';
import { Testimonials } from '../../../components/Testimonials/Testimonails';
import { ReviewsSlider } from '../../../components/ReviewsSlider/ReviewsSlider';
import { BottomBanner } from '../../../components/BottomBanner/BottomBanner';
import { FaqCards } from '../../../components/FaqCards/FaqCards';
import { Footer } from '../../../components/Footer/Footer';
import cards from '../../../data/Lessons/Anatomy/cards';
import reviews from '../../../data/Lessons/Biochemistry/reviews';
import nazrin from '../../../assets/mentors/nazrin-biochemistry.webp';
import valeria from '../../../assets/mentors/mentor-placeholder.png';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: nazrin,
    title: 'Назрін ',
    text: 'має суперсилу: робити з хаосу молекул чітку картину. Її секрет — показати, як біохімія пов’язана з медициною.',
    author: 'Замість зубріння — ти зрозумієш і закохаєшся.',
  },
  {
    id: 2,
    image: valeria,
    title: 'Валерія ',
    text: 'перетворює біохімічні процеси на зрозумілі історії.',
    author: 'З нею навіть цикл Кребса стає твоїм другом!',
  },
];

export const Biochemistry = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'БІОХІМІЯ'}
        text={
          'Курс охоплює метаболічні процеси, біомолекули, ензимологію та біохімію тканин. Матеріал подано з акцентом на практичне застосування в медицині — для розуміння механізмів захворювань і їх лікування.'
        }
        firstSem={'13 тем з біохімії основних класів біомолекул'}
        secondSem={
          '20 тем зі спеціалізованої біохімії'
        }
        bottomText={
          'Матеріал лекцій та уроків itsmeded постійно оновлюється відповідно до найактуальніших клінічних рекомендацій. Для цього використовуються авторитетні ресурси, зокрема <b>AMBOSS</b>, <b>Osmosis</b> та <b>UpToDate</b>.'
        }
        courseBest={
          '<li>Структорований та рожевий світ біохімії💅🏻</li><li>Авторські схеми для кращого розуміння метаболічних процесів білків, жирів, вуглеводів</li><li>Поєднання біохімії з клінічними дисциплінами</li><br>Адаптуємо уроки під тематичний план вашого ВНЗ.<br>'
        }
        caption={
          'Кожна тема курсу закріплюється тестами та практичними вправами, щоб ви відчували впевненість у своїх знаннях.'
        }
      />
      <BreakLine />
      <Cards cards={cards} title={'формат навчання та ціни'} text={"Ми займаємось за системою flipped classroom, тобто спочатку надсилаємо вам в чат запис лекції з тайм-кодами і презентацією, яку ви вдома переглядаєте самостійно, а потім вас вже запрошуємо на практичне заняття в зум (тривалістю година-півтори), де наш викладач буде вас опитувати, ви будете грати в ігри, вирішувати тести КРОК-1, STEP-1 і клінічні кейси.<br>Така система дозволяє запамʼятати і вивчити більший обʼєм інформації 🫂"} />
      <Testimonials
        dpt={192}
        dpb={262}
        title={'Викладачі біохімії'}
        testimonials={testimonials}
      />
      <ReviewsSlider reviews={reviews} dpt={64} dpb={262} />
      <BottomBanner link={"https://t.me/its_meded?text=Привіт!%20Хочу%20зрозуміти%20всі%20молекулярні%20процеси%20в%20організмі!%20🧬%20Записуйте%20на%20біохімію!"} />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
