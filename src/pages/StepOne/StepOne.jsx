import { Header } from '../../components/Header/Header';
import { BreakLine } from '../../components/BreakLine/BreakLine';
import { Cards } from '../../components/Cards/Cards';
import { TeamComponent } from '../../components/Team/TeamComponent';
import { Testimonials } from '../../components/Testimonials/Testimonails';
import { BottomBanner } from '../../components/BottomBanner/BottomBanner';
import { FaqCards } from '../../components/FaqCards/FaqCards';
import { Footer } from '../../components/Footer/Footer';
import cards from '../../data/StepOne/cards';
import team from '../../data/StepOne/team';
import testimonials from '../../data/Home/testimonials';
import cardreviews from "../../data/StepOne/faqcards.js"

export const StepOne = () => {
  return (
    <>
      <Header />
      <BreakLine title={("Підготовка до крок-1")} text={"Ми систематизували матеріали за принципом First Aid STEP 1 <br> і доповнили їх ресурсами Amboss, Osmosis та іншими визнаними джерелами. <br>Усі заняття супроводжуються тестами, які допоможуть вам закріпити отримані знання."}/>
      <Cards
        title={'спеціальність'}
        text={
          "Обирай, що підходить саме тобі. <br/>Ми зробили навчання зручним та результативним!"
        }
        textMobile={'Обирай, що підходить саме тобі.'}
        cards={cards}
      />
      <TeamComponent dpt={100} showText={true} team={team}/>
      <Testimonials testimonials={testimonials} />
      <BottomBanner />
      <FaqCards cardreviews={cardreviews} />
      <Footer />
    </>
  );
};
