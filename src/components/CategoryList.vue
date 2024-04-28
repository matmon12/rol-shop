<template>
  <div class="card-wrapper">
    <div class="card__list" v-auto-animate>
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
    <button v-if="total > 8" class="card__btn" @click="$emit('loadMoreCategory')">
      {{ check ? "Скрыть" : "Показать больше" }}
    </button>
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
    total: Number
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

  &__list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
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
    margin-top: 48px;
  }
}
</style>
