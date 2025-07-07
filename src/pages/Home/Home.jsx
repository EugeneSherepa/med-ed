import './Home.scss';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { HomeHero } from '../../components/HomeHero/HomeHero';
import { HomeTextImage } from '../../components/HomeTextImage/HomeTextImage';
import { Cards } from '../../components/Cards/Cards';
import { BreakLine } from '../../components/BreakLine/BreakLine';
import { Bubbles } from '../../components/Bubbles/Bubbles';
import { Testimonials } from '../../components/Testimonials/Testimonails';
import { BottomBanner } from '../../components/BottomBanner/BottomBanner';
import cards from '../../data/Home/cards';
import testimonials from '../../data/Home/testimonials';

export const Home = () => {
  return (
    <>
      <Header />
      <HomeHero />
      <HomeTextImage />
      <Cards
        title={'Крок за кроком до успіху'}
        text={
          'Обирай курс, що підходить саме тобі: від підготовки до КРОК 1 та КРОК 2 <br> до індивідуальних уроків для підготовки до пар. Ми зробили навчання зручним та результативним!'
        }
        textMobile={'Обирай курс, що підходить саме тобі'}
        cards={cards}
      />
      <BreakLine />
      <Bubbles />
      <Testimonials testimonials={testimonials} />
      <BottomBanner />
      <Footer />
    </>
  );
};
