<template>
  <div class="category">
    <div class="category__inner">
      <ul class="category__list">
        <li
          v-for="item in category"
          :key="item.id"
          class="category__list-item"
          :class="{ 'category-empty': !item.name }"
        >
          <div
            class="category__list-link"
            @click="$router.push(`/rol-shop/${item.path}`)"
          >
            <div class="category__list-wrapper">
              <img
                class="category__list-img"
                :src="
                  item.imgUrl
                    ? $route.params.category === item.path
                      ? item.imgPath
                      : item.imgUrl
                    : require('@/img/category/category-7.svg')
                "
                alt="picture"
              />
            </div>
            <p class="category__list-text">
              {{ item.name ? item.name : "Неизвестно" }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category: [
        {
          name: "Роллы",
          path: "rolls",
          imgUrl: require("@/img/category/category-1.svg"),
          imgPath: require("@/img/category/category-21.svg"),
        },
        {
          name: "Суши",
          path: "sushi",
          imgUrl: require("@/img/category/category-2.svg"),
          imgPath: require("@/img/category/category-11.svg"),
        },
        {
          name: "Сеты",
          path: "sets",
          imgUrl: require("@/img/category/category-3.svg"),
          imgPath: require("@/img/category/category-31.svg"),
        },
        {
          name: "Боулы",
          path: "snacks",
          imgUrl: require("@/img/category/category-4.svg"),
          imgPath: require("@/img/category/category-41.svg"),
        },
        {
          name: "Напитки",
          path: "drinks",
          imgUrl: require("@/img/category/category-5.svg"),
          imgPath: require("@/img/category/category-51.svg"),
        },
        {
          name: "Соусы",
          path: "rollsq",
          imgUrl: require("@/img/category/category-6.svg"),
          imgPath: require("@/img/category/category-61.svg"),
        },
        { name: "", path: "", imgUrl: "" },
        { name: "", path: "", imgUrl: "" },
      ],
    };
  },
  props: {},
};
</script>

<style lang="scss" scoped>
.category {
  &__inner {
    width: fit-content;
    background-color: var(--white);
    border-radius: $border;
    padding: 6px 16px;
    margin: 0 auto;
    height: 95px;
  }

  &__list {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  &__list-item {
    height: 100%;
    width: 90px;
    color: var(--grey-dark);
    cursor: pointer;
  }

  &__list-link {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: inherit;
  }

  &__list-wrapper {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__list-img {
  }

  &__list-text {
    max-width: 67px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    font-feature-settings: "clig" off, "liga" off;
  }

  &-empty {
    color: #9e9e9e;
    cursor: default;
  }
}
</style>
