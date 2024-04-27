<template>
  <div class="success" >
    <div class="container">
      <div class="success__inner">
        <div class="success__top">
          <div class="success__top-left">
            <p class="success__top-text">
              Спасибо,<br />
              ваш заказ <span>{{ `#${order.number}` }}</span> успешно оформлен
            </p>
          </div>
          <div class="success__top-right">
            <InfoDelivery
              v-if="order"
              :address="order.address.address"
              :input="order.address.input"
              :apartment="order.address.apartment"
              :floor="order.address.floor"
              :formattedDate="formattedDate"
              :payment="order.payment"
              :totalPrice="order.totalPrice"
              :change="order.change"
              :regularSticks="order.regularSticks"
              :animals="order.animals"
              :options="order.options"
              :note="order.note"
            />
          </div>
        </div>
        <div class="success__bottom">
          <el-collapse @change="isVisible = !isVisible">
            <el-collapse-item>
              <template #title>
                <div class="success__bottom-top">
                  <InfoOrder
                    :isVisible="isVisible"
                    :formattedDate="formattedDate"
                    :number="order.number"
                    :items="products"
                    :totalPrice="order.totalPrice"
                    :year="order.year"
                    :count="count"
                  />
                </div>
                <div class="success__bottom-bottom">
                  <StepsOrder :methods="order.methods" :steps="0" />
                </div>
              </template>
              <div class="success__products-wrapper">
                <ListOrders :products="products" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="success__btn-wrapper">
          <button
            v-if="order.methods === 'Самовывоз'"
            @click="dialogVisible = true"
            class="success__btn-direction"
          >
            Проложить маршрут
          </button>
          <button class="success__btn" @click="$router.push('/rol-shop/')">
            Вернутся на главную
          </button>
        </div>
        <el-dialog v-model="dialogVisible" title="Построение маршрута" align-center>
          <p class="success__dialog-text">
            Здесь вы можете просмотреть маршрут в точку выдачи
          </p>
          <div class="success__map">
            <Map :geocoderCoord="geocoderCoord" :newMarker="newMarker" ref="Map" />
          </div>
        </el-dialog>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import { inject } from "vue";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      order: "",
      count: 0,
      isVisible: false,
      products: [],
      dialogVisible: false,
      newMarker: [],
      formattedDate: [],
      error: false
    };
  },
  methods: {
    ...mapActions({
      geocoderAddress: "map/geocoderAddress",
      dateFormat: "date/dateFormat",
    }),
    async fetchOrder() {
      let apiRes = null;
      try {
        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/orders?number=${this.historyOrder}`
        );
        this.order = data[0];
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.error = true;
          this.$router.push('/rol-shop/404');
        }
      }
    },
    geocoderCoord(lat, long) {},
    creatingMarker() {
      const fullAddres = `${this.order.address.city}, ${this.order.address.address}`;
      this.geocoderAddress(fullAddres).then(() => {
        this.newMarker = this.arrayCoord;
      });
    },
  },
  computed: {
    ...mapState({
      arrayCoord: (state) => state.map.arrayCoord,
    }),
  },
  mounted() {
    this.fetchOrder().then(() => {
      if(!this.error) {
        this.dateFormat({
          dayDate: this.order.day,
          yearDate: this.order.year,
          timeDate: this.order.time,
        }).then((result) => {
          this.formattedDate = result;
        });
        this.order.items.forEach((element) => {
          this.count += element.count;
        });
        this.products = this.order.items;
        if (this.order.freeProduct) {
          this.order.freeProduct.forEach((item) => this.products.push(item));
          this.count += this.order.freeProduct.length;
        }
        this.creatingMarker();
      }
    });
  },
  setup() {
    const { historyOrder } = inject("cart");
    return {
      historyOrder,
    };
  },
};
</script>

<style lang="scss" scoped>
.success {
  margin-bottom: 64px;
  &__inner {
  }

  &__map {
    width: 100%;
    height: 500px;
    border-radius: $border;
    overflow: hidden;
  }

  &__top {
    margin-bottom: 16px;
    border-radius: $border;
    background-color: var(--white);
    padding: 48px 64px 16px;
    display: flex;
    gap: 138px;
  }

  &__top-left {
    max-width: 340px;
  }

  &__top-text {
    color: var(--grey-dark);
    font-size: 34px;
    font-weight: 700;
    line-height: 1.4;
    span {
      color: var(--white);
      background-color: rgb(255, 102, 51);
      padding: 4px 8px;
      border-radius: $border;
    }
  }

  &__top-right {
    flex-grow: 1;
  }

  &__bottom {
    border-radius: $border;
    background-color: var(--white);
    padding: 24px 0;
  }

  &__bottom-top {
    padding: 12px 48px;
    margin-bottom: 12px;
  }

  &__bottom-bottom {
    padding: 0 16px;
  }
  &__products-wrapper {
    padding-top: 34px;
  }

  &__btn {
    border-radius: $border;
    background-color: var(--white);
    padding: 16px 24px;
    width: 265px;
    color: rgb(0, 204, 45);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    &-wrapper {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    &-direction {
      border-radius: $border;
      padding: 16px 24px;
      background-color: rgb(0, 204, 45);
      color: var(--white);
      width: 256px;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
    }
  }

  &__dialog-text {
    font-weight: 400;
    color: rgb(104, 104, 112);
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.el-collapse {
  border-top: none;
  border-bottom: none;
}
.el-collapse-item__header {
  display: block;
  height: auto;
  line-height: inherit;
  background-color: transparent;
  color: transparent;
  cursor: pointer;
  border-bottom: none;
  font-size: inherit;
  font-weight: 400;
  transition: border-bottom-color var(--el-transition-duration);
  outline: 0;
}
.el-collapse-item__arrow {
  display: none;
}
.el-collapse-item__wrap {
  background-color: transparent;
  border-bottom: none;
}
.el-collapse-item__content {
  padding-bottom: 0;
  font-size: inherit;
  color: transparent;
  line-height: inherit;
}
</style>
