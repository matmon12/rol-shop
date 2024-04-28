<template>
  <div class="slider slider-product">
    <div class="container">
      <div class="slider__inner">
        <div class="swiper-object">
          <swiper
            class="slider-box"
            :modules="modules"
            :pagination="{
              el: pagination,
              clickable: true,
            }"
            :slides-per-view="1"
            :space-between="40"
            :navigation="{
              prevEl: prev,
              nextEl: next,
            }"
          >
            <swiper-slide v-for="item in slides" :key="item.id" class="slider-slide">
              <div class="slider-slide__wrapper">
                <div class="slider-slide__content">
                  <h1 class="slider-slide__title">
                    {{ item.title }}
                  </h1>
                  <p class="slider-slide__text">{{ item.composition }}</p>
                  <div class="slider-slide__box">
                    <button @click="$emit('sliderAddCart', item)" class="slider-slide__btn" :class="{'is-checked': item.isAdded}">В корзину</button>
                    <p class="slider-slide__price">{{ item.price }}<span>грн</span></p>
                  </div>
                </div>
              </div>
              <div class="slider-slide__wrapperimg">
                <img
                  class="slider-slide__img"
                  :src="require(`@/img/slider/${item.imgUrl}`)"
                  alt="slide"
                />
              </div>
              <div class="slider-slide__tag">Лучшее предложение недели!</div>
            </swiper-slide>
          </swiper>
          <div ref="pagination" class="swiper-pagination"></div>
          <div class="navigation">
            <div ref="prev" class="swiper-button-prev"></div>
            <div ref="next" class="swiper-button-next"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ref } from "vue";

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    slides: Array,
  },
  data() {
    return {
      slidesCount: 4,
    };
  },
  methods: {},
  setup() {
    const prev = ref(null);
    const next = ref(null);
    const pagination = ref(null);

    return {
      modules: [Pagination, Navigation],
      prev,
      next,
      pagination,
    };
  },
};
</script>

<style lang="scss" scoped>
.slider-slide {
  padding-top: 168px;
  overflow: hidden;
  border-radius: 24px;
  

  &__wrapper {
    height: 424px;
    background: var(--white);
    border-radius: 24px;
  }

  &__content {
    padding: 68px 0 0 98px;
    max-width: 486px;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 54px;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 16px;
  }

  &__text {
    font-size: 20px;
    font-weight: 400;
    color: var(--grey-dark);
    margin-bottom: 34px;
  }

  &__box {
    display: flex;
    gap: 24px;
  }

  &__btn {
    background-color: var(--grey-light);
    border-radius: $border;
    padding: 12px 24px;
    color: #00cc2d;
    font-size: 16px;
    font-weight: 500;
    transition: $transition;
  }

  &__price {
    color: var(--grey-dark);
    font-size: 40px;
    font-weight: 700;
    line-height: 80%;
    span {
      color: var(--grey-text);
      font-size: 26px;
      font-weight: 700;
      margin-left: 8px;
    }
  }

  &__wrapperimg {
    top: 0;
    max-width: 916px;
    position: absolute;
    height: 100%;
    right: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
    max-height: 100%;
    // object-fit: cover;
  }

  &__tag {
    background-color: #f63;
    border-radius: 500px 0px 24px 0px;
    padding: 24px 34px 24px 46px;
    color: var(--white);
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 125%;
  }
}
.swiper-object {
  position: relative;
  margin-bottom: 57px;
  // overflow-y: hidden;
}

.is-checked{
  background-color: #00cc2d;
  color: var(--white);
}
</style>

<style lang="scss">
.slider-product {
  .swiper-horizontal > .swiper-pagination-bullets,
  .swiper-pagination-bullets.swiper-pagination-horizontal {
    bottom: -50px;
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
    background: #f63;
  }
  .swiper-button-disabled {
    display: none;
  }
  .swiper-button-next,
  .swiper-button-prev {
    background: rgba(39, 39, 39, 0.05);
    border-radius: $border;
    width: 75px;
    height: 162px;
    top: calc(50% + 84px);
    margin: 0;
    transform: translateY(-50%);

    &::before {
      content: url("@/img/icon/arrow-right.svg");
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 40px;
    }
    &::after {
      display: none;
    }
  }
  .swiper-button-prev {
    left: -37px;

    &::before {
      transform: translate(-50%, -50%) rotate(-180deg);
    }
  }
  .swiper-button-next {
    right: -37px;
  }
  .swiper {
  }
}
</style>
