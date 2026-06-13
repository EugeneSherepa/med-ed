import stepOneMedicine from '../../assets/steps/step_one_medicine.webp';
import stepOneDentistry from '../../assets/steps/step_one_dentistry.webp';
import stepTwoMedicine from '../../assets/steps/step_two_medicine.jpg';

const cards = [
  {
    id: 1,
    url: "/about/medicine",
    image: stepOneMedicine,
    tag: 'груповий формат',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 лекції і 32 практики, група 7 осіб',
    start: {
      first: "жовтень - 1 потік",
      second: 'січень - 2 потік',
    },
    price: '450грн',
  },
  {
    id: 2,
    url: "/about/stomatology",
    image: stepOneDentistry,
    tag: 'груповий формат',
    caption: 'Крок-1',
    title: 'Стоматологія',
    text: '32 лекції і 32 практика, група 7 осіб',
    start: {
      first: "вересень",
      second: '',
    },
    price: '450грн',
  },
  {
    id: 3,
    url: "/step-two",
    image: stepTwoMedicine,
    tag: 'груповий формат',
    caption: 'Крок-2',
    title: 'Медицина',
    text: '36 лекцій і 36 практик, група 7 осіб',
    start: {
      first: "вересень",
      second: '',
    },
    price: '450грн',
  },
  {
    id: 4,
    url: "/about/medicine",
    image: stepOneMedicine,
    tag: 'інтенсив',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 теми, чат з викладачем',
    start: {
      first: "",
      second: 'січень',
    },
    price: '350грн',
  },
  {
    id: 5,
    url: "/about/stomatology",
    image: stepOneDentistry,
    tag: 'інтенсив',
    caption: 'Крок-1',
    title: 'Стоматологія',
    text: '32 теми, чат з викладачем',
    start: {
      first: "",
      second: 'грудень',
    },
    price: '350грн',
  },
  {
    id: 6,
    url: "/step-two",
    image: stepTwoMedicine,
    tag: 'інтенсив',
    caption: 'Крок-2',
    title: 'Медицина',
    text: '36 тем, чат з викладачем',
    start: {
      first: "",
      second: 'грудень',
    },
    price: '350грн',
  },
];

export default cards;
