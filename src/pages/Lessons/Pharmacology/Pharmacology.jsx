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
import reviews from '../../../data/Lessons/Pharmacology/reviews';
import olesia from '../../../assets/mentors/olesia-pharmacology.jpg';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: olesia,
    title: 'Олеся',
    text: ' — засновниця курсу, лікар-інтерн хірург',
  },
];

export const Pharmacology = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'ФАРМАКОЛОГІЯ'}
        text={
          'Курс охоплює основи дії ліків, їх класифікацію, фармакокінетику й фармакодинаміку з акцентом на клінічну практику — вибір терапії, побічки та взаємодії препаратів.'
        }
        firstSem={'10 тем з загальної фармакології'}
        secondSem={"10 тем з фармакології засобів, що впливають на функцію виконавчих органів"}
        bottomText={
        'Матеріал лекцій та уроків itsmeded постійно оновлюється відповідно до найактуальніших клінічних рекомендацій. Для цього використовуються авторитетні ресурси, зокрема <b>AMBOSS</b>, <b>Osmosis</b> та <b>UpToDate</b>.'
      }
        courseBest={
          '<li><b>Пояснюємо зрозуміло і надовго</b> — знання залишаться не тільки до іспиту, а й на все життя.</li><li><b>Клініка тут і зараз:</b>кожен препарат — це історія пацієнта, а не суха таблиця.</li><li><b>Авторські схеми:</b> мінімум хаосу, максимум логіки (навіть фармакокінетика стає дружньою).</li><li><b>Мнемоніки та лайфхаки:</b> побічки залишаться в голові навіть після інтернатури.</li><li><b>Інтерактив:</b> тести, кейси, розбір інструкцій і групові штурми — вчимося думати, а не зазубрювати</li><br>Адаптуємо уроки під тематичний план вашого ВНЗ.<br>'
        }
        caption={
          'Кожна тема курсу закріплюється тестами та практичними вправами, щоб ви відчували впевненість у своїх знаннях.'
        }
      />
      <BreakLine />
      <Cards cards={cards} title={'формат навчання та ціни'} />
      <Testimonials
        dpt={192}
        dpb={262}
        title={'Викладач Фармакології'}
        testimonials={testimonials}
      />
      <ReviewsSlider reviews={reviews} dpt={64} dpb={262} />
      <BottomBanner />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
