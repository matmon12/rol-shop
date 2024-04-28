<template>
  <div class="addition">
    <h5 class="addition-title">Рекомендуем добавить</h5>
    <div class="swiper-object-4">
      <swiper
        class="addition-slider"
        :modules="modules"
        :slides-per-view="4"
        :slides-per-group="3"
        :space-between="20"
        :navigation="{
          prevEl: prev,
          nextEl: next,
        }"
      >
        <swiper-slide v-for="item in slides" :key="item.id">
          <div
            class="addition-slider__slide"
            @click="$router.push(`/rol-shop/${item.category}/${item.id}`)"
          >
            <div class="addition-slider__imgwrapper">
              <img
                class="addition-slider__img"
                :src="require(`@/img/products/${item.imgUrl}`)"
                alt="product"
              />
            </div>
            <h6 class="addition-slider__title">{{ item.title }}</h6>
            <p v-if="item.weight" class="addition-slider__text">{{ item.weight }} г</p>
            <p v-else class="addition-slider__text">{{ item.volume }} л</p>
            <div class="addition-slider__box">
              <p class="addition-slider__price">{{ item.price }}<span>грн</span></p>
            </div>
          </div>
          <button class="addition-slider__btn" @click="$emit('orderAddCart', item)" :class="{'addition-slider__btn--added': item.isAdded}">
            <img src="@/img/icon/plus.svg" alt="" />
          </button>
        </swiper-slide>
      </swiper>
      <div class="navigation">
        <div ref="prev" class="addition-slider-prev">
          <img src="@/img/icon/arrow-order.svg" alt="">
        </div>
        <div ref="next" class="addition-slider-next">
          <img src="@/img/icon/arrow-order.svg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    slides: Array,
  },
  setup() {
    const swiper = ref();
    const prev = ref(null);
    const next = ref(null);

    return {
      modules: [Navigation],
      swiper,
      prev, next
    };
  },
};
</script>

<style lang="scss" scoped>
.addition-slider {
  &__price {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 700;
    line-height: 80%;
    span {
      color: var(--grey-text);
      font-size: 16px;
      font-weight: 700;
      margin-left: 5px;
    }
  }
  &__slide {
    width: 100%;
    background-color: var(--white);
    border-radius: 24px;
    height: 312px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }

  &__imgwrapper {
    width: 100%;
    height: 119px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  &__img {
    object-fit: cover;
  }

  &__title {
    color: var(--grey-dark);
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__text {
    color: rgb(255, 102, 51);
    font-size: 14px;
    font-weight: 500;
  }

  &__box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    height: 38px;
  }

  &__btn {
    width: 60px;
    height: 38px;
    background-color: rgb(204, 245, 213);
    border-radius: $border;
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 100;
    transition: $transition;
    &--added{
      background-color: #00cc2d;
    }
  }
  &-prev:not(.swiper-button-disabled), 
  &-next:not(.swiper-button-disabled) {
    background-color: rgba(39, 39, 39, 0.05);
    border-radius: $border;
    top: 50%;
    width: 47px;
    height: 102px;
    position: absolute;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  &-prev{
    left: 0;
    transform: translate(-50%, -50%);
    img{
      transform: rotate(180deg);
    }
  }
  &-next{
    right: 0;
    transform: translate(50%, -50%);
  }
}
.addition-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--grey-dark);
  margin-bottom: 24px;
}
.swiper-object-4 {
  position: relative;
}
</style>

<style lang="scss">

.swiper-button-disabled{
    display: none;
  }
</style>
