import { Header } from '../../components/Header/Header';
import { StepTwoHeader } from '../../components/StepTwoHeader/StepTwoHeader';
import { AboutCource } from '../../components/AboutCource/AboutCource';
import { BottomBanner } from '../../components/BottomBanner/BottomBanner';
import { Footer } from '../../components/Footer/Footer';
import heroImage from '../../assets/steps/step_one_medicine.png';
import iconDoc from '../../assets/icon-doc.svg';
import iconPerson from '../../assets/icon-person.svg';
import team from "../../data/StepTwo/team"
import reviews from "../../data/StepTwo/reviews"

const tags = [
  {
    logo: iconDoc,
    text: '32 занять',
  },
  {
    logo: iconPerson,
    text: 'Групи з 6 осіб',
  },
];

const content = {
  first_title: 'Опис курсу',
  first_text:
    'КРОК-1 Фармація — це інтенсивний курс підготовки, що поєднує теоретичну базу та практичні завдання. Програма структурована для глибокого розуміння основ хімії, біології та медичних дисциплін.<br><br>Ми працюємо за системою flipped classroom: спочатку вивчаєш лекції з теорією вдома, а на практичному занятті в Zoom закріплюєш знання через тести та інтерактивні завдання разом із викладачем.<br><br>Вартість за лекцію + практику: 350 грн<br>Повний курс: 11 200 грн (можлива оплата частинами — щотижня або щомісяця).',
};

export const StepTwo = () => {
  return (
    <>
      <Header />
      <StepTwoHeader />
      <AboutCource
        image={heroImage}
        title={'КРОК-2. Медицина'}
        tags={tags}
        team={team}
        reviews={reviews}
        content={content}
        showCard={false}
        showBreadcrumbs={false}
        mpt={32}
      />
      <BottomBanner />
      <Footer />
    </>
  );
};
