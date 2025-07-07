import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { AboutHero } from '../../components/AboutHero/AboutHero';
import { AboutIconText } from '../../components/AboutIconText/AboutIconText';
import { AboutText } from '../../components/AboutText/AboutText';
import { BreakLine } from '../../components/BreakLine/BreakLine';
import { Team } from '../../components/Team/Team';
import { BottomBannerSecond } from '../../components/BottomBannerSecond/BottomBannerSecond';

export const About = () => {
  return (
    <>
      <Header />
      <AboutHero />
      <AboutIconText />
      <AboutText />
      <BreakLine />
      <Team />
      <BottomBannerSecond />
      <Footer />
    </>
  );
};
