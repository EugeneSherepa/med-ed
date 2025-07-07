import './Team.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import team from '../../data/About/team';

export const Team = () => {
  return (
    <div className="team">
      <div className="page-width">
        <h3 className="team-heading">Команда</h3>
        <div className="team-subheading">З якою ти підкориш крок!</div>
      </div>
      <Swiper
        slidesPerView={2.7}
        spaceBetween={78}
        breakpoints={{
          0: {
            slidesPerView: 1.225,
            spaceBetween: 24,
          },
          990: {
            slidesPerView: 2.7,
            spaceBetween: 32,
          },
        }}
        className="mySwiper team-members"
      >
        {team.map((team_member) => (
          <SwiperSlide key={team_member.id} className="team-members-member">
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
    </div>
  );
};
