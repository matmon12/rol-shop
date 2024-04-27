<template>
  <div class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__top-left">
            <router-link to="/rol-shop/">
              <div class="logo">
                <picture class="logo-img">
                  <source srcset="@/img/logo.svg" media="(min-width: 600px)" />
                  <img src="@/img/logo-mobile.svg" alt="logo" />
                </picture>
              </div>
            </router-link>

            <div class="footer__app">
              <a class="footer__app-btn" href="#">
                <img src="@/img/icon/apple.svg" alt="apple" />
              </a>
              <a class="footer__app-btn" href="#">
                <img src="@/img/icon/google.svg" alt="google" />
              </a>
            </div>
            <p class="footer__rights">© Ninja Sushi. All rights reserved.</p>
          </div>
          <div class="footer__top-body">
            <div class="footer__box">
              <p class="footer__box-title">Навигация:</p>
              <ul class="footer__list">
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Главная</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Меню</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Доставка</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Вакансии</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Новости</a>
                </li>
              </ul>
            </div>
            <div class="footer__box">
              <p class="footer__box-title">Оформить заказ:</p>
              <ul class="footer__list">
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">+38 (067) 436 61 27</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">+38 (066) 031 76 30</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">+38 (093) 924 98 28</a>
                </li>
              </ul>
            </div>
            <div class="footer__box">
              <p class="footer__box-title">Время работы:</p>
              <ul class="footer__list">
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">с 11:00 до 22:45</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">с 22.45 до 06.00</a>
                </li>
                <li class="footer__list-item">
                  <a class="footer__list-link" href="#">Ночная доставка</a>
                </li>
              </ul>
            </div>
            <div class="footer__box">
              <p class="footer__box-title">Мы в соц. сетях:</p>
              <div class="footer__social">
                <a class="footer__social-link" href="#">
                  <img src="@/img/icon/facebook.svg" alt="social" />
                </a>
                <a class="footer__social-link" href="#">
                  <img src="@/img/icon/instagram.svg" alt="social" />
                </a>
              </div>
              <a class="footer__support" href="#">
                <img src="@/img/icon/telegram.svg" alt="support" />
                Техподдержка
              </a>
            </div>
          </div>
          <div class="footer__top-right">
            <a class="footer__rigth-link" href="#">#NinjaSushi</a>
            <p class="footer__right-text">Ninja Sushi в фотографиях наших клиентов</p>
            <a class="footer__right-instagram" href="#">Перейти в instagram</a>
          </div>
        </div>
        <div class="footer__bottom">
          <a class="footer__bottom-politica" href="#">Политика конфиденциальности</a>
          <div class="footer__bottom-links">
            <a class="footer__bottom-link" href="#">
              <img src="@/img/icon/card-1.svg" alt="card" />
            </a>
            <a class="footer__bottom-link" href="#">
              <img src="@/img/icon/card-2.svg" alt="card" />
            </a>
            <a class="footer__bottom-link" href="#">
              <img src="@/img/icon/card-3.svg" alt="card" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.footer {
  padding: 64px 0px;
  background: var(--white);

  &__inner {
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 34px;
  }

  &__app {
    display: flex;
    gap: 13px;
    margin-bottom: 16px;
  }

  &__app-btn {
  }

  &__rights {
    color: #9e9e9e;
    font-size: 14px;
    font-weight: 500;
  }

  &__top-body {
    display: flex;
    gap: 50px;
    justify-content: space-between;
  }

  &__box {
    &:nth-child(3) {
      .footer__list-item:last-child {
        .footer__list-link{
          color: var(---3, #9E9E9E);
        }
      }
    }
  }

  &__box-title {
    color: var(--grey-text);
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 12px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__list-item {
  }

  &__list-link {
    color: var(--grey-dark);
    font-weight: 500;
  }

  &__social {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
  }

  &__support {
    background-color: var(--grey-light);
    border-radius: $border;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #039BE5;
    font-weight: 500;
    img{
      height: 16px;
  
    }
  }

  &__top-right {
    max-width: 247px;
  }

  &__rigth-link {
    color: var(--grey-dark);
    font-size: 42px;
    font-weight: 700;
    line-height: 1;
    display: block;
    margin-bottom: 15px;
  }

  &__right-text {
    color: #9E9E9E;
    font-weight: 400;
    margin-bottom: 18px;
  }

  &__right-instagram {
    background-color: #F5F5F7;
    border-radius: $border;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: #00CC2D;
    font-weight: 500;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
  }

  &__bottom-politica {
    color: var(--grey-dark);
    font-size: 14px;
    font-weight: 500;
  }

  &__bottom-links {
    display: flex;
    gap: 24px;
  }

  &__bottom-link {
  }
}
.container {
}
.logo {
  margin-bottom: 24px;
}
</style>
