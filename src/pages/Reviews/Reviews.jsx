import { Header } from '../../components/Header/Header';
import { ReviewsSlider } from '../../components/ReviewsSlider/ReviewsSlider';
import { BottomBanner } from '../../components/BottomBanner/BottomBanner';
import { FaqCards } from '../../components/FaqCards/FaqCards';
import { Footer } from '../../components/Footer/Footer';
import reviews from "../../data/Reviews/reviews"
import cardreviews from "../../data/Reviews/cards"

export const Reviews = () => {
  return (
    <>
      <Header />
      <ReviewsSlider reviews={reviews} />
      <BottomBanner />
      <FaqCards cardreviews={cardreviews} />
      <Footer />
    </>
  );
};
