import { useState, useRef, useCallback, useEffect } from "react";
import "./style.scss";
import elite from "assets/images/wrapped/elite.png";
import mogul from "assets/images/wrapped/mogulp.png";
import industry from "assets/images/wrapped/bindy.png";
import grower from "assets/images/wrapped/growerp.png";
import hustler from "assets/images/wrapped/hustlerp.png";
import learner from "assets/images/wrapped/blearner.png";
import bus_elite from "assets/images/wrapped/business_elite.png";
import bus_mogul from "assets/images/wrapped/Business_mogul.png";
import bus_grower from "assets/images/wrapped/Business_grower.png";
import bus_hustler from "assets/images/wrapped/Business_hustler.png";
import industry_entre from "assets/images/wrapped/Industrious_entrepreneur.png";
import bus_learner from "assets/images/wrapped/business_learner.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper";
import { WBack } from "assets/Icons/WBack";
import { DownloadWrapped } from "assets/Icons/downloadWrapped";
import { AcademyModal } from "./AcademyModal";
import { PrevIcon } from "assets/Icons/wrapped/PrevIcon";
import { NextIcon } from "assets/Icons/wrapped/Next";
import { LogoSvg } from "assets/Icons/wrapped/Group";
import { useGetWrappedMutation } from "services";
import { showToast } from "store/store.hooks";
import { CheckIcon } from "assets/Icons/wrapped/CheckIcon";
import { formatPricewrapp } from "utils";

export const WrappedEntry = () => {
  const [initial, setInitial] = useState(true);
  const [showWrapped, setShowWrapped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const imageDownload = async (imgSrc: any, imgName: string) => {
    try {
      const imgBlob = await fetch(imgSrc)
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((buffer) => new Blob([buffer], { type: "image/jpg" }));

      const link = document.createElement("a");
      link.href = URL.createObjectURL(imgBlob);
      link.download = imgName;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      setSuccess(true);
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    } catch (error) {
      setSuccess(true);
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
      // Show an alert or handle the error as needed
      // alert(`Image download failed: try again`);
    }
  };

  const downloadImage = async (imgSrc: any, imgName: string) => {
    // Show the popup immediately
    setShowModal(true);
    // Introduce a slight delay before starting the download
    setTimeout(async () => {
      try {
        const imgBlob = await fetch(imgSrc).then((response) => response.blob());
        const link = document.createElement("a");
        link.href = URL.createObjectURL(imgBlob);
        link.download = imgName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      } catch (error) {
        alert(`Image download failed:' ${error}`);
        // Optionally handle the error in the UI
      }
    }, 3000); // 100ms delay
  };

  const sliderRef = useRef<any>();
  const containerRef = useRef<any>();
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);
  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const queryParameters = new URLSearchParams(location.search);
  const user_id = queryParameters.get("user_id");
  const year = queryParameters.get("year");
  const expires = queryParameters.get("expires");
  const signature = queryParameters.get("signature");
  const [getWrapped, { data, isLoading }] = useGetWrappedMutation();
  const [wrappedDetails, setWrappedDetails] = useState<any>();

  const fetchWrapped = () => {
    try {
      getWrapped({
        user_id: user_id,
        year: year,
        expires: expires,
        signature: signature,
      })
        .then((result) => {
          if ("data" in result) {
            setWrappedDetails(result?.data);
          } else {
            // @ts-ignore
            // showToast("something went wrong", "failure");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const startWrap = () => {
    setShowWrapped(true);
    setInitial(false);
  };
  const closeAcedemyModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setSuccess(false);
    }, 1000);
  };
  useEffect(() => {
    if (!timeLeft) return;
    if (timeLeft === 0) {
      setTimeLeft(0);
    }
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.realIndex;
    if (activeIndex === 4) {
      setTimeLeft(5);
    }
  };
  useEffect(() => {
    fetchWrapped();
  }, []);

  useEffect(() => {
    const handleScreenClick = (event: any) => {
      const clickX = event.clientX;
      const clickY = event.clientY;
      const thresholdX = window.innerWidth / 2;
      const thresholdY = window.innerHeight * 0.2; // 30% from top and bottom

      if (
        clickX < thresholdX &&
        clickY > thresholdY &&
        clickY < window.innerHeight - thresholdY
      ) {
        handlePrev();
      } else if (
        clickX > thresholdX &&
        clickY > thresholdY &&
        clickY < window.innerHeight - thresholdY
      ) {
        handleNext();
      }
    };

    if (window.innerWidth <= 767) {
      document.addEventListener("click", handleScreenClick);
    }

    return () => {
      document.removeEventListener("click", handleScreenClick);
    };
  }, [handlePrev, handleNext]);

  return (
    <>
      <div className="wrapped_container">
        {initial && (
          <div className="wrapped_card">
            <div className="wrapped_header">
              <LogoSvg />
              <span className="wrapped_btn">Wrapped</span>
            </div>
            <h3>What a year it has been</h3>
            <div className="centre_wrap">
              <p className="storename">{wrappedDetails?.store?.name}</p>
            </div>
            <div className="summary">
              Let’s take a look at what{" "}
              <span>{wrappedDetails?.store?.name}</span> has been able to
              achieve with Bumpa this year.
            </div>
            <div className="jump_btn" onClick={startWrap}>
              Jump In
            </div>
          </div>
        )}

        {showWrapped && (
          <>
            <div className="status_card" ref={containerRef}>
              <Swiper
                onSlideChange={handleSlideChange}
                pagination={{
                  clickable: true,
                }}
                speed={1000}
                autoplay={{
                  delay: 15000,
                  disableOnInteraction: true,
                }}
                effect={"fade"}
                loop={false}
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                ref={sliderRef}
                noSwiping={window.innerWidth <= 767}
                noSwipingClass="swiper-no-swiping"
              >
                <SwiperSlide>
                  <div className="wrapped_card card_one">
                    <div className="wrapped_header">
                      <LogoSvg />
                      <span className="wrapped_btn">Wrapped</span>
                    </div>
                    <div className="summary status_summary">
                      The exchange rate went crazy but you still went above and
                      beyond to get{" "}
                      <span>
                        {wrappedDetails?.stats?.number_of_product_sold}
                      </span>{" "}
                      quality product
                      {wrappedDetails?.stats?.number_of_product_sold > 1 &&
                        "s"}{" "}
                      to sell to a total of{" "}
                      <span>
                        {
                          wrappedDetails?.stats
                            ?.number_of_customers_that_placed_order
                        }
                      </span>{" "}
                      customer
                      {wrappedDetails?.stats
                        ?.number_of_customers_that_placed_order > 1 && "s"}{" "}
                      who purchased this year.
                    </div>
                    <div className="bottom_box">
                      <div
                        className="mobile_controls btn_wrapper"
                        onClick={handleNext}
                      >
                        <WBack className="wback" />
                      </div>
                      <div className="desktop_controls">
                        <div className="btn_wrapper" onClick={handleNext}>
                          <NextIcon className="wback" />
                        </div>
                      </div>
                      <p className="copy">BUMPA WRAPPED 2023</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="wrapped_card card_two">
                    <div className="wrapped_header">
                      <LogoSvg />
                      <span className="wrapped_btn">Wrapped</span>
                    </div>

                    <div className="summary status_summary">
                      With your hardwork and business acumen, you received{" "}
                      <span>
                        {wrappedDetails?.stats?.number_of_paid_orders}{" "}
                      </span>{" "}
                      order
                      {wrappedDetails?.stats?.number_of_paid_orders > 1 &&
                        "s"}{" "}
                      and made{" "}
                      <span>
                        {wrappedDetails?.store?.settings?.currency_symbol}
                        {formatPricewrapp(wrappedDetails?.stats?.sales_amount)}
                      </span>{" "}
                      in sales this year alone, most of which came from{" "}
                      <span>{wrappedDetails?.stats?.highest_origin}</span>.
                    </div>

                    <div className="bottom_box">
                      <div
                        className="mobile_controls btn_wrapper"
                        onClick={handleNext}
                      >
                        <WBack className="wback" />
                      </div>
                      <div className="desktop_controls">
                        <div className="btn_wrapper" onClick={handlePrev}>
                          <PrevIcon className="wback" />
                        </div>
                        <div className="btn_wrapper" onClick={handleNext}>
                          <NextIcon className="wback" />
                        </div>
                      </div>

                      <p className="copy">BUMPA WRAPPED 2023</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="wrapped_card card_3">
                    <div className="wrapped_header">
                      <LogoSvg />
                      <span className="wrapped_btn">Wrapped</span>
                    </div>

                    <div className="summary status_summary">
                      Your customers seem to love{" "}
                      <span>{wrappedDetails?.stats?.most_sold_product}</span> as
                      they bought it{" "}
                      <span>
                        {wrappedDetails?.stats?.most_sold_product_count}
                      </span>{" "}
                      time
                      {wrappedDetails?.stats?.most_sold_product_count > 1 &&
                        "s"}{" "}
                      this year.
                    </div>

                    <div className="bottom_box">
                      <div
                        className="mobile_controls btn_wrapper"
                        onClick={handleNext}
                      >
                        <WBack className="wback" />
                      </div>
                      <div className="desktop_controls">
                        <div className="btn_wrapper" onClick={handlePrev}>
                          <PrevIcon className="wback" />
                        </div>
                        <div className="btn_wrapper" onClick={handleNext}>
                          <NextIcon className="wback" />
                        </div>
                      </div>

                      <p className="copy">BUMPA WRAPPED 2023</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="wrapped_card card_4">
                    <div className="wrapped_header">
                      <LogoSvg />
                      <span className="wrapped_btn">Wrapped</span>
                    </div>
                    <div className="summary status_summary">
                      You put in a lot of work in growing the relationships you
                      have with all your{" "}
                      <span>
                        {wrappedDetails?.stats?.total_number_of_customer}{" "}
                      </span>
                      customer
                      {wrappedDetails?.stats?.total_number_of_customer > 1 &&
                        "s"}{" "}
                      and you gave them a total of{" "}
                      <span>{wrappedDetails?.stats?.total_discount}</span>{" "}
                      discount{wrappedDetails?.stats?.total_discount > 1 && "s"}{" "}
                      this year!
                    </div>
                    <div className="bottom_box">
                      <div
                        className="mobile_controls btn_wrapper"
                        onClick={handleNext}
                      >
                        <WBack className="wback" />
                      </div>
                      <div className="desktop_controls">
                        <div className="btn_wrapper" onClick={handlePrev}>
                          <PrevIcon className="wback" />
                        </div>
                        <div
                          className="btn_wrapper"
                          onClick={() => {
                            {
                              handleNext();
                            }
                          }}
                        >
                          <NextIcon className="wback" />
                        </div>
                      </div>

                      <p className="copy">BUMPA WRAPPED 2023</p>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="wrapped_card card_two">
                    <div className="wrapped_header">
                      <LogoSvg />
                      <span className="wrapped_btn">Wrapped</span>
                    </div>
                    <div className="summary status_summary">
                      {timeLeft != 0 && (
                        <>
                          <p className="first_p text-center">
                            Doing some <br /> calculations...
                          </p>
                          <p className="time">0{timeLeft}</p>
                        </>
                      )}

                      {!timeLeft && (
                        <>
                          <p className="">
                            Here’s your Bumpa Gift Card for 2023
                          </p>
                        </>
                      )}
                    </div>
                    <div className="bottom_box">
                      {!timeLeft && (
                        <>
                          <div
                            className="mobile_controls btn_wrapper"
                            onClick={handleNext}
                          >
                            <WBack className="wback" />
                          </div>
                          <div className="desktop_controls">
                            <div className="btn_wrapper" onClick={handlePrev}>
                              <PrevIcon className="wback" />
                            </div>
                            <div className="btn_wrapper" onClick={handleNext}>
                              <NextIcon className="wback" />
                            </div>
                          </div>
                        </>
                      )}
                      <p className="copy">BUMPA WRAPPED 2023</p>
                    </div>
                  </div>
                </SwiperSlide>
                {/* persona1 */}
                {wrappedDetails?.stats?.number_of_paid_orders >= 2000 && (
                  <SwiperSlide>
                    <div className="wrapped_card persona_1">
                      <div className="wrapped_header">
                        <LogoSvg />
                        <span className="wrapped_btn persona-gold">
                          Wrapped
                        </span>
                      </div>

                      <div className="svg">
                        <img src={elite} alt="elite" className="img" />
                      </div>
                      <div className="persona_summary">
                        <p className="first_p">
                          You are one of the top ranking business owners in the
                          country!
                        </p>
                        <p className="">
                          Your dedication to your business is unrivalled as you
                          have have flourished in a difficult year, showing
                          other business owners how it is done.
                        </p>
                        <p>
                          We are proud of your grit, hardwork & determination.
                          Well done!
                        </p>
                      </div>
                      <div className="bottom_box">
                        <div className="action_wrapper">
                          <div
                            className="btn_download"
                            onClick={() => {
                              downloadImage(bus_elite, "elite");
                            }}
                          >
                            {!success && (
                              <>
                                <DownloadWrapped className="sized_icon" />
                                <span>Download</span>
                              </>
                            )}
                            {success && (
                              <>
                                <CheckIcon className="sized_icon" />
                                <span>Downloaded!</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="tag">#2023BumpaGiftCard</p>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
                {/* persona2 */}
                {wrappedDetails?.stats?.number_of_paid_orders > 999 &&
                  wrappedDetails?.stats?.number_of_paid_orders <= 1999 && (
                    <SwiperSlide>
                      <div className="wrapped_card persona_2">
                        <div className="wrapped_header">
                          <LogoSvg />
                          <span className="wrapped_btn">Wrapped</span>
                        </div>

                        <div className="svg">
                          <img src={mogul} alt="mogul" className="img" />
                        </div>
                        <div className="persona_summary p_2">
                          <p className="first_p ">
                            You’re clearly about your business and your coins
                            this year as you have pushed yourself to do amazing
                            numbers in sales and customer satisfaction!
                          </p>
                          <p className="">
                            You have been consistent in using Bumpa to grow your
                            business and we are proud to be a part of your
                            journey.
                          </p>
                        </div>
                        <div className="bottom_box">
                          <div className="action_wrapper">
                            <div
                              className="btn_download"
                              onClick={() => {
                                downloadImage(bus_mogul, mogul);
                              }}
                            >
                              {!success && (
                                <>
                                  <DownloadWrapped className="sized_icon" />
                                  <span>Download</span>
                                </>
                              )}
                              {success && (
                                <>
                                  <CheckIcon className="sized_icon" />
                                  <span>Downloaded!</span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="tag">#2023BumpaGiftCard</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}

                {/* persona3 */}
                {wrappedDetails?.stats?.number_of_paid_orders > 499 &&
                  wrappedDetails?.stats?.number_of_paid_orders <= 999 && (
                    <SwiperSlide>
                      <div className="wrapped_card persona_3">
                        <div className="wrapped_header">
                          <LogoSvg />
                          <span className="wrapped_btn">Wrapped</span>
                        </div>
                        <div className="svg">
                          <img
                            src={industry}
                            alt="industry_entrepreneur"
                            className="img"
                          />
                        </div>
                        <div className="persona_summary p_2">
                          <p className="first_p ">
                            You’ve shown up every day for this business and
                            taken it to the next level because you’re hungry for
                            more!
                          </p>
                          <p className="">It can only get better from here!</p>
                        </div>
                        <div className="bottom_box">
                          <div className="action_wrapper">
                            <div
                              className="btn_download"
                              onClick={() => {
                                downloadImage(industry_entre, "entrepreneur");
                              }}
                            >
                              {!success && (
                                <>
                                  <DownloadWrapped className="sized_icon" />
                                  <span>Download</span>
                                </>
                              )}
                              {success && (
                                <>
                                  <CheckIcon className="sized_icon" />
                                  <span>Downloaded!</span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="tag">#2023BumpaGiftCard</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}

                {/* persona4 */}
                {wrappedDetails?.stats?.number_of_paid_orders > 99 &&
                  wrappedDetails?.stats?.number_of_paid_orders <= 499 && (
                    <SwiperSlide>
                      <div className="wrapped_card persona_4">
                        <div className="wrapped_header">
                          <LogoSvg />
                          <span className="wrapped_btn">Wrapped</span>
                        </div>
                        <div className="svg">
                          <img src={grower} alt="grower" className="img" />
                        </div>
                        <div className="persona_summary p_2">
                          <p className="first_p ">
                            You have made considerable effort in business this
                            year and restrategised when necessary.
                          </p>
                          <p className="">
                            Your effort is admirable and we know you’re going to
                            do bigger numbers in 2024.
                          </p>
                        </div>
                        <div className="bottom_box">
                          <div className="action_wrapper">
                            <div
                              className="btn_download"
                              onClick={() => {
                                downloadImage(bus_grower, "grower");
                              }}
                            >
                              {!success && (
                                <>
                                  <DownloadWrapped className="sized_icon" />
                                  <span>Download</span>
                                </>
                              )}
                              {success && (
                                <>
                                  <CheckIcon className="sized_icon" />
                                  <span>Downloaded!</span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="tag">#2023BumpaGiftCard</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}

                {/* persona5 */}
                {wrappedDetails?.stats?.number_of_paid_orders > 9 &&
                  wrappedDetails?.stats?.number_of_paid_orders <= 99 && (
                    <SwiperSlide>
                      <div className="wrapped_card persona_5">
                        <div className="wrapped_header">
                          <LogoSvg />
                          <span className="wrapped_btn">Wrapped</span>
                        </div>
                        <div className="svg">
                          <img src={hustler} alt="hustle" className="img" />
                        </div>
                        <div className="persona_summary p_2">
                          <p className="first_p ">
                            You started this business knowing that it can be
                            tough, but you still put in some effort.
                          </p>
                          <p className="">
                            We know you have serious plans to grow your business
                            in 2024, and we are ready to support you on that.
                          </p>
                        </div>
                        <div className="bottom_box">
                          <div className="action_wrapper">
                            <div
                              className="btn_download"
                              onClick={() => {
                                downloadImage(bus_hustler, "hustler");
                              }}
                            >
                              {!success && (
                                <>
                                  <DownloadWrapped className="sized_icon" />
                                  <span>Download</span>
                                </>
                              )}
                              {success && (
                                <>
                                  <CheckIcon className="sized_icon" />
                                  <span>Downloaded!</span>
                                </>
                              )}
                            </div>
                          </div>
                          <p className="tag">#2023BumpaGiftCard</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}

                {/* persona6 */}
                {wrappedDetails?.stats?.number_of_paid_orders <= 9 && (
                  <SwiperSlide>
                    <div className="wrapped_card persona_6">
                      <div className="wrapped_header">
                        <LogoSvg />
                        <span className="wrapped_btn">Wrapped</span>
                      </div>
                      <div className="svg">
                        <img src={learner} alt="learner" className="img" />
                      </div>
                      <div className="persona_summary p_2">
                        <p className="first_p ">
                          There’s a lot of work and growth to be achieved for
                          your business in 2024.
                        </p>
                        <p className="">
                          You’ve started the first step by discovering Bumpa and
                          it can only get better from here!
                        </p>
                      </div>
                      <div className="bottom_box">
                        <div className="action_wrapper">
                          <div
                            className="btn_download"
                            onClick={() => {
                              downloadImage(bus_learner, "learner");
                            }}
                          >
                            {!success && (
                              <>
                                <DownloadWrapped className="sized_icon" />
                                <span>Download</span>
                              </>
                            )}
                            {success && (
                              <>
                                <CheckIcon className="sized_icon" />
                                <span>Downloaded!</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="tag">#2023BumpaGiftCard</p>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </>
        )}
      </div>
      {showModal && (
        <AcademyModal
          openModal={showModal}
          closeModal={() => closeAcedemyModal()}
        />
      )}
    </>
  );
};
