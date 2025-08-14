import stepOneMedicine from '../../assets/steps/step_one_medicine.png';
import stepOneDentistry from '../../assets/steps/step_one_dentistry.png';
import mentorOneImage from '../../assets/mentors/mentor-placeholder.png';

const cards = [
  {
    id: 1,
    url: "",
    image: stepOneMedicine,
    tags: {
      tag: '1 тиждень'
    },
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
    tags: {
      tag: '1 тиждень'
    },
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
];

export default cards;
