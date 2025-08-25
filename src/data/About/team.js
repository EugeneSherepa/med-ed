import mentorOneImage from '../../assets/mentors/inna-step-one-med.webp';
import mentorTwoImage from '../../assets/mentors/nika-step-one-med.webp';
import mentorThreeImage from '../../assets/mentors/ivanna-step-one-med.webp';
import mentorFourImage from '../../assets/mentors/mentor-placeholder.png';
import mentorFiveImage from '../../assets/mentors/bohdan-step-one-med.webp';
import mentorSixImage from '../../assets/mentors/viktor-step-one-med.webp';
import mentorSevenImage from '../../assets/mentors/maxim-step-one-med.webp';
import mentorEightImage from '../../assets/mentors/mentor-placeholder.png';
import mentorNineImage from '../../assets/mentors/mentor-placeholder-two.png';
import mentorTenImage from '../../assets/mentors/mentor-placeholder-three.png';
import mentorElevenImage from '../../assets/mentors/ivanna-step-two-med.webp';
import mentorTwelvImage from '../../assets/mentors/andrii-step-two-med.webp';
import mentorThirteenImage from '../../assets/mentors/artem-step-two-med.JPEG';
import rostislav from '../../assets/mentors/rostislav-anatomiya.webp';
import nazrin from '../../assets/mentors/nazrin-biochemistry.webp';
import valeria from '../../assets/mentors/mentor-placeholder.png';
import margo from '../../assets/mentors/margo-patamarphology.webp';
import olesia from '../../assets/mentors/olesia-pharmacology.webp';
import petro from '../../assets/mentors/perto-phisioligy.webp';

const team = [
  {
    id: 100,
    image: rostislav,
    name: 'Ростислав',
    position:
      'перетворює нудні простирадла тексту на корисні малюнки, а складні теми розкладає на прості та зрозумілі інфоблоки',
  },
  {
    id: 101,
    image: nazrin,
    name: 'Назрін',
    position:
      'має суперсилу: робити з хаосу молекул чітку картину. Її секрет — показати, як біохімія пов’язана з медициною.',
  },
  {
    id: 102,
    image: valeria,
    name: 'Валерія',
    position: 'перетворює біохімічні процеси на зрозумілі історії.',
  },
  {
    id: 103,
    image: margo,
    name: 'Марго',
    position:
      'навчить обирати джерела, які варті уваги, фільтрувати пусту інформацію і розуміти усі патологічно процеси та їх наслідки для організму.',
  },
  {
    id: 104,
    image: olesia,
    name: 'Олеся',
    position:
      'розкриє фармакологію з нової сторони.Ти не просто знатимеш, коли й що призначити, а зрозумієш кожну дію, яку препарат виконує в організмі.',
  },
  {
    id: 105,
    image: petro,
    name: 'Петро',
    position:
      'транслює отакий меседж: фіза — це ізі, якщо її не зубрити, а розуміти.',
  },
  {
    id: 2,
    image: mentorOneImage,
    name: 'Інна',
    position: 'Покаже тобі КРОК-1 як топ-колаборацію базових дисциплін та інтеграцію їх у клінічне мислення.',
  },
  {
    id: 3,
    image: mentorTwoImage,
    name: 'Ніка',
    position: 'Готує до КРОК так, щоб кожна тема звучала як живий клінічний випадок.',
  },
  {
    id: 4,
    image: mentorThreeImage,
    name: 'Іванна',
    position: 'Покаже розтини для хоробрих, стікери мавп для підтримки, клінічні випадки разом з тестами для впевненості в твоїх медичних знаннях.',
  },
  {
    id: 5,
    image: mentorFourImage,
    name: 'Катерина',
    position: 'Витримка — її trademark, адже буде розбирати кейси, поки все не стане на 100% зрозумілим.',
  },
  {
    id: 6,
    image: mentorFiveImage,
    name: 'Богдан',
    position: 'Готує до КРОК-1 у команді з хвостатою помічницею — вона відповідає за позитивні емоції, а Богдан твої високі бали!',
  },
  {
    id: 7,
    image: mentorSixImage,
    name: 'Віктор',
    position: 'Вчить розбиратись в питаннях КРОК, хірургії та динозаврах! Що це якщо не підготовка на всі випадки життя?',
  },
  {
    id: 8,
    image: mentorSevenImage,
    name: 'Максим',
    position: 'Поєднує міжнародні джерела, сучасні інструменти й власний досвід, аби КРОК-1 став твоєю перемогою, а не стресом.',
  },
  {
    id: 9,
    image: mentorEightImage,
    name: 'Олександр',
    position: 'Допоможе тобі зрозуміти складні теми простою мовою і запевнить, що кожне твоє зусилля наближає до мрії стати стоматологом.',
  },
  {
    id: 10,
    image: mentorNineImage,
    name: 'Катерина',
    position: 'Навчить логічно мислити та допоможе структурувати трирічний обсяг знань так, щоб ти впевнено склав КРОК-1!',
  },
  {
    id: 11,
    image: mentorTenImage,
    name: 'Вікторія',
    position: 'Знає, як дисципліна та клінічний досвід допомагають досягти навіть того, що здавалось неможливим.',
  },
  {
    id: 12,
    image: mentorElevenImage,
    name: 'Іванна',
    position: 'Буде твоїм drill сержантом: прокачає клінічне мислення та підготує до КРОК-2 так, щоб інтернатура вже не злякала',
  },
  {
    id: 13,
    image: mentorTwelvImage,
    name: 'Андрій',
    position: 'Відкриє твого внутрішнього "Хауса". Систематично виведеш своє клінічне мислення на новий рівень.',
  },
  {
    id: 14,
    image: mentorThirteenImage,
    name: 'Артем',
    position: 'Викладач із великим серцем і точним ритмом знань, готує до КРОК-2 в ритмі синусового вузла.',
  },
];

export default team;
