import { Header } from '../../components/Header/Header';
import { MaterialsHero } from '../../components/MaterialsHero/MaterialsHero';
import { MaterialsGrid } from '../../components/Materials/MaterialsGrid';
import { FlashCards } from '../../components/FlashCards/FlashCards';
import { MaterialsLine } from '../../components/MaterialsLine/MaterialsLine';
import { Testimonials } from '../../components/Testimonials/Testimonails';
import { Footer } from '../../components/Footer/Footer';
import testimonials from '../../data/Home/testimonials';

export const Materials = () => {
  return (
    <>
      <Header />
      <MaterialsHero />
      <MaterialsGrid />
      <FlashCards />
      <MaterialsLine />
      <Testimonials testimonials={testimonials}/>
      <Footer />
    </>
  );
};
