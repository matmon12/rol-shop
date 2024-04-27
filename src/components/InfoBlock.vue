<template>
  <div class="info">
    <div class="info__imgwrapper">
      <img class="info__img" :src="imgUrl" alt="picture" />
    </div>
    <h6 class="info__title">{{ title }}</h6>
    <p class="info__text">{{ description }}</p>
    <app-button v-if="historyOrder > 83700" @click="$emit('repeatOrder')" class="info__btn">{{ button_1 }}</app-button>
    <button v-if="historyOrder > 83700" @click="$emit('historyOrders')" class="info__btn info__btn-history">{{ button_2 }}</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  props: {
    title: String,
    description: String,
    button_1: String,
    button_2: String,
    imgUrl: String,
  },
  setup() {
    const { historyOrder } = inject("cart");
    return{
      historyOrder
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__imgwrapper {
    margin-bottom: 16px;
  }

  &__img {
    object-fit: cover;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 20px;
    font-weight: 500;
    line-height: 140%;
    margin-bottom: 6px;
  }

  &__text {
    color: var(--grey-text);
    font-size: 16px;
    font-weight: 400;
    max-width: 244px;
    margin-bottom: 32px;
  }

  &__btn {
    width: 280px;
    margin-bottom: 12px;
    &-history {
      background-color: var(--grey-light);
      border-radius: $border;
      padding: 16px 24px;
      color: #00cc2d;
      font-size: 16px;
      font-weight: 500;
      transition: $transition;
    }
  }
}
</style>
