<template>
  <div class="slider">
    <div class="container">
      <div class="slider__inner">
        <swiper
          class="slider-box"
          :modules="modules"
          :pagination="{ clickable: true }"
          :slides-per-view="1"
          :space-between="10"
        >
          <swiper-slide v-for="item in slidesCount" :key="item" class="slider-slide">
            <img class="slider-slide__img" src="@/img/banner.png" alt="slide" />
            <div class="slider-slide__box">
              <h1 class="slider-slide__title">
                Ninja Sushi в Киеве! Пока только на левом берегу
              </h1>
              <p class="slider-slide__text">Доставку делаем с 10:00 до 19:30</p>
              <app-button class="slider-slide__btn">Перейти к новости</app-button>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slidesCount: 4,
    };
  },
  setup() {
    return {
      modules: [Pagination],
    };
  },
};
</script>

<style lang="scss" scoped>
.slider {
  &__inner {
    width: 100%;
  }
  &-box {
    border-radius: 24px;
  }
}

.slider-slide {
  height: 686px;
  padding: 118px 0 0 94px;
  position: relative;
  display: flex;
  justify-content: flex-start;

  &__img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__box {
    z-index: 10;
    max-width: 565px;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 64px;
    font-weight: 700;
    line-height: 128.125%;
    margin-bottom: 16px;
  }

  &__text {
    color: var(--grey-text);
    font-size: 20px;
    line-height: 140%;
    font-weight: 400;
    margin-bottom: 24px;
  }

  &__btn {
    width: 311px;
  }
}

</style>
<style lang="scss">
.swiper-horizontal > .swiper-pagination-bullets,
.swiper-pagination-bullets.swiper-pagination-horizontal {
  bottom: 13px;
  top: auto;
  left: 0;
  width: 100%;
}
.swiper-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet,
.swiper-pagination-horizontal.swiper-pagination-bullets .swiper-pagination-bullet {
  margin: 7px;
}
.swiper-pagination-bullet {
  width: 11px;
  height: 11px;
  background: #d2d2d7;
  opacity: 1;
}
.swiper-pagination-bullet-active {
  background: #F63;
}
</style>