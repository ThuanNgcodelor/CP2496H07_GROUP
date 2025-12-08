import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import shape1 from '../../assets/images/slider/shape1.png';

// Cat images
import slider1 from '../../assets/images/slider/slider1-bg1.jpg';


// Banner images
import banner1 from '../../assets/images/shop/banner/01.png';
import banner2 from '../../assets/images/shop/banner/02.png';
import banner3 from '../../assets/images/shop/banner/03.png';

export default function Slider() {
  return (
    <>
      <section className="hero-slider-area position-relative">
        <Swiper
          className="hero-slider-container"
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          slidesPerGroup={1}
          spaceBetween={0}
          loop={true}
          speed={700}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ el: '.hero-slider-pagination', clickable: true }}
        >

        </Swiper>
      </section>

      {/* Product Banner Area */}
      <section className="product-banner-area section-top-space">
        <div className="container">
          <Swiper className="banner-slider-container" modules={[Autoplay]} slidesPerView={3} spaceBetween={30} breakpoints={{
            1200: { slidesPerView: 3 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            320: { slidesPerView: 2, spaceBetween: 15 },
            0: { slidesPerView: 1 }
          }}>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner1} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner2} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner3} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>
    </>
  );
}

/* Reusable slide content component */
function SlideContent({ title, subtitle, desc, link, img, isFirst = false }) {
  return (
    <div className="hero-slide-item">
      <div className="container">
        <div className="row align-items-center position-relative">
          <div className="col-12 col-sm-6">
            <div className="hero-slide-content">
              <div className="hero-slide-shape-img">
                <img src={shape1} width="180" height="180" alt="Shape" />
              </div>
              <h4 className="hero-slide-sub-title">{subtitle}</h4>
              {isFirst ? (
                <h1 className="hero-slide-title">{title}</h1>
              ) : (
                <h2 className="hero-slide-title">{title}</h2>
              )}
              <p className="hero-slide-desc">{desc}</p>
              <div className="hero-slide-meta">
                <a className="btn btn-border-primary" href={link}>Shop Now</a>
                <a className="ht-popup-video" data-fancybox data-type="iframe" href="https://player.vimeo.com/video/172601404?autoplay=1">
                  <i className="fa fa-play icon"></i>
                  <span>Play Now</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="hero-slide-thumb">
              <img
                src={img}
                width="555"
                height="550"
                alt={title}
                style={{
                  borderRadius: "20px",
                  objectFit: "cover"
                }}
              />
            </div>
          </div>
        </div>
        <div className="hero-social">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener">fb</a>
          <a href="https://www.twitter.com/" target="_blank" rel="noopener">tw</a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener">in</a>
        </div>
      </div>
    </div>
  );
}
