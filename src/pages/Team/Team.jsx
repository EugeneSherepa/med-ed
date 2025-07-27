import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { TeamComponent } from '../../components/Team/TeamComponent';
import { TeamImage } from '../../components/TeamImage/TeamImage';
import { TextButton } from '../../components/TextButton/TextButton';
import team from '../../data/About/team';

export const Team = () => {
  return (
    <>
      <Header />
      <TeamComponent dpt={192} showText={false} team={team} />
      <TeamImage />
      <TextButton />
      <Footer />
    </>
  );
};
