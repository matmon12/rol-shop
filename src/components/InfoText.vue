<template>
  <div class="info" :class="{ 'info--is-open': readMore }">
    <p class="info__text">
      В Сети полно всевозможных сервисов учета, начиная от учета времени или калорий,
      заканчивая учетом финансов. А вот сервиса учета инструментов до сих пор не было.
      Теперь – есть. Вообще, конечно, идея учета рабочего инструмента, расходных
      материалов и комплект... Теперь – есть. В Сети полно всевозможных сервисов учета,
      начиная от учета времени или калорий, заканчивая учетом финансов. А вот сервиса
      учета инструментов до сих пор не было. Теперь – есть. Вообще, конечно, идея учета
      рабочего инструмента, расходных материалов и комплект... Теперь – есть.
    </p>
    <button class="info__btn" @click="readMore = !readMore">
      <p>{{ readMore ? "Скрыть" : "Читать больше" }}</p>
      <img src="@/img/icon/arrow-green.svg" alt="arrow" />
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      readMore: false,
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  max-width: 778px;
  display: flex;
  flex-direction: column;
  margin: 64px auto 0;
  gap: 8px;
  &__text {
    margin: 0 auto;
    color: #9e9e9e;
    font-weight: 400;
    max-height: 75px;
    transition: $transition;
    overflow: hidden;
  }

  &__btn {
    align-self: flex-end;
    color: #00cc2d;
    font-weight: 500;
    display: flex;
    
    img {
      transition: $transition;
      margin-left: 4px;
    }
  }

  &--is-open {
    .info__text {
      max-height: 500px;
    }
    .info__btn {
      img {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
