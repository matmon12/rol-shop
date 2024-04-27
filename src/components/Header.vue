<template>
  <div class="header">
    <div class="container">
      <div class="header__inner">
        <router-link to="/rol-shop/">
          <div class="logo">
            <picture class="logo-img">
              <source srcset="@/img/logo.svg" media="(min-width: 600px)" />
              <img src="@/img/logo-mobile.svg" alt="logo" />
            </picture>
            <button class="logo-btn">
              <img class="logo-btn__img" src="@/img/icon/arrow-down.svg" alt="arrow" />
            </button>
          </div>
        </router-link>

        <nav class="menu">
          <ul class="menu__list">
            <li class="menu__list-item">
              <a class="menu__list-link" href="#">
                <img class="menu__list-img" src="@/img/icon/country.svg" alt="country" />
                Киев RU
              </a>
            </li>
            <li class="menu__list-item">
              <a class="menu__list-link" href="#">Главная</a>
            </li>
            <li class="menu__list-item">
              <a class="menu__list-link" href="#">Доставка</a>
            </li>
            <li class="menu__list-item">
              <a class="menu__list-link" href="#">О нас</a>
            </li>
            <li class="menu__list-item">
              <a class="menu__list-link" href="#">Новости</a>
            </li>
            <li class="menu__list-item">
              <a class="menu__list-link" href="tel: 380976993438">
                <img class="menu__list-img" src="@/img/icon/tel.svg" alt="country" />
                +38 097 699 34 38
              </a>
            </li>
          </ul>
        </nav>

        <div class="header__btns">
          <button class="header__btn">
            <img class="header__btn-img" src="@/img/icon/bell.svg" alt="icon" />
            <div class="header__count" v-if="notifCount != 0">{{ notifCount }}</div>
          </button>
          <router-link class="header__btn" to="/rol-shop/profile/favorites">
            <img class="header__btn-img" src="@/img/icon/heart.svg" alt="icon" />
            <div class="header__count" v-if="favoriteCount != 0">{{ favoriteCount }}</div>
          </router-link>
          <router-link class="header__btn" to="/rol-shop/profile">
            <img class="header__btn-img" src="@/img/icon/person.svg" alt="icon" />
          </router-link>
          <button
            @click="drawerOpen ? $emit('closeDrawer') : $emit('openDrawer')"
            class="header__btn"
            :class="{ 'is--open': drawerOpen }"
          >
            <span>Корзина</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.7 1.4C5.88885 1.14819 6.18524 1 6.5 1H18.5C18.8148 1 19.1111 1.14819 19.3 1.4L22.3 5.4C22.4298 5.5731 22.5 5.78363 22.5 6V20C22.5 20.7957 22.1839 21.5587 21.6213 22.1213C21.0587 22.6839 20.2957 23 19.5 23H5.5C4.70435 23 3.94129 22.6839 3.37868 22.1213C2.81607 21.5587 2.5 20.7957 2.5 20V6C2.5 5.78363 2.57018 5.5731 2.7 5.4L5.7 1.4ZM7 3L4.5 6.33333V20C4.5 20.2652 4.60536 20.5196 4.79289 20.7071C4.98043 20.8946 5.23478 21 5.5 21H19.5C19.7652 21 20.0196 20.8946 20.2071 20.7071C20.3946 20.5196 20.5 20.2652 20.5 20V6.33333L18 3H7Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.5 6C2.5 5.44772 2.94772 5 3.5 5H21.5C22.0523 5 22.5 5.44772 22.5 6C22.5 6.55228 22.0523 7 21.5 7H3.5C2.94772 7 2.5 6.55228 2.5 6Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.5 9C9.05228 9 9.5 9.44772 9.5 10C9.5 10.7956 9.81607 11.5587 10.3787 12.1213C10.9413 12.6839 11.7044 13 12.5 13C13.2956 13 14.0587 12.6839 14.6213 12.1213C15.1839 11.5587 15.5 10.7956 15.5 10C15.5 9.44772 15.9477 9 16.5 9C17.0523 9 17.5 9.44772 17.5 10C17.5 11.3261 16.9732 12.5979 16.0355 13.5355C15.0979 14.4732 13.8261 15 12.5 15C11.1739 15 9.90215 14.4732 8.96447 13.5355C8.02678 12.5979 7.5 11.3261 7.5 10C7.5 9.44772 7.94772 9 8.5 9Z"
                fill="white"
              />
            </svg>
            <div class="header__count" v-if="cartCount != 0">{{ cartCount }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  props: {
    notifCount: Number,
    favoriteCount: Number,
    cartCount: Number,
  },
  setup() {
    const { drawerOpen } = inject("cart");
    return {
      drawerOpen,
    };
  },
};
</script>

<style lang="scss">
.header {
  margin-top: 16px;

  &__inner {
    border-radius: $border;
    background: var(--white);
    padding: 16px 15px 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__btns {
    display: flex;
    gap: 16px;
  }

  &__btn {
    border: 1px solid #d2d2d7;
    border-radius: $border;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-feature-settings: "clig" off, "liga" off;
    font-size: 16px;
    font-weight: 500;
    color: var(--grey-text);
    position: relative;
    transition: $transition;
    path {
      fill: var(--grey-text);
      transition: $transition;
    }
  }

  &__count {
    width: 28px;
    height: 28px;
    color: var(--white);
    background: var(---2, #f63);
    border-radius: 50%;
    border: 1px solid var(--white);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    position: absolute;
    top: -6px;
    right: -6px;
    transition: $transition;
  }
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}
.logo-img {
}
.logo-btn {
  padding: 6px;
  background: var(--grey-light);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  &__img {
  }
}
.menu {
  &__list {
    display: flex;
    gap: 48px;
  }

  &__list-item {
  }

  &__list-link {
    color: #1d1d1f;
    font-feature-settings: "clig" off, "liga" off;
    font-size: 16px;
    font-weight: 500;
    &:first-child,
    &:last-child {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    &:last-child {
      gap: 12px;
    }
  }

  &__list-img {
  }
}

.is--open {
  background-color: #f63;
  color: var(--white);
  border: 1px solid #f63;
  path {
    fill: var(--white);
  }
  .header__count{
    background-color: var(--white);
    color: #f63;
    border: 1px solid #f63;
  }
}
</style>
