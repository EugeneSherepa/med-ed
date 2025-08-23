import stepOneMedicine from '../../assets/steps/step_one_medicine.png';
import stepOneDentistry from '../../assets/steps/step_one_dentistry.jpg';

const cards = [
  {
    id: 1,
    url: '/about/medicine',
    image: stepOneMedicine,
    tag: 'груповий формат',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 лекції і 32 практики, група 3-6 осіб',
    start: {
      first: 'жовтень - 1 потік',
      second: 'січень - 2 потік',
    },
    price: '450грн',
  },
  {
    id: 2,
    url: '/about/stomatology',
    image: stepOneDentistry,
    tag: 'груповий формат',
    caption: 'Крок-1',
    title: 'Стоматологія',
    text: '31 лекція і 31 практика, група 6 осіб',
    start: {
      first: 'вересень',
      second: '',
    },
    price: '450грн',
  },
  {
    id: 4,
    url: '/about/medicine',
    image: stepOneMedicine,
    tag: 'інтенсив',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 лекції і 32 практики, група 3-6 осіб',
    start: {
      first: '',
      second: 'січень',
    },
    price: '450грн',
  },
  {
    id: 5,
    url: '/about/stomatology',
    image: stepOneDentistry,
    tag: 'інтенсив',
    caption: 'Крок-1',
    title: 'Стоматологія',
    text: '31 лекція і 31 практика, група 6 осіб',
    start: {
      first: '',
      second: 'грудень',
    },
    price: '450грн',
  },
];

export default cards;
