import { LogoIcon } from "assets/Icons/LogoIcon";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import stephanie from "assets/images/steph.jpg";
import ore from "assets/images/ore.jpg";
import peculiar from "assets/images/peculiar.jpg";
import "./style.scss";
const reviewList = [
  {
    review:
      "It's the fact that they make out time to teach and walk me through the process of being a better entrepreneur.",
    image: peculiar,
    role: "Peculiar - CEO Shop Tadi",
  },
  {
    review:
      "As a Pro subscriber, I go to rest knowing I have one less thing to worry about, with regards to the success of my business.",
    image: ore,
    role: "Ore - CEO Lip Gloss Wholesale Nigeria",
  },
  {
    review:
      "Bumpa app is honestly a must have for any business owner!! From book keeping to analytics, to website and now the latest Meta and Bumpa integration.",
    image: stephanie,
    role: "Stephanie - CEO Nyne and Nuel",
  },
];
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pd_auth_layout">
      <div className="flex_section">
        <div className="carousel_section">
          <Swiper
            loop={true}
            pagination={{
              clickable: true,
            }}
            speed={1000}
            autoplay={{
              delay: 3500,
            }}
            spaceBetween={10}
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
          >
            {reviewList.map((item, i: number) => {
              return (
                <SwiperSlide key={i}>
                  <div
                    className="single_carousel"
                    style={{
                      backgroundImage: `url(${item.image})`,
                    }}
                  >
                    <div className="text_box">
                      <p className="review">{item.review}</p>
                      <p className="name">{item.role}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="content_section">
          <LogoIcon />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
