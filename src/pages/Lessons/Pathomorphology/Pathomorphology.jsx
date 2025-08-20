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
import reviews from '../../../data/Lessons/Pathomorphology/reviews';
import margo from '../../../assets/mentors/margo-patamarphology.jpg';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: margo,
    title: 'Марго',
    text: 'навчить обирати джерела, які варті уваги, фільтрувати пусту інформацію і розуміти усі патологічно процеси та їх наслідки для організму.',
    author: 'Патморф - це база! Марго - це фундамент.',
  },
];

export const Pathomorphology = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'ПАТОМОРФОЛОГІЯ'}
        text={
          'Курс патоморфології охоплює морфологічні зміни органів та тканин при захворюваннях, принципи діагностики та інтерпретацію гістологічних препаратів з акцентом на практику.'
        }
        firstSem={'17 тема з загальної патоморфології. Загальне вчення про пухлини'}
        secondSem={
          '18 тем з спеціальної патоморфології та інфекційних хвороб'
        }
        bottomText={
          'Матеріал лекцій та уроків itsmeded постійно оновлюється відповідно до найактуальніших клінічних рекомендацій. Для цього використовуються авторитетні ресурси, зокрема <b>AMBOSS</b>, <b>Osmosis</b> та <b>UpToDate</b>.'
        }
        courseBest={
          '<li><b>Базово і важливо:</b> патоморфологія — фундамент для розуміння будь-якої хвороби</li><li><b>Просто про складне:</b> пояснюємо зміни в клітинах і тканинах людською мовою.</li><li><b>Зв’язок з практикою:</b> допомагає краще ставити діагнози та розуміти клінічні випадки.</li><li><b>Критичне мислення:</b> вчимо аналізувати, а не просто зубрити.</li><li><b>Трохи магії:</b> рожево-фіолетовий світ, який відкриває очі на суть медицини.</li><br>Адаптуємо уроки під тематичний план вашого ВНЗ.<br>'
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
      title={'Викладач Патоморфології'}
        testimonials={testimonials}
      />
      <ReviewsSlider reviews={reviews} dpt={64} dpb={262} />
      <BottomBanner />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
