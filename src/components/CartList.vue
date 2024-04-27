<template>
  <div class="basket-list" v-auto-animate>
    <CartListItem 
      v-for="item in cart"
      :key="item.id"
      :title="item.title"
      :weight="item.weight"
      :filename="item.imgUrl"
      :price="item.price"
      :count="item.count"
      :category="item.category"
      :id="item.id"
      @on-click-remove="() => removeFromCart(item)"
      @on-click-plus="() => countPlus(item)"               
      @on-click-minus="() => countMinus(item)"               
    />
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  components: {
  },
  setup() {
    const { cart, removeFromCart, countPlus, countMinus } = inject("cart");
    return {
      cart,
      removeFromCart,
      countPlus,
      countMinus
    }
  }
};
</script>

<style lang="scss">
.basket-list{
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
