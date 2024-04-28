<template>
  <div class="history-wrapper">
    <h1 class="history-title">История заказов</h1>
    <div
      class="history__content"
      v-if="ordersProcess.length > 0 || ordersComplete.length > 0 || loadingOrders"
    >
      <div class="history__block" v-if="ordersProcess.length > 0 || loadingOrders">
        <p class="history-subtitle">Готовятся</p>
        <el-collapse v-if="!loadingOrders" v-model="activeItem1" accordion>
          <div class="history__box">
            <div class="history__item" v-for="(item, id) in ordersProcess" :key="id">
              <HistoryOrders :order="item" :id="id" :activeItem="activeItem1" />
            </div>
          </div>
        </el-collapse>
        <el-skeleton v-else animated />
      </div>
      <div class="history__block" v-if="ordersComplete.length > 0 || loadingOrders">
        <p class="history-subtitle">Доставленные</p>
        <el-collapse v-if="!loadingOrders" v-model="activeItem2" accordion>
          <div class="history__box">
            <div class="history__item" v-for="(item, id) in ordersComplete" :key="id">
              <HistoryOrders :order="item" :id="id" :activeItem="activeItem2" />
            </div>
          </div>
        </el-collapse>
        <el-skeleton v-else animated />
      </div>
    </div>
    <EmptyBlock
      v-if="ordersProcess.length === 0 && ordersComplete.length === 0 && !loadingOrders"
      class="history-empty"
      :imgUrl="require('@/img/icon/empty.svg')"
      title="У вас нет заказов"
      text="Переходите в интересующую вас категорию и сделайте свой первый заказ"
    />
  </div>

</template>

<script>
import axios from "axios";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      paths: [
        { name: "Профиль", path: "/rol-shop/profile" },
        { name: "История заказов", path: "/rol-shop/profile/history" },
      ],
      ordersComplete: [],
      ordersProcess: [],
      activeItem1: 0,
      activeItem2: "",
      loadingOrders: false,
      loadingTips: false,
    };
  },
  methods: {
    ...mapActions({
      dateFormat: "date/dateFormat",
    }),
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchOrders() {
      let apiRes = null;
      try {
        this.loadingOrders = true;

        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/orders?sortBy=-id`
        );

        this.ordersComplete = data.filter((order) => order.status === 5);
        this.ordersProcess = data.filter((order) => order.status !== 5);
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
    async fetchTips() {
      let apiRes = null;
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/tips`);

        this.ordersProcess = this.ordersProcess.map((order) => {
          const tips = data.find((item) => item.orders_id === order.id);

          if (!tips) {
            return {
              ...order,
              tips: false,
            };
          }

          return {
            ...order,
            tips: true,
          };
        });
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        this.loadingOrders = false;
        if (apiRes == 404) {
          this.$router.push('/rol-shop/404');
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setPaths(vm.paths);
    })
  },
  computed: {
    ...mapState({}),
  },
  mounted() {
    this.fetchOrders().then(() => {
      this.fetchTips();
    });
  },
};
</script>

<style lang="scss" scoped>
.history {
  &__box {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__block {
    & + & {
      margin-top: 48px;
    }
  }

  &__item {
    border-radius: $border;
    background-color: var(--white);
    padding: 16px 0;
  }
}
.history-wrapper {
  flex-grow: 1;
}
.history-title {
  color: var(--grey-dark);
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 32px;
}
.history-subtitle {
  margin-bottom: 24px;
  color: rgb(104, 104, 112);
  font-size: 32px;
  font-weight: 700;
}
.history-empty {
  align-items: center;
}
</style>
<style lang="scss">
.el-skeleton {
  --el-skeleton-color: rgb(224, 224, 224);
  --el-skeleton-to-color: rgb(172, 172, 172);
}
</style>
