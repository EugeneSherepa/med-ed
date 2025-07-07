import stepOneMedicine from '../../assets/steps/step_one_medicine.png';
import stepOneDentistry from '../../assets/steps/step_one_dentistry.png';
import stepTwoMedicine from '../../assets/steps/step_two_medicine.png';
import mentorOneImage from '../../assets/mentors/menor_dmutro.jpg';

const cards = [
  {
    id: 1,
    url: "",
    image: stepOneMedicine,
    tag: '1 тиждень',
    caption: 'Крок-1',
    title: 'Медицина',
    text: '32 лекції і 32 практики, група 3-6 осіб',
    mentor: {
      name: 'Дмитро',
      image: mentorOneImage,
      position: 'Викладач',
    },
    price: '450грн',
  },
  {
    id: 2,
    url: "",
    image: stepOneDentistry,
    tag: '1 тиждень',
    caption: 'Крок-1',
    title: 'Стоматологія',
    text: '32 лекції і 32 практики, група 3-6 осіб',
    mentor: {
      name: 'Дмитро',
      image: mentorOneImage,
      position: 'Викладач',
    },
    price: '450грн',
  },
  {
    id: 3,
    url: "",
    image: stepTwoMedicine,
    tag: '1 тиждень',
    caption: 'Крок-2',
    title: 'Стоматологія',
    text: '32 лекції і 32 практики, група 3-6 осіб',
    mentor: {
      name: 'Дмитро',
      image: mentorOneImage,
      position: 'Викладач',
    },
    price: '450грн',
  },
];

export default cards;
