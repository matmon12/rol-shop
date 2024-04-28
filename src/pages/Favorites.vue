<template>
  <div class="favorites-wrapper">
    <FavoriteList
      :items="favorites"
      :check="isAllLoading"
      @add-to-favorite="(item) => check(item)"
      @add-to-cart="(item) => onClickAddPlus(item)"
      @load-more-favorites="onLoadMoreFavorites()"
    />
  </div>

</template>

<script>
import axios from "axios";
import { inject, ref } from "vue";
import { mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      paths: [
        { name: "Профиль", path: "/rol-shop/profile" },
        { name: "Избранное", path: "/rol-shop/profile/favorites" },
      ],
      limit: 6,
      isAllLoading: false,
    };
  },
  components: {},
  methods: {
    ...mapActions({
      addToFavorite: "favorite/addToFavorite",
    }),
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    check(item) {
      this.addToFavorite(item);
      this.favorites.splice(this.favorites.indexOf(item), 1);
    },
    async fetchFavorites() {
      let apiRes = null;
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/favorites`);

        this.favorites = data.map((obj) => obj.item);
        this.favorites.map((obj, index) => (obj.favoriteId = data[index].id));
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    onLoadMoreFavorites() {
      this.isAllLoading = !this.isAllLoading;
    },
    load() {
      this.fetchFavorites().then(() => {
        // включение кнопки для карточек
        this.favorites = this.favorites.map((item) => ({
          ...item,
          isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
        }));
      });
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setPaths(vm.paths);
    })
  },
  mounted() {
    this.load();
  },
  setup() {
    const { favorites } = inject("items");
    const { cart, addToCart, removeFromCart } = inject("cart");
    const onClickAddPlus = (item) => {
      if (!item.isAdded) {
        addToCart(item);
      } else {
        removeFromCart(item);
        // карточка favorites
        favorites.value.forEach((pl) => {
          if (pl.id === item.id) {
            pl.isAdded = false;
            pl.count = 1;
          }
        });
      }
    };

    return {
      onClickAddPlus,
      cart,
      favorites,
    };
  },
};
</script>

<style lang="scss" scoped>
.favorites {
  &-wrapper {
    width: 100%;
  }
}
</style>
