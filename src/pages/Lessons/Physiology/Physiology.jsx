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
import reviews from '../../../data/Lessons/Physiology/reviews';
import petro from '../../../assets/mentors/perto-phisioligy.jpg';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: petro,
    title: 'Петро',
    text: 'транслює отакий меседж: фіза — це ізі, якщо її не зубрити, а розуміти.',
    author: 'Відгукується? Ще б пак!',
  },
];

export const Physiology = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'Фізіологія'}
        text={
          'Цей курс — це місток між теорією та клінікою, який підготує вас до успішного складання КРОКу та реальної роботи з пацієнтами.'
        }
        firstSem={'15 тем з загальної фізіології'}
        secondSem={
          '16 тем з фізіології вісцеральних систем та вищих інтегративних функцій'
        }
        bottomText={
          'Матеріал лекцій та уроків itsmeded постійно оновлюється відповідно до найактуальніших клінічних рекомендацій. Для цього використовуються авторитетні ресурси, зокрема <b>AMBOSS</b>, <b>Osmosis</b> та <b>UpToDate</b>.'
        }
        courseBest={
          '<li><b>Актуальність:</b> матеріал базується на доказових міжнародних ресурсах.</li><li><b>Індивідуальний підхід:</b> пояснюємо складне простими словами, адаптуємось до вашого темпу.</li><li><b>Практичність:</b> теми доповнені клінічними прикладами для кращого розуміння.</li><li><b>Інтерактивність:</b> тести, кейси, візуалізації та обговорення — для ефективного навчання.</li><br>Адаптуємо уроки під тематичний план вашого ВНЗ.<br>'
        }
        caption={
          'Кожна тема курсу закріплюється тестами та практичними вправами, щоб ви відчували впевненість у своїх знаннях.'
        }
      />
      <BreakLine />
      <Cards cards={cards} title={'формат навчання та ціни'} text={"Ми займаємось за системою flipped classroom, тобто спочатку надсилаємо вам в чат запис лекції з тайм-кодами і презентацією, яку ви вдома переглядаєте самостійно, а потім вас вже запрошуємо на практичне заняття в зум (тривалістю година-півтори), де наш викладач буде вас опитувати, ви будете грати в ігри, вирішувати тести КРОК-1, STEP-1 і клінічні кейси.<br>Така система дозволяє запамʼятати і вивчити більший обʼєм інформації 🫂"}/>
      <Testimonials
        dpt={192}
        dpb={262}
        title={'Викладач фізіології'}
        testimonials={testimonials}
      />
      <ReviewsSlider reviews={reviews} dpt={64} dpb={262} />
      <BottomBanner />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
