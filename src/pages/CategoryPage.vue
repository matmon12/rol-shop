<template>
  <div class="category" >
    <div class="container">
      <div class="category__inner">
        <Category class="category-pages"/>

        <Crumbs :paths="paths" class="crumbs" />

        <div class="card">
          <h2 class="card__title">{{ this.categoryMap[this.category] }}</h2>

          <div class="filters">
            <div class="filters__top">
              <div class="filters__top-left">
                <button class="filters__top-btn">Все</button>
                <button class="filters__top-btn">Классические</button>
                <button class="filters__top-btn">Маки</button>
                <button class="filters__top-btn">Драконы</button>
                <button class="filters__top-btn">Запеченные</button>
                <button class="filters__top-btn">Феликсы</button>
                <button class="filters__top-btn">Сладкие</button>
              </div>
              <app-select
                v-model="filters.selectSort"
                :options="sortOptions"
              ></app-select>
            </div>
            <div class="filters__bottom">
              <div class="filters__bottom-left">
                <button
                  class="filters__bottom-btn"
                  @click="filters.filter_1 = !filters.filter_1"
                  :class="{ 'filters--checked': filters.filter_1 }"
                >
                  <div class="filters__bottom-imgwrapper">
                    <img src="@/img/icon/filter-1.svg" alt="icon" />
                  </div>
                  Острые
                </button>
                <button
                  class="filters__bottom-btn"
                  @click="filters.filter_2 = !filters.filter_2"
                  :class="{ 'filters--checked': filters.filter_2 }"
                >
                  <div class="filters__bottom-imgwrapper">
                    <img src="@/img/icon/filter-2.svg" alt="icon" />
                  </div>
                  Вегетарианские
                </button>
                <button
                  class="filters__bottom-btn"
                  @click="filters.filter_3 = !filters.filter_3"
                  :class="{ 'filters--checked': filters.filter_3 }"
                >
                  <div class="filters__bottom-imgwrapper">
                    <img src="@/img/icon/filter-3.svg" alt="icon" />
                  </div>
                  Безлактозные
                </button>
              </div>
              <div class="filters__bottom-right">
                <button
                  v-for="(item, id) in ingredients.slice(0, 4)"
                  :key="id"
                  @click="
                    filters['ingredients_' + item.id] = !filters['ingredients_' + item.id]
                  "
                  class="ingredients-btn"
                  :style="{ '--color': item.color }"
                  :class="{ 'ingredients--checked': filters['ingredients_' + item.id] }"
                >
                  <img :src="item.imgUrl" :alt="item.name" />
                  <p>{{ item.name }}</p>
                </button>
                <button class="filters__category-burger" @click="showDialog">
                  <span></span>
                  <span></span>
                  <span></span>
                  <p class="filters__category-count" v-if="countIngredients > 0">{{ countIngredients }}</p>
                </button>
                <app-dialog v-model:show="dialogVisible" class="ingredients">
                  <div class="ingredients__top">
                    <h5 class="ingredients__title">Инградиенты</h5>
                    <div class="ingredients__top-right">
                      <button class="ingredients-reset" @click="resetIngredients">
                        Сбросить все
                      </button>
                      <button class="ingredients-close" @click="hideDialog">
                        <img src="@/img/icon/close.svg" alt="close" />
                      </button>
                    </div>
                  </div>
                  <div class="ingredients__list">
                    <button
                      v-for="(item, id) in ingredients"
                      :key="id"
                      @click="
                        filters['ingredients_' + item.id] = !filters[
                          'ingredients_' + item.id
                        ]
                      "
                      class="ingredients-btn"
                      :style="{ '--color': item.color }"
                      :class="{
                        'ingredients--checked': filters['ingredients_' + item.id],
                      }"
                    >
                      <img :src="item.imgUrl" :alt="item.name" />
                      <p>{{ item.name }}</p>
                    </button>
                  </div>
                </app-dialog>
              </div>
            </div>
          </div>

          <CategoryList
            :items="categores"
            @add-to-favorite="(item) => this.addToFavorite(item)"
            @add-to-cart="(item) => onClickAddPlus(item)"
            @load-more-category="!isAllLoading ? loadMoreCategory() : load()"
            :check="isAllLoading"
            :total="total"
          />
          <!-- Ничего не нашлось -->
          <div
            v-if="categores.length == 0 && isLoading === false"
            class="category-empty"
          >
            <img
              class="category-empty__img"
              src="@/img/icon/cart-empty.svg"
              alt="empty"
            />
            <div class="category-empty__box">
              <h5 class="category-empty__title">Ничего не найдено</h5>
              <p class="category-empty__text">
                Попробуйте найти в другой категории или измените параметры поиска товаров
                в этой категории
              </p>
            </div>
          </div>
          <!-- Загрузка -->
          <div v-if="isLoading === true && categores.length == 0" class="loader-box">
            <span class="loader"></span>
          </div>

          <InfoText />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { inject } from "vue";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      categoryMap: {
        rolls: "Роллы",
        sushi: "Суши",
        sets: "Сеты",
        snacks: "Боулы",
        drinks: "Напитки",
        rollsq: "Соусы",
      },
      category: null,
      limit: 8,
      isLoading: false,
      isAllLoading: false,
      total: 0,
      filters: {
        selectSort: "-price",
        filter_1: this.$route.params.category === "drinks" ? false : true,
        filter_2: false,
        filter_3: false,
        ingredients_1: this.$route.params.category === "drinks" ? false : true,
        ingredients_2: false,
        ingredients_3: this.$route.params.category === "drinks" ? false : true,
        ingredients_4: this.$route.params.category === "drinks" ? false : true,
        ingredients_5: false,
        ingredients_6: false,
        ingredients_7: false,
        ingredients_8: false,
        ingredients_9: false,
      },
      sortOptions: [
        { value: "title", name: "По названию" },
        { value: "price", name: "От дешевых к дорогим" },
        { value: "-price", name: "От дорогих к дешевым" },
      ],
      ingredients: [
        {
          id: 1,
          color: "#E86853",
          name: "лосось",
          imgUrl: require("@/img/ingredients/ingredients-1.png"),
        },
        {
          id: 2,
          color: "#D57E3D",
          name: "угорь",
          imgUrl: require("@/img/ingredients/ingredients-2.png"),
        },
        {
          id: 3,
          color: "#df394a",
          name: "тунец",
          imgUrl: require("@/img/ingredients/ingredients-3.png"),
        },
        {
          id: 4,
          color: "#FDA49A",
          name: "куриное филе",
          imgUrl: require("@/img/ingredients/ingredients-4.png"),
        },
        {
          id: 5,
          color: "#D8CC88",
          name: "тофу",
          imgUrl: require("@/img/ingredients/ingredients-5.png"),
        },
        {
          id: 6,
          color: "#eddac2",
          name: "сливочный сыр",
          imgUrl: require("@/img/ingredients/ingredients-6.png"),
        },
        {
          id: 7,
          color: "#5FD63A",
          name: "авокадо",
          imgUrl: require("@/img/ingredients/ingredients-7.png"),
        },
        {
          id: 8,
          color: "#c41c07",
          name: "помидор",
          imgUrl: require("@/img/ingredients/ingredients-8.png"),
        },
        {
          id: 9,
          color: "#916d43",
          name: "гриб шитаки",
          imgUrl: require("@/img/ingredients/ingredients-9.png"),
        },
      ],
      dialogVisible: false,
    };
  },
  components: {
  },
  computed: {
    paths() {
      return [{ name: this.categoryMap[this.category], path: this.$route.params }];
    },
    countIngredients() {
      return Object.keys(this.filters).filter(key => key.startsWith('ingredients_') && this.filters[key]).length;
    }
  },
  methods: {
    ...mapActions({
      addToFavorite: "favorite/addToFavorite",
    }),
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchItems(name) {
      let apiRes = null;
      try {
        this.isLoading = true;

        const params = {
          page: 1,
          limit: this.limit,
          filter_1: this.filters.filter_1 ? true : undefined,
          filter_2: this.filters.filter_2 ? true : undefined,
          filter_3: this.filters.filter_3 ? true : undefined,
          "ingridients.1": this.filters.ingredients_1 ? 1 : undefined,
          "ingridients.2": this.filters.ingredients_2 ? 1 : undefined,
          "ingridients.3": this.filters.ingredients_3 ? 1 : undefined,
          "ingridients.4": this.filters.ingredients_4 ? 1 : undefined,
          "ingridients.5": this.filters.ingredients_5 ? 1 : undefined,
          "ingridients.6": this.filters.ingredients_6 ? 1 : undefined,
          "ingridients.7": this.filters.ingredients_7 ? 1 : undefined,
          "ingridients.8": this.filters.ingredients_8 ? 1 : undefined,
          "ingridients.9": this.filters.ingredients_9 ? 1 : undefined,
          sortBy: this.filters.selectSort,
          category: this.category,
        };

        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/items`, {
          params,
        });

        // Всего результатов
        this.total = data.meta.total_items;

        this.categores = data.items.map((obj) => ({
          ...obj,
          isFavorite: false,
          favoriteId: null,
          isAdded: false,
          count: 1,
        }));
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        this.isLoading = false;
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    async fetchFavorites() {
      let apiRes = null;
      try {
        const { data: favorites } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/favorites`
        );

        this.categores = this.categores.map((item) => {
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
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    load(name) {
      this.fetchItems(name).then(() => {
        // включение кнопки для карточек
        this.categores = this.categores.map((item) => ({
          ...item,
          isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
        }));

        this.fetchFavorites();
      });

      this.isAllLoading = false;
    },
    async loadMoreCategory() {
      let apiRes = null;
      try {
        let allItemsLoaded = false;
        let page = 1;

        while (!allItemsLoaded) {
          page += 1;

          const params = {
            page: page,
            limit: this.limit,
            filter_1: this.filters.filter_1 ? 1 : undefined,
            filter_2: this.filters.filter_2 ? 1 : undefined,
            filter_3: this.filters.filter_3 ? 1 : undefined,
            "ingridients.1": this.filters.ingredients_1 ? 1 : undefined,
            "ingridients.2": this.filters.ingredients_2 ? 1 : undefined,
            "ingridients.3": this.filters.ingredients_3 ? 1 : undefined,
            "ingridients.4": this.filters.ingredients_4 ? 1 : undefined,
            "ingridients.5": this.filters.ingredients_5 ? 1 : undefined,
            "ingridients.6": this.filters.ingredients_6 ? 1 : undefined,
            "ingridients.7": this.filters.ingredients_7 ? 1 : undefined,
            "ingridients.8": this.filters.ingredients_8 ? 1 : undefined,
            "ingridients.9": this.filters.ingredients_9 ? 1 : undefined,
            sortBy: this.filters.selectSort,
            category: this.category,
          };

          const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/items`, {
            params,
          });

          this.categores = this.categores.concat(
            data.items.map((obj) => ({
              ...obj,
              isFavorite: false,
              favoriteId: null,
              isAdded: false,
              count: 1,
            }))
          );

          if (data.meta.remaining_count == 0) {
            allItemsLoaded = true;
            this.categores = this.categores.map((item) => ({
              ...item,
              isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
            }));
            this.fetchFavorites();
          }
        }

        this.isAllLoading = true;
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    showDialog() {
      this.dialogVisible = true;
    },
    hideDialog() {
      this.dialogVisible = false;
    },
    resetIngredients() {
      for (let key in this.filters) {
        if (key.startsWith("ingredients_")) {
          this.filters[key] = false;
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.category = to.params.category;
      vm.setPaths(vm.paths);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // обновление категории
    this.category = to.params.category;
    // обновление crumbs
    this.setPaths(this.paths);
    // отключение фильтров для напитков
    this.filters.filter_1 = this.category === "drinks" ? false : true;
    this.filters.ingredients_1 = this.category === "drinks" ? false : true;
    this.filters.ingredients_3 = this.category === "drinks" ? false : true;
    this.filters.ingredients_4 = this.category === "drinks" ? false : true;
    this.load();
    next();
  },
  mounted() {
    this.load();
  },
  watch: {
    // глобальное слежение
    filters: {
      handler() {
        this.load();
      },
      deep: true,
    },
  },

  setup() {
    const { categores } = inject("items");
    const { cart, addToCart, removeFromCart } = inject("cart");

    const onClickAddPlus = (item) => {
      if (!item.isAdded) {
        addToCart(item);
      } else {
        removeFromCart(item);
        // карточка category
        categores.value.forEach((pl) => {
          if (pl.id === item.id) {
            pl.isAdded = false;
            pl.count = 1;
          }
        });
      }
    };

    return {
      cart,
      onClickAddPlus,
      categores,
    };
  },
};
</script>

<style lang="scss" scoped>
.crumbs {
  position: absolute;
  top: 0;
  left: 0;
}

.category {
  // position: relative;
  // z-index: 1;
  &__inner {
    position: relative;
  }
}
.category-pages{
  margin-bottom: 48px;
}

.card {
  width: 100%;
  padding-bottom: 34px;
  &__title {
    color: var(--grey-dark);
    font-size: 56px;
    font-weight: 700;
    line-height: 125%;
    margin-bottom: 32px;
  }
}
.filters {
  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__top-left {
    display: flex;
    gap: 8px;
  }

  &__top-btn {
    padding: 12px 16px;
    background: var(--white);
    border-radius: $border;
    color: var(--grey-dark);
    font-weight: 500;
    &:nth-child(1) {
      background-color: #f63;
      color: var(--white);
    }
  }

  &__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    &-imgwrapper {
      width: 26px;
    }
  }

  &__bottom-left {
    display: flex;
    gap: 16px;
  }

  &__bottom-btn {
    padding: 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--white);
    border-radius: $border;
    height: 58px;
    border: 2px solid var(--white);
    transition: $transition;
  }

  &__bottom-right {
    display: flex;
    gap: 16px;
    position: relative;
  }

  &__category-btn {
    display: flex;
    gap: 8px;
    align-items: center;
    background: var(--white);
    border-radius: $border;
    padding: 0 16px;
    height: 58px;
    border: 1px solid #d2d2d7;
    p {
      color: var(--grey-dark);
      font-weight: 500;
      text-transform: capitalize;
    }
    img {
      height: 38px;
    }
  }

  &__category-burger {
    background: var(--white);
    border-radius: $border;
    height: 58px;
    width: 58px;
    position: relative;
    span {
      display: block;
      background-color: var(--grey-text);
      height: 2px;
      border-radius: 2px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &:nth-child(1) {
        width: 22px;
        transform: translate(-50%, -7px);
      }
      &:nth-child(2) {
        width: 15px;
      }
      &:nth-child(3) {
        width: 7px;
        transform: translate(-50%, 5px);
      }
    }
  }
  &__category-count{
    width: 28px;
    height: 28px;
    color: var(--white);
    background: var(---2, #f63);
    border-radius: 50%;
    border: 1px solid var(--white);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    position: absolute;
    top: -6px;
    right: -6px;
    transition: $transition;
  }
  &--checked {
    border: 2px solid #eb5757;
  }
}
.ingredients {
  max-width: 846px;
  position: absolute;
  right: 0;
  top: 10px;
  z-index: 150;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 700;
    line-height: 125%;
  }

  &__top-right {
    display: flex;
    align-items: center;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  &-btn {
    display: flex;
    gap: 8px;
    align-items: center;
    background: var(--white);
    border-radius: $border;
    padding: 0 16px;
    height: 58px;
    border: 2px solid #d2d2d7;
    transition: $transition;
  }
  &--checked {
    border: 2px solid var(--color);
  }
}

.ingredients-reset {
  margin-right: 25px;
  color: var(---2, #f63);
  font-weight: 500;
}
.ingredients-close {
  width: 30px;
  height: 30px;
  background-color: var(--grey-light);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 19px;
  }
}
.category-empty {
  background-color: var(--white);
  border-radius: $border;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  width: 100%;

  &__img {
  }

  &__box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 600px;
  }

  &__title {
    color: #000;
    font-size: 32px;
    font-weight: 500;
    line-height: 125%;
  }

  &__text {
    color: var(--grey-text);
    font-size: 14px;
    font-weight: 400;
    line-height: 142%;
  }
}
</style>
