import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { AboutHero } from '../../components/AboutHero/AboutHero';
import { AboutIconText } from '../../components/AboutIconText/AboutIconText';
import { AboutText } from '../../components/AboutText/AboutText';
import { BreakLine } from '../../components/BreakLine/BreakLine';
import { TeamComponent } from '../../components/Team/TeamComponent';
import { BottomBannerSecond } from '../../components/BottomBannerSecond/BottomBannerSecond';
import team from '../../data/About/team';

export const About = () => {
  return (
    <>
      <Header />
      <AboutHero />
      <AboutIconText />
      <AboutText />
      <BreakLine />
      <TeamComponent showText={true} team={team} />
      <BottomBannerSecond />
      <Footer />
    </>
  );
};
