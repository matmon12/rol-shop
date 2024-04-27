<template>
  <div class="card">
    <div class="container">
      <div class="card__inner">
        <div class="card__box">
          <h2 class="card__title">{{ cardListName }}</h2>
          <button class="card__btn" @click="$emit('loadMoreItems')">Смотреть все</button>
        </div>

        <div v-if="items.length > 0" class="card__list" v-auto-animate>
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
          />
        </div>

        <div v-else class="loader-box">
          <span class="loader"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    items: Array,
    cardListName: String,
  },
};
</script>

<style lang="scss" scoped>
.card {
  &__inner {
  }

  &__box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 48px;
    font-weight: 700;
    line-height: 133%;
    text-transform: capitalize;
  }

  &__btn {
    margin-top: 16px;
    border-radius: $border;
    padding: 12px 24px;
    color: #00cc2d;
    font-weight: 500;
    background: var(--white);
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
}

</style>
