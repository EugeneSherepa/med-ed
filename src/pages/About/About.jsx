import { Header } from '../../components/Header/Header';
import { AboutHero } from '../../components/AboutHero/AboutHero';
import { AboutIconText } from '../../components/AboutIconText/AboutIconText';
import { AboutText } from '../../components/AboutText/AboutText';
import { BreakLine } from '../../components/BreakLine/BreakLine';
import { TeamComponent } from '../../components/Team/TeamComponent';
import { BottomBannerSecond } from '../../components/BottomBannerSecond/BottomBannerSecond';
import { Footer } from '../../components/Footer/Footer';
import team from '../../data/About/team';

export const About = () => {
  return (
    <>
      <Header />
      <AboutHero />
      <AboutIconText />
      <AboutText />
      <BreakLine />
      <TeamComponent showText={true} text = "З якою ти підкориш медичний!" team={team} />
      <BottomBannerSecond />
      <Footer />
    </>
  );
};
