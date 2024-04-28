<template>
  <div class="success__info-order">
    <div class="success__arrow" :class="{ 'success__arrow--open': isVisible }">
      <img src="@/img/icon/arrow-19-11.svg" alt="" />
    </div>
    <div class="success__data">
      <p class="success__data-date">{{ formattedDate[0] }} {{ year }}</p>
      <p class="success__data-number"># {{ number }}</p>
    </div>
    <el-scrollbar class="success__product-scrollbar">
      <ul class="success__product">
        <li class="success__product-item" v-for="(item, id) in items" :key="id">
          <img
            class="success__product-img"
            :src="require(`@/img/products/${item.imgUrl}`)"
            alt="product"
          />
        </li>
      </ul>
    </el-scrollbar>
    <div class="success__info">
      <div class="success__info-item">
        <p class="success__info-name">Кол-во</p>
        <p class="success__info-value">{{ count }}</p>
      </div>
      <div class="success__info-item">
        <p class="success__info-name">Итого</p>
        <p class="success__info-value">{{ totalPrice }} <span>грн</span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,
    formattedDate: Array,
    number: Number,
    items: Array,
    totalPrice: Number,
    year: Number,
    count: Number
  }
};
</script>

<style lang="scss" scoped>
.success{
  &__arrow {
    width: 33px;
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: $transition;
    transform: rotate(180deg);
    &--open {
      transform: rotate(0);
    }
  }

  &__info-order {
    display: flex;
    align-items: center;
  }

  &__data {
    margin: 0 24px 0 32px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
    align-items: flex-start;
  }

  &__data-date {
    color: rgb(158, 158, 158);
    font-size: 14px;
  }

  &__data-number {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 700;
  }

  &__product-scrollbar {
    flex-grow: 1;
  }

  &__product {
    display: flex;
    flex-grow: 1;
    gap: 16px;
  }

  &__product-item {
    min-width: 64px;
    height: 64px;
    background-color: var(--grey-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__product-img {
    height: 54px;
    object-fit: cover;
  }

  &__info {
    display: flex;
    gap: 24px;
    flex-shrink: 0;
    margin-left: 24px;
  }

  &__info-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
  }

  &__info-name {
    color: rgb(158, 158, 158);
    font-size: 14px;
  }

  &__info-value {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
    span {
      font-size: 16px;
      color: rgb(104, 104, 112);
    }
  }
}
</style>
