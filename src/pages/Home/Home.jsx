import "./Home.scss"
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export const Home = () => {
  return (
    <>
      <Header />
      <h1>Home page</h1>
      <div className='home-test'></div>
      <Footer />
    </>
  );
};
