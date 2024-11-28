import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation,Virtual } from "swiper/modules";

const images = [
  "https://www.inventvm.com/wp-content/uploads/2024/01/grafico-great-power-1.png",
  "https://www.inventvm.com/wp-content/uploads/2024/01/technology-appl.png",
  "https://www.inventvm.com/wp-content/uploads/2024/01/grafico-tws-platform.png",
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
            src="https://www.inventvm.com/wp-content/uploads/2024/01/grafico-great-power-1.png"
            loading="lazy"
            className="scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://www.inventvm.com/wp-content/uploads/2024/01/technology-appl.png"
            loading="lazy"
            className="scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
          />
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://www.inventvm.com/wp-content/uploads/2024/01/grafico-tws-platform.png"
            loading="lazy"
            className="scale-75 lg:scale-55 md:scale-80 xl:scale-10 "
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
