<template>
  <div class="product">
    <div class="product-link" @click="$router.push(`/rol-shop/${category}/${id}`)">
      <div class="product__wrapperimg">
        <img
          class="product__img"
          :src="require(`@/img/products/${imgUrl}`)"
          alt="product"
        />
        <div class="product__filters">
          <div v-if="filter_1" class="product__filters-item">
            <img
              class="product__filters-img"
              src="@/img/icon/filter-1.svg"
              alt="filter"
            />
          </div>
          <div v-if="filter_2" class="product__filters-item">
            <img
              class="product__filters-img"
              src="@/img/icon/filter-2.svg"
              alt="filter"
            />
          </div>
          <div v-if="filter_3" class="product__filters-item">
            <img
              class="product__filters-img"
              src="@/img/icon/filter-3.svg"
              alt="filter"
            />
          </div>
        </div>
      </div>
      <h6 class="product__title">{{ title }}</h6>
      <p v-if="weight" class="product__weight">Вес: {{ weight }} г</p>
      <p v-else class="product__weight">Объем: {{ volume }} л</p>
      <p class="product__text">
        {{ composition }}
      </p>
      <p class="product__price">{{ price }}<span>грн</span></p>
      <div class="product__tags">
        <div v-if="isHit" class="product__tag product-hit">Hit</div>
        <div v-if="isNew" class="product__tag product-new">New</div>
      </div>
    </div>
    <div class="product-btns">
      <button
        class="product__favorite"
        :class="{ 'is-favorite': isFavorite }"
        @click="onClickFavorite"
      >
        <img
          class="product__favorite-img"
          :src="
            !isFavorite
              ? require('@/img/icon/favorite.svg')
              : require('@/img/icon/favorite-checked.svg')
          "
          alt="heart"
        />
      </button>
      <button class="product__cart" :class="{ 'is-added': isAdded }" @click="onClickAdd">
        <img class="product__cart-img" src="@/img/icon/plus.svg" alt="cart" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    title: String,
    weight: Number,
    volume: Number,
    composition: String,
    price: Number,
    imgUrl: String,
    isHit: Boolean,
    isNew: Boolean,
    filter_1: Boolean,
    filter_2: Boolean,
    filter_3: Boolean,
    category: String,
    isFavorite: Boolean,
    isAdded: Boolean,
    onClickFavorite: Function,
    onClickAdd: Function,
  },
};
</script>

<style lang="scss" scoped>
.product {
  position: relative;
  height: 600px;
  background: var(--white);
  border-radius: $border;

  &__wrapperimg {
    position: relative;
    margin-bottom: 12px;
    width: 100%;
    height: 0;
    padding-bottom: 88%;
  }

  &__img {
    width: 100%;
    object-fit: cover;
  }

  &__filters {
    position: absolute;
    bottom: 0;
    display: flex;
    gap: 8px;
  }

  &__filters-item {
    width: 27px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__filters-img {
  }

  &__title {
    color: var(--grey-dark);
    font-size: 27px;
    font-weight: 700;
    line-height: 118%;
    margin-bottom: 12px;
  }

  &__weight {
    color: #f63;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &__text {
    color: var(--grey-text);
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__price {
    margin-top: auto;
    color: var(--grey-dark);
    font-size: 40px;
    font-weight: 700;
    line-height: 80%;
    span {
      color: var(--grey-text);
      font-size: 26px;
      font-weight: 700;
      margin-left: 8px;
    }
  }

  &__tags {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    gap: 6px;
  }

  &__tag {
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 18px;
    line-height: 111%;
    font-weight: 500;
  }

  &-hit {
    color: #f63;
    background-color: #fbdcd5;
  }

  &-new {
    color: #00cc2d;
    background-color: #ccf5d5;
  }

  &-btns {
    position: absolute;
    bottom: 0;
    right: 24px;
    bottom: 24px;
    display: flex;
    gap: 12px;
  }

  &__favorite {
    padding: 12px;
    background-color: var(--grey-light);
    border-radius: $border;
    transition: $transition;
  }

  &__favorite-img {
  }

  &__cart {
    border-radius: $border;
    padding: 10px 24px;
    background-color: #ccf5d5;
    transition: $transition;
  }

  &__cart-img {
  }
}
.product-link {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  cursor: pointer;
}

.is-favorite {
  background: #f63;
}

.is-added {
  background: #00cc2d;
}
</style>
