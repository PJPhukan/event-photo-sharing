import React, { useEffect, useState } from "react";
import "./testimonial.scss";
import data from "../../data/testimonial";
import TestimonialCard from "../../component/TestimonialCard/TestimonialCard";
import showOffData from "../../data/show-off";

// swiper js
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import ShowOffCard from "../../component/ShowOffCard/ShowOffCard";

const Testimonial = () => {
  const [numberItem, setnumberItem] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setnumberItem(1.4);
      } else if (window.innerWidth <= 1024) {
        setnumberItem(2);
      } else {
        setnumberItem(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="testimonial-section">
      <div className="main-content">
        <div className="testimonial-copy" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <div className="heading">Customer Testimonials</div>
          <div className="sub-heading">
            Hosts, guests, and event teams use Memois to make photo delivery feel faster, cleaner, and more private.
          </div>
        </div>

        <div className="show-off">
          {showOffData.map((item) => {
            return <ShowOffCard key={item.id} item={item} />;
          })}
        </div>

        <div className="testimonial-content">
          <Swiper
            slidesPerView={numberItem}
            spaceBetween={16}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
            }}
            loop={true}
            modules={[Autoplay]}
            className="mySwiper"
          >
            {data.map((card) => {
              return (
                <SwiperSlide key={card.id}>
                  <TestimonialCard card={card} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
