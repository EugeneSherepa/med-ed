import { Header } from '../../components/Header/Header';
import { StepTwoHeader } from '../../components/StepTwoHeader/StepTwoHeader';
import { AboutCource } from '../../components/AboutCource/AboutCource';
import { BottomBanner } from '../../components/BottomBanner/BottomBanner';
import { Footer } from '../../components/Footer/Footer';
import heroImage from '../../assets/steps/step_one_medicine.png';
import team from '../../data/AboutCourse/MedicineStepTwo/team';
import reviews from '../../data/AboutCourse/MedicineStepTwo/reviews';

const content = {
  first_title: 'Опис курсу',
  second_title: 'План курсу:',
  third_title: 'Формати навчання:',
  first_text:
    'Курс підготовки до КРОК 2 охоплює 35 тем.<br>Після кожної лекції на вас чекає практичне заняття, де ми не лише розв’язуємо тести КРОК 2, а й працюємо зі STEP 2 та інтерактивними завданнями.<br><br>Усі матеріали створені на основі доказових і перевірених джерел: українські та міжнародні клінічні протоколи, Kaplan STEP 2, First Aid USMLE STEP 2, Медицина за Девідсоном, Osmosis та Amboss.<br><br>Підготовка до КРОК 2 з нами — це не про зазубрювання фраз, а про глибоке розуміння захворювань, їх причин, клінічних проявів, діагностики та лікування.',
  second_text:
    '<b>Блок 1 «Гематологія»</b><br>Тема 1. Анемії. Гемолітична хвороба новонароджених. Класифікація анемій. Гостра та хронічна постгеморагічна анемія. Залізодефіцитна анемія. В-12фолієводефіцитна анемія. Гемолітичні анемії вроджені та набуті. Анемія при нирковій недостатності. Апластична анемія. Хвороба Вакеза. Отруєння чадним газом та метгемоглобінемія. Гемолітична хвороба плода і новонароджених.',
  third_text:
    '<b>1) Навчання в групках (по 6 студентів)- 450 грн/лекція з практикою</b><br><br>Старт з вересня — 1 раз/тиждень<brСтарт з грудня — 2 рази/тиждень<br><br><br><b>Що входить:</b><br><li><b>Запис лекції з теорією</b> — слухаєш у своєму темпі перед практикою</li><li><b>Живе практичне заняття</b> з викладачем у міні-групі (6 людей)</li><li><b>Опитування</b>, обговорення, вирішення тестів КРОК-2, STEP-2, клінічних кейсів</li><li><b>Домашка після кожного уроку:</b> КРОК-2, STEP-2 тести, clinicalcases, інтерактивні вправи</li><li><b>Чат з викладачем</b> — запитати можна будь-коли</li><br>Ідеально, якщо хочеш стабільність, ритм і підтримку на кожному етапі.<br><br><b>2) Інтенсивний курс (самостійне навчання) — 350 грн за лекцію</b><br><br>Старт з грудня — 2 лекції/тиждень<br><br><b>Що входить:</b><br><li><b>2 теоретичні лекції щотижня</b> — вчишся у зручний час</li><li><b>Домашка після кожної лекції:</b> КРОК-2 та STEP-2 тести та clinical cases</li><li><b>Чат з викладачем</b>— відповідаємо на всі твої питання.<br><br>Для тих, хто хоче «втиснути» підготовку в короткий час і не боїться самоорганізації.',
    link: "https://drive.google.com/file/d/1JjDOTvCr_wZGg60RmUfIy35j6Za1xcjP/view"
};

export const StepTwo = () => {
  return (
    <>
      <Header />
      <StepTwoHeader />
      <AboutCource
        image={heroImage}
        title={'КРОК-2. Медицина'}
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
