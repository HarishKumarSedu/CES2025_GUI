import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation,Virtual } from "swiper/modules";
import ivm6303 from '../../assets/products/IVM6303.png'
import ivm6310 from '../../assets/products/IVM6310.png'
import ivm6311 from '../../assets/products/IVM6311.png'
import ivm6312 from '../../assets/products/IVM6312.png'
import ivm6303_phone_demo from '../../assets/demos/ivm6303_phone_demo.jpg'
import ivm6310_dragonfly_demo from '../../assets/demos/ivm6310_dragonfly_demo.jpg'
import ivm6310_switch_button_demo from '../../assets/demos/ivm6310_switch_button_demo.jpg'
import ivm6311_bdsound_demo from '../../assets/demos/ivm6311_bdsound_demo.jpg'

const images = [
  // "https://www.inventvm.com/wp-content/uploads/2024/01/grafico-great-power-1.png",
  // "https://www.inventvm.com/wp-content/uploads/2024/01/technology-appl.png",
  // "https://www.inventvm.com/wp-content/uploads/2024/01/grafico-tws-platform.png",
  // ivm6303,
  // ivm6310,
  // ivm6311,
  // ivm6312
  ivm6303_phone_demo
];

const Carousel = () => {
  return (
    <motion.div
      className="bg-gray-900 bg-opacity-50 rounded-xl border-collapse  "
      initial={{ opacity: 0, width: 20 }}
      animate={{ opacity: 1, width: "auto" }}
      transition={{ delay: 0.2 }}
    >
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
          height:"90%",
          width: "90%"
        }}
        pagination={{
          clickable: true,
          type: 'bullets'
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation,Virtual]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={ivm6303_phone_demo}
            loading="lazy"
            className="rounded-lg scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={ivm6310_dragonfly_demo}
            loading="lazy"
            className="rounded-lg  scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={ivm6310_switch_button_demo}
            loading="lazy"
            className="rounded-lg  scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white -mt-1"></div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={ivm6311_bdsound_demo}
            loading="lazy"
            className="rounded-lg  scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white -mt-1"></div>
        </SwiperSlide>
        {/* {
          images.map((path,index) => {
            <SwiperSlide key={index}>
            <img
              src = {path}
              loading="lazy"
              className="scale-50"
              key={index}
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white" key={index}></div>
          </SwiperSlide >
          })
        } */}
      </Swiper>
    </motion.div>
  );
};

export default Carousel;
