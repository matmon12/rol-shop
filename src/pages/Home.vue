<template>
  <div >
    <div class="home">
      <div class="container">
        <Category class="category" />
      </div>

      <SliderTop class="page-section" />

      <CardList
        v-intersection="{ active: () => load('sushi') }"
        card-list-name="Суши"
        :items="sushi"
        @add-to-favorite="(item) => this.addToFavorite(item)"
        @add-to-cart="(item) => onClickAddPlus(item)"
        @load-more-items="
          !allItemsLoaded_1 ? (loadMoreItems('sushi', 'allItemsLoaded_1')) : null
        "
        class="page-section"
      />

      <CardList
        v-intersection="{ active: () => load('rolls') }"
        card-list-name="Роллы"
        :items="rolls"
        @add-to-favorite="(item) => this.addToFavorite(item)"
        @add-to-cart="(item) => onClickAddPlus(item)"
        @load-more-items="
          !allItemsLoaded_2 ? (loadMoreItems('rolls', 'allItemsLoaded_2')) : null
        "
        class="page-section"
      />

      <CardList
        v-intersection="{ active: () => load('sets') }"
        card-list-name="Сеты"
        :items="sets"
        @add-to-favorite="(item) => this.addToFavorite(item)"
        @add-to-cart="(item) => onClickAddPlus(item)"
        @load-more-items="
          !allItemsLoaded_3 ? (loadMoreItems('sets', 'allItemsLoaded_3')) : null
        "
        class="page-section"
      />

      <SliderProduct
        :slides="slides"
        class="page-section"
        @slider-add-cart="(item) => sliderAddCart(item)"
      />

      <CardList
        v-intersection="{ active: () => load('snacks') }"
        card-list-name="Закуски"
        :items="snacks"
        @add-to-favorite="(item) => this.addToFavorite(item)"
        @add-to-cart="(item) => onClickAddPlus(item)"
        @load-more-items="
          !allItemsLoaded_4 ? (loadMoreItems('snacks', 'allItemsLoaded_4')) : null
        "
        class="page-section"
      />

      <CardList
        v-intersection="{ active: () => load('drinks') }"
        card-list-name="Напитки"
        :items="drinks"
        @add-to-favorite="(item) => this.addToFavorite(item)"
        @add-to-cart="(item) => onClickAddPlus(item)"
        @load-more-items="
          !allItemsLoaded_5 ? (loadMoreItems('drinks', 'allItemsLoaded_5')) : null
        "
        class="page-section"
      />
    </div>

    <div class="tovar-info">
      <div class="container">
        <InfoText class="tovar-info" />
      </div>
    </div>
  </div>
</template>

<script>
import { inject, ref } from "vue";
import axios from "axios";
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      page: 1,
      limit: 8,
      allItemsLoaded_1: false,
      allItemsLoaded_2: false,
      allItemsLoaded_3: false,
      allItemsLoaded_4: false,
      allItemsLoaded_5: false,
    };
  },
  components: {},
  methods: {
    ...mapActions({
      addToFavorite: "favorite/addToFavorite",
    }),
    async fetchItems(category) {
      let apiRes = null;
      try {
        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?page=1&limit=${this.limit}&category=${category}`
        );

        this[category] = data.items.map((obj) => ({
          ...obj,
          isFavorite: false,
          favoriteId: null,
          isAdded: false,
          count: 1,
        }));
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    async loadMoreItems(category, itemsLoaded) {
      let apiRes = null;
      try {
        let allItemsLoaded = false;
        let page = 1;

        while (!allItemsLoaded) {
          page += 1;

          const { data } = await axios.get(
            `https://c2ff7a8de0a119c8.mokky.dev/items?page=${page}&limit=${this.limit}&category=${category}`
          );

          this[category] = this[category].concat(
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
            this[category] = this[category].map((item) => ({
              ...item,
              isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
            }));
            this.fetchFavorites(category);
          }
        }
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        } else {
          this[itemsLoaded] = true;
        }
      }
    },
    async fetchFavorites(category) {
      try {
        const { data: favorites } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/favorites`
        );

        this[category] = this[category].map((item) => {
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
    load(isCategory) {
      this.fetchItems(isCategory).then(() => {
        // включение кнопки для карточек
        this[isCategory] = this[isCategory].map((item) => ({
          ...item,
          isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
        }));
        // включение кнопки для слайдера
        this.slides = this.slides.map((item) => ({
          ...item,
          isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
        }));
        this.fetchFavorites(isCategory);
      });
    },
    async fetchSlides() {
      let apiRes = null;
      try {
        const { data: slides } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/top`
        );

        this.slides = slides.map((obj) => ({
          ...obj,
          isAdded: false,
          count: 1,
        }));
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    async sliderAddCart(item) {
      if (!item.isAdded) {
        // для карточек
        this[item.category].forEach((pl) => {
          if (pl.id === item.id) {
            pl.isAdded = true;
            this.cart.push(pl);
          }
        });

        // для случаев, когда данные для карточек еще не были получены
        if (this[item.category].length === 0) {
          const { data } = await axios.get(
            `https://c2ff7a8de0a119c8.mokky.dev/items?id=${item.id}`
          );

          this.cart.push(data[0]);
        }

        // для слайдера
        item.isAdded = true;
      } else {
        // из корзины
        let index = -1;
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            index = i;
            break;
          }
        }
        if (index !== -1) {
          this.cart.splice(index, 1);
        }
        // для карточек
        this[item.category].forEach((pl) => {
          if (pl.id === item.id) {
            pl.isAdded = false;
            pl.count = 1;
          }
        });

        // для слайдера
        item.isAdded = false;
      }
    },
  },
  mounted() {
    this.fetchSlides();
  },
  setup() {
    const { sushi, rolls, sets, snacks, drinks, slides } = inject("items");
    const { cart, addToCart, removeFromCart } = inject("cart");

    const onClickAddPlus = (item) => {
      if (!item.isAdded) {
        addToCart(item);
      } else {
        removeFromCart(item);
      }
    };

    return {
      sushi,
      rolls,
      sets,
      snacks,
      drinks,
      cart,
      slides,
      onClickAddPlus,
    };
  },
};
</script>

<style lang="scss" scoped>
.category {
  margin-bottom: 48px;
}
</style>
