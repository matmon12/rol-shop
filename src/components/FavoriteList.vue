<template>
  <div class="card">
    <h2 class="card__title">Избранные товары</h2>

    <div class="card-wrapper" v-if="items.length > 0">
      <div class="card__list" v-auto-animate :class="{ 'is-open': check }">
        <Card
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :weight="item.weight"
          :volume="item.volume"
          :composition="item.composition"
          :price="item.price"
          :imgUrl="item.imgUrl"
          :isHit="item.isHit"
          :isNew="item.isNew"
          :filter_1="item.filter_1"
          :filter_2="item.filter_2"
          :filter_3="item.filter_3"
          :is-favorite="item.isFavorite"
          :is-added="item.isAdded"
          :category="item.category"
          :on-click-favorite="() => $emit('addToFavorite', item)"
          :on-click-add="() => $emit('addToCart', item)"
          class="card-item"
        />
      </div>
      <button
        v-if="countFavorite > 6"
        class="card__btn"
        @click="$emit('loadMoreFavorites')"
      >
        {{ check ? "Скрыть" : "Показать больше" }}
      </button>
    </div>

    <EmptyBlock
      v-else
      :imgUrl="require('@/img/icon/favorite-empty.svg')"
      title="Вы еще ничего не добавили в избанное"
      text="Переходите в интересующую вас категориюи отмечайте понравившиеся"
    />
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  components: {
  },
  props: {
    items: Array,
    check: Boolean,
  },
  setup() {
    const { countFavorite } = inject("items");
    return {
      countFavorite,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  &__title {
    color: var(--grey-dark);
    font-size: 48px;
    font-weight: 700;
    line-height: 133%;
    margin-bottom: 24px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  &-item {
    display: none;
    &:nth-child(-n + 6) {
      display: block;
    }
  }

  &-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__btn {
    background: var(--white);
    padding: 16px 24px;
    border-radius: $border;
    width: 265px;
    color: #00cc2d;
    font-weight: 600;
    margin: 0 auto;
    margin-top: 40px;
  }
}

.is-open {
  .card-item {
    display: block;
  }
}
</style>
