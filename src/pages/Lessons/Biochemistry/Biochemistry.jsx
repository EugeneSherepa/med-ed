import { Header } from '../../../components/Header/Header';
import { LessonInfo } from '../../../components/LessonInfo/LessonInfo';
import { BreakLine } from '../../../components/BreakLine/BreakLine';
import { Cards } from '../../../components/Cards/Cards';
import { Testimonials } from '../../../components/Testimonials/Testimonails';
import { BottomBanner } from '../../../components/BottomBanner/BottomBanner';
import { FaqCards } from '../../../components/FaqCards/FaqCards';
import { Footer } from '../../../components/Footer/Footer';
import cards from '../../../data/Lessons/Anatomy/cards';
import rostislav from '../../../assets/mentors/rostislav-anatomiya.jpg';
import faqcards from '../../../data/Lessons/Anatomy/faqcards';

const testimonials = [
  {
    id: 1,
    image: rostislav,
    title: 'Ростислав',
    text: 'Перетворює нудні простирадла тексту на корисні малюнки, а складні теми розкладає на прості та зрозумілі інфоблоки',
    author: 'Анатомія – це лав, коли її навчає Ростислав! ❤️',
  },
];

export const Biochemistry = () => {
  return (
    <>
      <Header />
      <LessonInfo
        title={'Фізіологія'}
        text={
          'Курс анатомії охоплює всі аспекти будови та функціонування людського тіла. Наш курс дає змогу студентам глибоко зрозуміти кожну систему організму, зосереджуючись на ключових темах, необхідних для складання КРОК 1'
        }
        firstSem={'30 лекції з опорно-рухового апарату та спланхнології'}
        secondSem={
          '35 лекції з анатомії ЦНС, органів чуття, серця та судин і нервів тіла людини'
        }
        bottomText={
          'Наш курс розроблений відповідно до офіційного тематичного плану університету, охоплюючи всі ключові теми, необхідні для успішного складання іспитів.'
        }
        caption={
          '*Кожна тема курсу закріплюється тестами та практичними вправами, щоб ви відчували впевненість у своїх знаннях.'
        }
      />
      <BreakLine />
      <Cards cards={cards} title={'формат навчання та ціни'} />
      <Testimonials
        dpt={192}
        dpb={262}
        title={'Викладач анатомії'}
        testimonials={testimonials}
      />
      <BottomBanner />
      <FaqCards cardreviews={faqcards} />
      <Footer />
    </>
  );
};
