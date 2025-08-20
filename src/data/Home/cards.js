import stepOneMedicine from '../../assets/steps/step_one_medicine.png';
import stepOneDentistry from '../../assets/steps/step_one_dentistry.png';
import stepTwoMedicine from '../../assets/steps/step_two_medicine.png';
import mentorOneImage from '../../assets/mentors/mentor-placeholder.png';

const cards = [
  {
    id: 1,
    url: "/about/medicine",
    image: stepOneMedicine,
    tag: 'груповий формат',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 лекції і 32 практики, група 6 осіб',
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
    text: '31 лекція і 31 практика, група 6 осіб',
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
    text: '35 лекцій і 35 практик, група 6 осіб',
    start: {
      first: "січень",
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
    text: '31 тема, чат з викладачем',
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
    text: '35 тем, чат з викладачем',
    start: {
      first: "",
      second: 'січень',
    },
    price: '350грн',
  },
];

export default cards;
