<template>
  <el-collapse-item :name="id">
    <template #title>
      <div class="history__info-order">
        <InfoOrder
          :isVisible="isVisible"
          :formattedDate="formattedDate"
          :number="order.number"
          :items="products"
          :totalPrice="order.totalPrice"
          :year="order.year"
          :count="count"
          class="info-order"
        />
        <button v-if="!isVisible" class="history__btn-repeat" @click.stop="repeatOrder">
          <img src="@/img/icon/repeat.svg" alt="" />
          Повторить заказ
        </button>
      </div>
    </template>
    <div class="history__info-steps">
      <StepsOrder :methods="order.methods" :steps="order.status" />
    </div>
    <div class="history__info-delivery">
      <InfoDelivery
        v-if="order"
        :address="order.address.address"
        :input="order.address.input"
        :apartment="order.address.apartment"
        :floor="order.address.floor"
        :formatted-date="formattedDate"
        :payment="order.payment"
        :totalPrice="order.totalPrice"
        :change="order.change"
        :regular-sticks="order.regularSticks"
        :animals="order.animals"
        :options="order.options"
        :note="order.note"
      />
    </div>
    <div class="history__info-list">
      <ListOrders :products="products" />
    </div>
    <div v-if="visibleTips && order.tips === false" class="history__info-tips">
      <Tips
        :total-price="order.totalPrice"
        :id="order.id"
        @hide-tips="visibleTips = false"
      />
    </div>
  </el-collapse-item>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      isVisible: false,
      formattedDate: [],
      products: [],
      count: 0,
      visibleTips: true,
    };
  },
  props: {
    order: Object,
    id: Number,
    activeItem: {
      type: [Number, String],
    },
  },
  methods: {
    ...mapActions({
      dateFormat: "date/dateFormat",
    }),
    ...mapMutations({
      setOrderNumber: "order/setOrderNumber"
    }),
    repeatOrder() {
      this.setOrderNumber(this.order.number);
      this.$router.push({ path: "/rol-shop/order", query: { repeat: this.order.number} });
    }
  },
  computed: {
    checkVisible() {
      return this.activeItem === this.id;
    },
  },
  watch: {
    checkVisible(value) {
      value ? (this.isVisible = true) : (this.isVisible = false);
    },
  },
  mounted() {
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

    if (this.activeItem === this.id) {
      this.isVisible = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.history {
  &__info-order {
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 34px;
  }
  &__info-steps {
    padding: 0 24px;
  }
  &__info-list {
    padding-top: 2px;
  }
  &__info-delivery {
    padding: 34px 50px 0;
  }
  &__info-tips {
    padding: 8px 50px;
    margin-top: 24px;
  }
  &__btn-repeat {
    padding: 12px 16px;
    background-color: var(--grey-light);
    border-radius: $border;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 3px;
    color: rgb(0, 204, 45);
    font-weight: 500;
    font-size: 12px;
    flex-shrink: 0;
    align-self: stretch;
    transition: $transition;

    img{
      transition: all .5s;
    }
    &:hover{
      background-color: rgb(230, 230, 230);
      img{
        transform: rotate(180deg);
      }
    }
  }
}
.info-order{
  flex-grow: 1;
}
</style>
