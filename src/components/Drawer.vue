<template>
  <div class="basket" @click.stop="closeDrawer">
    <div class="container">
      <div class="basket-wrapper">
        <div class="basket__inner" @click.stop>
          <div class="basket__head">
            <h3 class="basket__title">Ваш заказ</h3>

            <button @click="closeDrawer" class="basket__close">
              <img src="@/img/icon/close.svg" alt="close" />
            </button>
          </div>

          <div v-if="!totalPrice" class="basket-info">
            <InfoBlock
              title="В вашей корзине пока пусто"
              description="Тут появятся товары, которые вы закажите"
              button_1="Повторить прошлый заказ"
              button_2="История заказов"
              :img-url="require('@/img/icon/cart-empty.svg')"
              @repeat-order="repeatOrder"
              @history-orders="this.$router.push('/rol-shop/profile/history'), closeDrawer()"
            />
          </div>

          <div v-else class="basket-content">
            <CartList class="basket-list" />

            <p class="basket__limit">Минимальная сумма заказа 400 грн</p>

            <div class="basket__order">
              <div class="basket__sum">
                <p class="basket__sum-text">Итого:</p>

                <div class="basket__sum-price">
                  {{ totalPrice }}

                  <span>грн</span>
                </div>
              </div>

              <app-button
                class="basket__order-btn"
                @click="
                  () => {
                    $router.push('/rol-shop/order'), closeDrawer();
                  }
                "
              >
                Оформить заказ
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject, computed } from "vue";
import { mapMutations, mapActions } from "vuex";
import axios from "axios";
import emitter from "@/store/eventBus.js";
export default {
  data() {
    return {};
  },
  components: {},
  props: {
    totalPrice: Number,
  },
  methods: {
    ...mapMutations({
      setOrderNumber: "order/setOrderNumber"
    }),
    repeatOrder() {
      this.setOrderNumber(this.historyOrder);
      this.$router.push({ path: "/rol-shop/order", query: { repeat: this.historyOrder} });
      this.closeDrawer();
    },
    // eventOrder() {
    //   // отправка события
    //   emitter.emit("is-order-fetching");
    // },
  },
  setup() {
    const { cart, closeDrawer, historyOrder } = inject("cart");
    return {
      cart,
      closeDrawer,
      historyOrder,
    };
  },
};
</script>

<style lang="scss">
.basket {
  &-wrapper {
    height: calc(100% - 10px);
    display: flex;
    justify-content: flex-end;
  }
  &__inner {
    border-radius: $border;
    background: var(--white);
    width: 590px;
    overflow: hidden;
    max-height: 718px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24px;
    padding: 30px 30px 0;
  }
  &__title {
    color: var(--grey-dark);
    font-size: 28px;
    font-weight: 700;
    line-height: 128%;
  }
  &__close {
    align-self: start;
    background: var(--grey-light);
    border-radius: 8px;
    width: 32px;
    height: 32px;
  }
  &-list {
    padding: 0 10px 0 30px;
    margin-right: 20px;
    overflow-y: auto;
    scrollbar-color: #979797 transparent;
    scrollbar-width: auto;
    flex-grow: 1;
    &::-webkit-scrollbar {
      width: 5px;
      color: #000;
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #d3d2d2;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  &__limit {
    color: #f63;
    font-weight: 500;
    padding: 32px 30px 12px;
  }
  &__order {
    padding: 24px 30px;
    background: #f5f5f7;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__sum {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  &__sum-text {
    color: #9e9e9e;
  }
  &__sum-price {
    color: var(--grey-dark);
    font-size: 32px;
    font-weight: 700;
    line-height: 125%;
    span {
      color: var(--grey-text);
      font-size: 21px;
      margin-left: 0px;
    }
  }
  &__order-btn {
  }
}

.container {
  height: 100%;
}

.basket-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 90px);
}

.basket-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
