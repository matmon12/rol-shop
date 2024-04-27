<template>
  <div >
    <div class="tovar">
      <div class="container">
        <div class="tovar__inner">
          <Category class="category" />

          <Crumbs :paths="paths" class="tovar-crumbs" />

          <div class="tovar__content">
            <div class="tovar-wrapper" v-if="Object.keys(this.product).length > 0">
              <div class="tovar__left">
                <div class="tovar__imgwrapper">
                  <img
                    class="tovar__img"
                    :src="require(`@/img/products/${product.imgUrl}`)"
                    alt="product"
                  />
                  <img src="@/img/back.png" alt="back" class="tovar-back" />
                  <div class="tovar__filters">
                    <div class="tovar__filter filter_1" v-if="product.filter_2">
                      <img src="@/img/icon/filter-2.svg" alt="icon" />
                      <p>Вегеторианское</p>
                    </div>
                    <div class="tovar__filter filter_2" v-if="product.filter_1">
                      <img src="@/img/icon/filter-1.svg" alt="icon" />
                      <p>Острое</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tovar__right">
                <div class="tovar__tags">
                  <p class="tovar__tag tovar__tag-hit" v-if="product.isHit">Hit</p>
                  <p class="tovar__tag tovar__tag-new" v-if="product.isNew">New</p>
                </div>
                <h1 class="tovar__title">{{ product.title }}</h1>
                <p v-if="product.weight" class="tovar-weight">
                  Вес: {{ product.weight }}г
                </p>
                <p v-else class="tovar-weight">Объем: {{ product.volume }}л</p>
                <p v-if="product.weight" class="tovar-components">Состав:</p>

                <div v-if="product.weight" class="swiper-object-2">
                  <swiper
                    :modules="modules"
                    :slides-per-view="5"
                    :slides-per-group="3"
                    :space-between="8"
                    :navigation="{
                      prevEl: prev,
                      nextEl: next,
                    }"
                    class="tovar-slider"
                  >
                    <swiper-slide
                      v-for="(slide, id) in components"
                      :key="id"
                      class="tovar-slider__slide"
                    >
                      <div class="tovar-components__imgwrapper">
                        <img
                          v-if="components.length > 0"
                          class="tovar-components__img"
                          :src="require(`@/img/ingredients/${slide.imgUrl}`)"
                          alt="component"
                        />
                      </div>
                      <p class="tovar-components__text">{{ slide.name }}</p>
                    </swiper-slide>
                  </swiper>
                  <div class="navigation">
                    <div ref="prev" class="swiper-button-prev"></div>
                    <div ref="next" class="swiper-button-next"></div>
                  </div>
                </div>

                <label v-if="product.weight" class="switch-box">
                  <div class="switch">
                    <input type="checkbox" :checked="product.filter_3" />
                    <span class="round"></span>
                  </div>
                  Безлактозное
                </label>

                <div class="tovar__shop">
                  <p class="tovar__price">{{ product.price }}<span>грн</span></p>
                  <button
                    class="tovar__cart"
                    :class="{ 'is-added': product.isAdded }"
                    @click="onClickAddPlus(product, 'product')"
                  >
                    В корзину
                    <img
                      :src="
                        !product.isAdded
                          ? require('@/img/icon/cart-green.svg')
                          : require('@/img/icon/cart-white.svg')
                      "
                      alt="cart"
                    />
                  </button>
                  <button
                    class="tovar__favorite"
                    :class="{ 'is-favorite': product.isFavorite }"
                    @click="addToFavorite(product), syncFavorite('product')"
                  >
                    <img
                      :src="
                        !product.isFavorite
                          ? require('@/img/icon/heart-orange.svg')
                          : require('@/img/icon/favorite-checked.svg')
                      "
                      alt="heart"
                    />
                  </button>
                </div>
              </div>

              <button
                class="tovar__btn-prev"
                @click="onClickGoItem('prev')"
                :disabled="buttonDisabledPrev"
              >
                <img src="@/img/icon/arrow-right.svg" alt="arrow" />
              </button>
              <button
                class="tovar__btn-next"
                @click="onClickGoItem('next')"
                :disabled="buttonDisabledNext"
              >
                <img src="@/img/icon/arrow-right.svg" alt="arrow" />
              </button>
            </div>

            <div v-if="isLoading" class="loader-box loader-slides">
              <span class="loader"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tovar-slider__wrapper">
      <div class="container">
        <div class="tovar-slider__head">
          <h6 class="tovar-slider__title">Может, еще кое-что?</h6>
          <div class="tovar-slider__count">{{ pageNumber }} из {{ totalPagesSlide }}</div>
        </div>
      </div>

      <SliderCategory
        :slides="slidesTovar"
        :pageNumber="pageNumber"
        :totalPages="totalPagesSlide"
        @on-slide-change-prev="(direction, swiper) => onSlideChange(direction, swiper)"
        @on-slide-change-next="(direction, swiper) => onSlideChange(direction, swiper)"
        @add-to-favorite="
          (item) => {
            this.addToFavorite(item), syncFavorite('slides', item);
          }
        "
        @add-to-cart="(item) => onClickAddPlus(item, 'slides')"
        v-intersection="{ active: () => loadSlides() }"
      />
      <div v-if="isLoadingSlides" class="loader-box loader-slides">
        <span class="loader"></span>
      </div>
    </div>

    <div class="tovar-info">
      <div class="container">
        <InfoText class="tovar-info" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject, ref, computed } from "vue";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/vue";
import { mapActions, mapMutations } from "vuex";
import "swiper/css";
import "swiper/css/navigation";

export default {
  data() {
    return {
      error: false,
      products: [],
      category: null,
      currentPathName: "",
      categoryMap: {
        rolls: "Роллы",
        sushi: "Суши",
        sets: "Сеты",
        snacks: "Боулы",
        drinks: "Напитки",
        rollsq: "Соусы",
      },
      components: [],
      idFirst: 0,
      idLast: 0,
      isLoading: false,
      isLoadingSlides: false,
      signalItem: null,
      signalIngredients: null,
      lastRequestItem: null,
      lastRequestIngredients: null,
      pageSlide: 1,
      pageNumber: 1,
      limitSlide: 4,
      currentPageSlide: 0,
      totalPagesSlide: 0,
      buttonDisabledPrev: computed(() => Number(this.$route.params.id) == this.idFirst),
      buttonDisabledNext: computed(() => Number(this.$route.params.id) == this.idLast),
    };
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  computed: {
    paths() {
      return [
        {
          name: this.categoryMap[this.category],
          path: `/rol-shop/${this.$route.params.category}`,
        },
        { name: this.currentPathName, path: this.$route.params },
      ];
    },
  },
  methods: {
    ...mapActions({
      addToFavorite: "favorite/addToFavorite",
    }),
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchItems(id) {
      let apiRes = null;
      try {
        this.isLoading = true;

        this.controller = new AbortController();
        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?id=${id}`,
          {
            signal: this.controller.signal,
          }
        );

        this.product = {
          ...data[0],
          isFavorite: false,
          favoriteId: null,
          isAdded: false,
          count: 1,
        };

        // название текущей страницы в хлебных крошках
        this.currentPathName = this.product.title;
      } catch (err) {
        if (err.response) {
          apiRes = err.response.status;
        }
      } finally {
        this.isLoading = false;
        if (apiRes == 404) {
          this.error = true;
          this.$router.push('/rol-shop/404');
        }
        // обновление crumbs
        this.setPaths(this.paths);
      }
    },
    async fetchFavorite() {
      let apiRes = null;
      try {
        const { data: favorites } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/favorites`
        );

        const favorite = favorites.find(
          (favorite) => favorite.item_id === this.product.id
        );
        if (favorite) {
          this.product.isFavorite = true;
          this.product.favoriteId = favorite.id;
        }
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.error = true;
          this.$router.push('/rol-shop/404');
        }
      }
    },
    async fetchIngredients() {
      // остановка запросов перед следующим вызовом функции
      const controller = new AbortController();

      if (this.lastRequestIngredients) {
        this.lastRequestIngredients.abort();
      }

      this.lastRequestIngredients = controller;
      this.signalIngredients = controller.signal;

      // в массив и обработка игредиентов
      if (this.product.composition) {
        let ingredients = this.product.composition.split(",");
        ingredients = ingredients.map((obj) => obj.trim());

        let apiRes = null;
        try {
          // очистка массива
          this.components = [];

          for (const ingredient of ingredients) {
            const {
              data: resurs,
            } = await axios.get(
              `https://c2ff7a8de0a119c8.mokky.dev/components?name=*${ingredient}`,
              { signal: this.signalIngredients }
            );

            if (resurs.length > 0) {
              this.components.push(resurs[0]);
            }
          }
        } catch (err) {
          if (err.response) {
            apiRes = err.response.status;
          }
          if (axios.isCancel(err)) {
            console.log(err);
          }
        } finally {
          if (apiRes == 404) {
            this.error = true;
            this.$router.push('/rol-shop/404');
          }
        }
      }
    },
    onClickGoItem(to) {
      const currentId = Number(this.$route.params.id);
      if (to == "next" && currentId < this.idLast) {
        this.$router.push(`/rol-shop/${this.category}/${currentId + 1}`);
      }
      if (to == "prev" && currentId > this.idFirst) {
        this.$router.push(`/rol-shop/${this.category}/${currentId - 1}`);
      }
    },
    async countItemsCategory() {
      try {
        const { data: limit } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?category=${this.category}&limit=1`
        );

        // ID первой и последнего товаров в категории
        this.idFirst = limit.items[0].id;
        this.idLast = limit.items[0].id + limit.meta.total_items - 1;
      } catch (err) {
        console.log(err);
      }
    },
    load(id) {
      this.fetchItems(id).then(() => {
        // включение кнопки корзины
        this.cart.some((cartItem) => cartItem.id === this.product.id)
          ? (this.product.isAdded = true)
          : null;

        this.fetchFavorite();
        this.fetchIngredients();
      });
    },
    async fetchSlides() {
      try {
        this.isLoadingSlides = true;

        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?page=${this.pageSlide}&limit=${this.limitSlide}&category=${this.category}`
        );

        this.slidesTovar = this.slidesTovar.concat(
          data.items.map((obj) => ({
            ...obj,
            isFavorite: false,
            favoriteId: null,
            isAdded: false,
            count: 1,
          }))
        );

        // текущая загруженная страница
        this.currentPageSlide = data.meta.current_page;
        this.totalPagesSlide = data.meta.total_pages;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoadingSlides = false;
      }
    },
    async fetchFavoriteSlides() {
      try {
        const { data: favorites } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/favorites`
        );

        this.slidesTovar = this.slidesTovar.map((item) => {
          const favorite = favorites.find((favorite) => favorite.item_id === item.id);

          if (!favorite) {
            return item;
          }

          return {
            ...item,
            isFavorite: true,
            favoriteId: favorite.id,
          };
        });
      } catch (err) {
        console.log(err);
      }
    },
    loadSlides() {
      this.fetchSlides().then(() => {
        // включение кнопки для слайдов
        this.slidesTovar = this.slidesTovar.map((item) => ({
          ...item,
          isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
        }));
        this.fetchFavoriteSlides();
      });
    },
    onSlideChange(direction, swiper) {
      if (direction == "prev") {
        if (this.pageNumber > 1) {
          // текущая страница в слайдере
          this.pageNumber = this.pageNumber - 1;
          swiper.slidePrev();
        }
      }
      if (direction == "next") {
        if (this.pageNumber < this.totalPagesSlide) {
          this.pageNumber = this.pageNumber + 1;
          if (this.pageNumber <= this.currentPageSlide) {
            //  если уже была загружена
            swiper.slideNext();
          } else {
            this.pageSlide = this.pageSlide + 1;
            this.fetchSlides().then(() => {
              // включение кнопки для слайдов
              this.slidesTovar = this.slidesTovar.map((item) => ({
                ...item,
                isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
              }));
              this.fetchFavoriteSlides();
              // переход
              swiper.slideNext();
            });
          }
        }
      }
    },
    syncFavorite(type, item) {
      if (type == "product") {
        const sliderItem = this.slidesTovar.find((pl) => pl.id === this.product.id);
        if (sliderItem) {
          if (!sliderItem.isFavorite) {
            sliderItem.isFavorite = true;
          } else {
            sliderItem.isFavorite = false;
          }
        }
      }
      if (type == "slides") {
        if (item.id == this.product.id) {
          if (!this.product.isFavorite) {
            this.product.isFavorite = true;
          } else {
            this.product.isFavorite = false;
          }
        }
      }
    },
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.category = to.params.category;
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.category = to.params.category;
    // для перехода к другому товару
    this.load(to.params.id);

    next();
  },
  mounted() {
    this.load(this.$route.params.id);
    if (!this.error) {
      this.countItemsCategory();
    }

    // очистка слайдера
    this.slidesTovar = [];
  },
  setup() {
    const prev = ref(null);
    const next = ref(null);
    const { product, slidesTovar } = inject("items");
    const { cart, addToCart, removeFromCart } = inject("cart");

    const onClickAddPlus = (item, type) => {
      if (!item.isAdded) {
        addToCart(item);
        // синхрон между товаром и слайдером (корзина)
        if (type == "product") {
          slidesTovar.value.forEach((element) => {
            if (element.id == item.id) {
              element.isAdded = true;
            }
          });
        }
        if (type == "slides" && product.value.id === item.id) {
          product.value.isAdded = true;
        }
      } else {
        removeFromCart(item);

        // изменение состояния кнопки товара
        product.value.isAdded = false;
        product.value.count = 1;

        // карточка слайдера
        slidesTovar.value.forEach((pl) => {
          if (pl.id === item.id) {
            pl.isAdded = false;
            pl.count = 1;
          }
        });
      }
    };

    return {
      modules: [Navigation],
      product,
      prev,
      next,
      cart,
      onClickAddPlus,
      slidesTovar,
    };
  },
};
</script>

<style lang="scss">
.tovar-crumbs {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
}
.category {
  z-index: 10;
  margin-bottom: 32px;
}
.tovar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 70px;
  position: relative;
}
.tovar {
  position: relative;
  margin-bottom: 88px;
  &__inner {
    position: relative;
    padding-top: 40px;
  }
  &__content {
    position: relative;
  }
  &-slider {
    &__wrapper {
      position: relative;
      margin-bottom: 88px;
    }
    &__head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    &__title {
      color: var(--grey-dark);
      font-size: 38px;
      font-weight: 700;
      line-height: 105%;
    }
    &__count {
      color: var(--grey-text);
      font-size: 32px;
      font-weight: 500;
      line-height: 125%;
    }
  }

  &-info {
    margin-bottom: 34px;
  }
  &__left {
    width: 40%;
  }
  &__imgwrapper {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    position: relative;
  }

  &-back {
    position: absolute;
    left: 60%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1.2);
    z-index: -1;
  }

  &__img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    object-fit: cover;
  }

  &__filters {
    position: absolute;
    top: 15%;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__filter {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    line-height: 133%;
    width: fit-content;
    img {
      width: 18px;
    }
  }
  .filter_1 {
    color: #6bc026;
    background-color: #d9f4c5;
  }
  .filter_2 {
    background-color: #fbdcd5;
    color: #eb5757;
  }

  &__right {
    padding-top: 90px;
    max-width: 50%;
    min-width: 45%;
  }

  &__tags {
    display: flex;
    gap: 8px;
  }

  &__tag {
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 111%;
    margin-bottom: 8px;
    &-new {
      background-color: #ccf5d5;
      color: #00cc2d;
    }
    &-hit {
      background-color: #fbdcd5;
      color: #f63;
    }
  }

  &__title {
    color: var(--grey-dark);
    font-size: 54px;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 16px;
  }

  &__shop {
    display: flex;
    align-items: center;
  }

  &__price {
    color: var(--grey-dark);
    font-size: 40px;
    font-weight: 700;
    line-height: normal;
    margin-right: 32px;
    span {
      color: var(--grey-text);
      font-size: 26px;
      font-weight: 700;
      margin-left: 8px;
    }
  }

  &__cart {
    height: 56px;
    padding: 16px 24px;
    background: var(--white);
    border-radius: $border;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #00cc2d;
    margin-right: 16px;
    transition: $transition;
  }

  &__favorite {
    height: 56px;
    padding: 16px;
    background: var(--white);
    border-radius: $border;
    display: flex;
    transition: $transition;
  }

  &-slider {
    widows: 100%;
    &__slide {
      height: 102px;
      border-radius: 8px;
      background: var(--white);
      padding: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
  }

  .swiper-button-disabled {
    display: none;
  }
  .swiper-button-next,
  .swiper-button-prev {
    background: var(--white);
    border-radius: 8px;
    width: 47px;
    height: 100%;
    top: 0;
    margin: 0;

    &::before {
      content: url("@/img/icon/arrow-right-mini.svg");
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 24px;
    }
    &::after {
      display: none;
    }
  }
  .swiper-button-prev {
    left: 0;

    &::before {
      transform: translate(-50%, -50%) rotate(-180deg);
    }
  }
  .swiper-button-next {
    right: 0;
  }
  .is-favorite {
    background: #f63;
  }
  .is-added {
    color: var(--white);
    background-color: #00cc2d;
  }

  &__btn-prev,
  &__btn-next {
    width: 75px;
    height: 162px;
    background-color: rgba(39, 39, 39, 0.05);
    border-radius: $border;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    &:disabled {
      background-color: rgba(39, 39, 39, 0.2);
      cursor: default;
    }
  }
  &__btn-prev {
    left: 0;
    transform: translate(-50%, -50%);

    img {
      transform: rotate(180deg);
    }
  }
}
.swiper-object-2 {
  position: relative;
  padding-right: 55px;
  margin-bottom: 25px;
}
.tovar-weight {
  color: #f63;
  font-size: 24px;
  font-weight: 500;
  line-height: 125%;
  margin-bottom: 24px;
}
.tovar-components {
  color: var(--grey-dark);
  font-weight: 500;
  margin-bottom: 12px;

  &__imgwrapper {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__img {
  }

  &__text {
    color: var(--grey-dark);
    font-size: 14px;
    font-weight: 500;
    line-height: 142%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}

// switch
.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 35px;
  &-box {
    display: flex;
    align-items: center;
    gap: 16px;
    color: var(--grey-dark);
    font-size: 20px;
    font-weight: 500;
    line-height: 140%;
    margin-left: 5px;
    margin-bottom: 32px;
  }
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.round:before {
  position: absolute;
  content: "";
  height: 29px;
  width: 29px;
  left: 3px;
  bottom: 3px;
  background: white url("@/img/icon/filter-3.svg");
  background-repeat: no-repeat;
  background-position: center;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .round {
  background-color: #f63;
}
input:checked + .round:before {
  filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.25));
}
input:focus + .round:before {
  filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.25));
}

input:checked + .round:before {
  -webkit-transform: translateX(21px);
  -ms-transform: translateX(21px);
  transform: translateX(21px);
}

.round {
  border-radius: 34px;
}
.round:before {
  border-radius: 50%;
}

// loader
.loader-slides,
.loader-product {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
</style>
