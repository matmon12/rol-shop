<template>
  <div class="success__products">
    <router-link
      :to="`/rol-shop/${item.category}/${item.id}`"
      v-for="(item, id) in products"
      :key="id"
    >
      <div class="success__products-item">
        <div class="success__products-imgwrapper">
          <img
            class="success__products-img"
            :src="require(`@/img/products/${item.imgUrl}`)"
            alt="tovar"
          />
        </div>
        <div class="success__products-info">
          <p class="success__products-title">{{ item.title }}</p>
          <p v-if="item.weight" class="success__products-weight">
            Вес: {{ item.weight }} г
          </p>
          <p v-if="item.volume" class="success__products-weight">
            Объем: {{ item.volume }} л
          </p>
        </div>
        <div class="success__products-box">
          <div class="success__products-box-item">
            <p class="success__products-box-name">Цена</p>
            <p class="success__products-box-value">{{ item.price }} <span>грн</span></p>
          </div>
          <div class="success__products-box-item">
            <p class="success__products-box-name">Кол-во</p>
            <p class="success__products-box-value">{{ item.count }}</p>
          </div>
          <div class="success__products-box-item">
            <p class="success__products-box-name">Итого</p>
            <p class="success__products-box-value">
              {{ item.price * item.count }} <span>грн</span>
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    products: Array,
  },
};
</script>

<style lang="scss" scoped>
.success {
  &__products {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 50px;
  }

  &__products-item {
    display: flex;
    align-items: center;
  }

  &__products-imgwrapper {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
  }

  &__products-img {
    object-fit: cover;
  }

  &__products-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    flex-grow: 1;
    margin-right: 24px;
  }

  &__products-title {
    color: var(--grey-dark);
    font-size: 16px;
    font-weight: 700;
  }

  &__products-weight {
    color: rgb(255, 102, 51);
    font-size: 14px;
    font-weight: normal;
  }

  &__products-box {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &__products-box-item {
  }

  &__products-box-name {
    color: rgb(158, 158, 158);
    font-size: 12px;
    margin-bottom: 4px;
  }

  &__products-box-value {
    font-weight: 700;
    font-size: 16px;
    color: var(--grey-dark);
    span {
      color: rgb(104, 104, 112);
      font-size: 11px;
    }
  }
}
</style>
