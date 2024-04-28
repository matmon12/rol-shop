<template>
  <div class="slider-tovar">
    <div class="container">
      <div class="slider-tovar__inner">
        <div class="swiper-object-3">
          <swiper
            ref="mySwiper"
            class="slider-tovar__box"
            :modules="modules"
            :slides-per-view="4"
            :slides-per-group="4"
            :space-between="20"
            @swiper="onSwiper"
          >
            <swiper-slide v-for="item in slides" :key="item.id">
              <Card
                :id="item.id"
                :title="item.title"
                :weight="item.weight"
                :volume="item.volume"
                :composition="item.composition"
                :price="item.price"
                :imgUrl="item.imgUrl"
                :isHit="item.isHit"
                :isNew="item.isNew"
                :filter_1="item.filter_1"
                :filter_2="item.filter_2"
                :filter_3="item.filter_3"
                :is-favorite="item.isFavorite"
                :is-added="item.isAdded"
                :category="item.category"
                :on-click-favorite="() => $emit('addToFavorite', item)"
                :on-click-add="() => $emit('addToCart', item)"
                class="card-item"
              />
            </swiper-slide>
          </swiper>
          <div class="navigation">
            <button
              class="swiper-button-next"
              @click="$emit('onSlideChangeNext', 'next', swiper)"
              :disabled="pageNumber == totalPages"
            ></button>
            <button
              class="swiper-button-prev"
              @click="$emit('onSlideChangePrev', 'prev', swiper)"
              :disabled="pageNumber == 1"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    slides: Array,
    pageNumber: Number,
    totalPages: Number
  },
  computed: {},
  setup() {
    const swiper = ref();

    const onSwiper = (instance) => {
      swiper.value = instance;
      swiper.value.allowTouchMove = false;
    }

    return {
      modules: [Navigation],
      onSwiper,
      swiper,
    };
  },
};
</script>

<style lang="scss" scoped>
.slider-tovar {
  .swiper-button-next,
  .swiper-button-prev {
    background: rgba(39, 39, 39, 0.05);
    border-radius: $border;
    width: 75px;
    height: 162px;
    top: 50%;
    margin: 0;

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
    &:disabled{
      display: none;
    }
  }
  .swiper-button-prev {
    left: 0;
    transform: translate(-50%, -50%);

    &::before {
      transform: translate(-50%, -50%) rotate(-180deg);
    }
  }
  .swiper-button-next {
    right: 0;
    transform: translate(50%, -50%);
  }
  .swiper-button-lock {
    // display: block;
  }
}
.swiper-object-3 {
  position: relative;
}
</style>
