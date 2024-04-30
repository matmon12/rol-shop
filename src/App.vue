<template>
  <div class="app">
    <div class="app-top">
      <Drawer v-if="drawerOpen" :total-price="totalPrice" class="basket" />
      <Header
        @open-drawer="openDrawer"
        @close-drawer="closeDrawer"
        :notif-count="5"
        :favorite-count="countFavorite"
        :cart-count="cart.length"
      />
    </div>
    <router-view></router-view>

    <Footer />
  </div>
</template>

<script>
import axios from "axios";
import { provide, ref, watch, computed } from "vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  components: {},
  data() {
    return {
      ordersCount: 0,
      themeLocal: false
    };
  },
  computed: {
    ...mapState({
      favoriteCount: (state) => state.favorite.favoriteCount,
    }),
  },
  watch: {
    cart: {
      handler(newCart) {
        // оформление заказа / обнуление
      },
    },
    favoriteCount: {
      handler() {
        this.countFavorite = this.favoriteCount;
      },
    },
  },
  methods: {
    ...mapMutations({
      setFavoriteCount: "favorite/setFavoriteCount",
      setTheme: "theme/setTheme",
    }),
    async fetchFavoritesCount() {
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/favorites`);
        this.countFavorite = data.length;
      } catch (err) {
        console.log(err);
      }
    },
    async fetchOrdersCount() {
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/orders`);
        this.ordersCount = data.length;
      } catch (err) {
        console.log(err);
      }
    },
    themeSistem() {
      if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme(true)
        document.body.classList.add('dark');
      } else {
        this.setTheme(false);
      }
    }
  },
  mounted() {
    // получение корзины
    const localCart = localStorage.getItem("cart");
    this.cart = localCart ? JSON.parse(localCart) : [];

    // номер заказа получение данных
    this.historyOrder = localStorage.getItem("order");

    // кол-во favorites
    this.fetchFavoritesCount().then(() => {
      this.setFavoriteCount(this.countFavorite);
    });

    // кол-во заказов
    this.fetchOrdersCount().then(() => {
      if (this.ordersCount === 0) {
      // номер заказа в localStorage
      this.historyOrder = 83700;
      localStorage.setItem("order", JSON.stringify(this.historyOrder));
    }
    })

    // тема
    this.themeSistem();
  },
  setup() {
    const favorites = ref([]);
    const countFavorite = ref(0);
    const slides = ref([]);
    const cart = ref([]);
    const sushi = ref([]);
    const rolls = ref([]);
    const sets = ref([]);
    const snacks = ref([]);
    const drinks = ref([]);
    const drawerOpen = ref(false);
    const historyOrder = ref([]);
    const categores = ref([]);
    const product = ref([]);
    const slidesTovar = ref([]);
    const address = ref([]);
    const products = ref([]);

    const categoryMap = {
      sushi: sushi,
      rolls: rolls,
      sets: sets,
      snacks: snacks,
      drinks: drinks,
    };

    const area = "22.555291,46.410475,39.940511,52.517961";

    const totalPrice = computed(() => {
      return cart.value.reduce((acc, item) => acc + item.price * item.count, 0);
    });

    watch(
      cart,
      () => {
        localStorage.setItem("cart", JSON.stringify(cart.value));
      },
      { deep: true }
    );

    const closeDrawer = () => {
      drawerOpen.value = false;
    };

    const openDrawer = () => {
      drawerOpen.value = true;
    };

    const addToCart = (item) => {
      cart.value.push(item);
      item.isAdded = true;

      // слайды
      CartSync(item, true);
    };

    const removeFromCart = (item) => {
      // из корзины
      let index = -1;
      for (let i = 0; i < cart.value.length; i++) {
        if (cart.value[i].id === item.id) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        cart.value.splice(index, 1);
      }
      // карточка
      categoryMap[item.category].value.forEach((pl) => {
        if (pl.id === item.id) {
          pl.isAdded = false;
          pl.count = 1;
        }
      });
      // карточка favorites
      favorites.value.forEach((pl) => {
        if (pl.id === item.id) {
          pl.isAdded = false;
          pl.count = 1;
        }
      });
      // карточка categores
      categores.value.forEach((pl) => {
        if (pl.id === item.id) {
          pl.isAdded = false;
          pl.count = 1;
        }
      });
      // карточка sliderTovar
      slidesTovar.value.forEach((pl) => {
        if (pl.id === item.id) {
          pl.isAdded = false;
          pl.count = 1;
        }
      });
      // слайдер заказ оформление
      products.value.forEach((pl) => {
        if (pl.id === item.id) {
          pl.isAdded = false;
          pl.count = 1;
        }
      });
      // товар
      product.value.isAdded = false;
      product.value.count = 1;
      // слайды
      CartSync(item, false);
    };

    // синхрон добавления в корзину между карточками и слайдером
    const CartSync = (item, check) => {
      slides.value = slides.value.map((el) => {
        if (el.id == item.id) {
          return {
            ...el,
            isAdded: check,
          };
        } else {
          return el;
        }
      });
    };

    // кол-во товара
    const countPlus = (item) => {
      item.count = item.count + 1;
    };
    const countMinus = (item) => {
      if (item.count > 1) {
        item.count = item.count - 1;
      }
    };

    provide("items", {
      sushi,
      rolls,
      sets,
      snacks,
      drinks,
      slides,
      favorites,
      countFavorite,
      categores,
      product,
      slidesTovar,
      products,
    });

    provide("cart", {
      cart,
      addToCart,
      removeFromCart,
      closeDrawer,
      openDrawer,
      drawerOpen,
      countPlus,
      countMinus,
      historyOrder,
      totalPrice,
    });

    provide("address", {
      address,
      area,
    });

    return {
      sushi,
      rolls,
      sets,
      snacks,
      drinks,
      cart,
      addToCart,
      removeFromCart,
      closeDrawer,
      openDrawer,
      drawerOpen,
      slides,
      countPlus,
      countMinus,
      totalPrice,
      historyOrder,
      favorites,
      countFavorite,
      categores,
      product,
      slidesTovar,
      products,
    };
  },
};
</script>

<style lang="scss">
.app {
  padding-top: 122px;
}
.app-top {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 200;
}
.basket {
  height: 100vh;
  background: rgba(26, 26, 26, 0.4);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  padding-top: 122px;
  color: #be6b56;
}
</style>
