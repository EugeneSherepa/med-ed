import './TeamComponent.scss';
import '../Testimonials/Testimonials.scss';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import iconCaret from '../../assets/icon-caret-swiper.svg';
import iconCaretDisaabled from '../../assets/icon-caret-swiper-disabled.svg';

export const TeamComponent = ({ dpt = 0, dpb = 172, showText, team, showButtons = false }) => {
  return (
    <div className="">
      <div
        className={showText ? 'team' : 'team team-padding'}
        style={{
          '--dpt': `${dpt}px`,
          '--dpb': `${dpb}px`,
        }}
      >
        <div className="page-width">
          {showText && showText !== 'false' && (
            <div className="team-component-warpper">
              <div>
                <h3 className="team-heading">Команда</h3>
                <div className="team-subheading">З якою ти підкориш крок!</div>
              </div>
              <div className="testimonials-section-wrapper-top-buttons">
                <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev">
                  <img src={iconCaret} className="active" />
                  <img src={iconCaretDisaabled} className="disabled" />
                </button>
                <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next">
                  <img src={iconCaret} className="active" />
                  <img src={iconCaretDisaabled} className="disabled" />
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="page-width-left">
          {showText ? (
            <>
              {showButtons && showButtons !== 'false' && (
                <div className="page-width testimonials-section-wrapper-top-buttons">
                  <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev">
                    <img src={iconCaret} className="active" />
                    <img src={iconCaretDisaabled} className="disabled" />
                  </button>
                  <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next">
                    <img src={iconCaret} className="active" />
                    <img src={iconCaretDisaabled} className="disabled" />
                  </button>
                </div>
              )}
              <Swiper
                slidesPerView={2.7}
                spaceBetween={78}
                mousewheel={{ forceToAxis: true }}
                modules={[Navigation, Mousewheel]}
                navigation={{
                  nextEl: '.testimonials-section-wrapper-top-buttons-next',
                  prevEl: '.testimonials-section-wrapper-top-buttons-prev',
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1.225,
                    spaceBetween: 24,
                    slidesOffsetAfter: 24,
                    slidesOffsetBefore: 24,
                  },
                  990: {
                    slidesPerView: 2.7,
                    spaceBetween: 32,
                    loop: false,
                  },
                }}
                className="mySwiper team-members"
              >
                {team.map((team_member) => (
                  <SwiperSlide
                    key={team_member.id}
                    className="team-members-member"
                  >
                    <div className="team-members-member-wrapper">
                      <img
                        src={team_member.image}
                        alt={`${team_member.position} ${team_member.name}`}
                      />
                      <div className="team-members-member-wrapper-overlay">
                        <h4 className="team-members-member-wrapper-overlay-heading">
                          {team_member.name}
                        </h4>
                        <div className="team-members-member-wrapper-overlay-text">
                          {team_member.position}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <Swiper
              slidesPerView={2.7}
              spaceBetween={78}
              mousewheel={{ forceToAxis: true }}
              modules={[Navigation, Mousewheel]}
              navigation={{
                nextEl: '.testimonials-section-wrapper-top-buttons-next',
                prevEl: '.testimonials-section-wrapper-top-buttons-prev',
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1.225,
                  spaceBetween: 24,
                  slidesOffsetAfter: 24,
                  slidesOffsetBefore: 24,
                },
                990: {
                  slidesPerView: 2.7,
                  spaceBetween: 32,
                  loop: false,
                },
              }}
              className="mySwiper team-members"
            >
              {team.map((team_member) => (
                <SwiperSlide
                  key={team_member.id}
                  className="team-members-member"
                >
                  <div className="team-members-member-wrapper">
                    <img
                      src={team_member.image}
                      alt={`${team_member.position} ${team_member.name}`}
                    />
                    <div className="team-members-member-wrapper-overlay">
                      <h4 className="team-members-member-wrapper-overlay-heading">
                        {team_member.name}
                      </h4>
                      <div className="team-members-member-wrapper-overlay-text">
                        {team_member.position}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        {!showText && (
          <div className="page-width">
            <div className="team-bottom">
              <div className="team-bottom-first">
                <h1 className="team-bottom-first-title">Наші викладачі</h1>
                <div className="team-bottom-first-text">Познайомимось?</div>
              </div>
              <div className="team-bottom-second">
                За кожним успішним студентом стоїть команда викладачів, які
                вірять у нього більше, ніж він сам!
                <br />
                <br />
                Знайомся з тими, хто страхуватиме тебе, аж поки не почуєшся
                впевнено на шляху до медичних вершин
              </div>
              <div className="team-bottom-third testimonials-section-wrapper-top-buttons">
                <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-prev">
                  <img src={iconCaret} className="active" />
                  <img src={iconCaretDisaabled} className="disabled" />
                </button>
                <button className="testimonials-section-wrapper-top-buttons-button testimonials-section-wrapper-top-buttons-next">
                  <img src={iconCaret} className="active" />
                  <img src={iconCaretDisaabled} className="disabled" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
