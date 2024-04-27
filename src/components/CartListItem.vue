<template>
  <router-link :to="`/rol-shop/${category}/${id}`">
    <div class="basket__item">
      <div class="basket__left">
        <div class="basket__imgwrapper">
          <img
            class="basket__img"
            :src="require(`@/img/products/${filename}`)"
            alt="product"
          />
        </div>
        <div class="basket__box">
          <p class="basket__item-title">{{ title }}</p>
          <p class="basket__weight">Вес: {{ weight }} г</p>
        </div>
      </div>
      <div class="basket__right">
        <p class="basket__price">{{ price }} грн</p>
        <div class="basket__btns">
          <button @click="$emit('onClickMinus')" class="basket__btn">
            <img src="@/img/icon/minus.svg" alt="minus" />
          </button>
          <p class="basket-count">{{ count }}</p>
          <button @click="$emit('onClickPlus')" class="basket__btn">
            <img src="@/img/icon/plus.svg" alt="plus" />
          </button>
        </div>
      </div>
      <button class="basket-remove" @click="$emit('onClickRemove')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.2547 4.2431C13.5172 4.50555 13.5172 4.93106 13.2547 5.19351L5.19022 13.258C4.92777 13.5205 4.50225 13.5205 4.23981 13.258C3.97736 12.9956 3.97736 12.5701 4.23981 12.3076L12.3043 4.2431C12.5668 3.98065 12.9923 3.98065 13.2547 4.2431Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.23981 4.2431C4.50225 3.98065 4.92777 3.98065 5.19022 4.2431L13.2547 12.3076C13.5172 12.5701 13.5172 12.9956 13.2547 13.258C12.9923 13.5205 12.5668 13.5205 12.3043 13.258L4.23981 5.19351C3.97736 4.93106 3.97736 4.50555 4.23981 4.2431Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    weight: Number,
    filename: String,
    price: Number,
    count: Number,
    category: String,
  },
  setup() {},
};
</script>

<style lang="scss">
.basket {
  &__item {
    background-color: var(--grey-light);
    border-radius: $border;
    padding: 12px 18px 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  &__left {
    display: flex;
    gap: 10px;
  }

  &__imgwrapper {
    height: 47px;
    width: 58px;
  }

  &__img {
    object-fit: cover;
  }

  &__box {
    display: flex;
    flex-direction: column;
  }

  &__item-title {
    color: var(--grey-dark);
    font-size: 16px;
    font-weight: 700;
  }

  &__weight {
    color: var(---2, #f63);
    font-weight: 500;
  }

  &__right {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__price {
    color: var(--grey-dark);
    font-weight: 500;
  }

  &__btns {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 18px;
    }
  }
}
.basket-count {
  font-weight: 500;
  color: var(--grey-dark);
}
.basket-remove {
  position: absolute;
  left: 0;
  border-radius: 8px;
  background: var(--white);
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  transition: $transition;
  path {
    fill: #000;
  }
  &:hover {
    background-color: #f63;
    path {
      fill: var(--white);
    }
  }
}
</style>
