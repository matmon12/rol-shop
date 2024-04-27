<template>
  <div class="error">
    <div class="container">
      <div class="error__inner">
        <div class="error-wrapper">
          <img class="error-img" src="@/img/icon/404.svg" alt="error" />
          <h2 class="error-title">Ошибка 404.<br/>Что-то пошло не так.</h2>
          <p class="error-text">Страница, которую вы ищите, временно не доступна или ее еже нет</p>
          <button class="error-btn" @click="this.$router.push('/rol-shop/')">Вернуться на главную</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
.error {
  width: 100%;
  margin: 16px 0 32px;
  &__inner {
    background-color: var(--white);
    border-radius: $border;
    padding: 48px;
    text-align: center;
  }
}
.error-wrapper{
  max-width: 400px;
  margin: 0 auto;
}
.error-img {
}
.error-title {
  color: var(--grey-dark);
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}
.error-text {
  color: rgb(104, 104, 112);
  font-size: 16px;
  margin-bottom: 32px;
}
.error-btn {
  background-color: rgb(0, 204, 45);
  border-radius: $border;
  height: 56px;
  width: 100%;
  color: var(--white);
  font-weight: 500;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
</style>
