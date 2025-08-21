import { Header } from '../../components/Header/Header';
import { FaqCards } from '../../components/FaqCards/FaqCards';
import { Footer } from '../../components/Footer/Footer';
import cardreviews from "../../data/FAQ/faq.js"

export const FAQ = () => {
  return (
    <>
      <Header />
      <FaqCards cardreviews={cardreviews} />
      <Footer />
    </>
  );
};
