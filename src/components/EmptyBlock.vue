<template>
  <div class="block-empty">
    <img class="block-empty__img" :src="imgUrl" alt="empty" />
    <div class="block-empty__box">
      <h5 class="block-empty__title">{{ title }}</h5>
      <p class="block-empty__text">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    imgUrl: String,
    text: String
  }
};
</script>

<style lang="scss" scoped>
.block-empty {
  background-color: var(--white);
  border-radius: $border;
  padding: 40px;
  display: flex;
  gap: 32px;
  width: 100%;

  &__img {
  }

  &__box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 460px;
  }

  &__title {
    color: #000;
    font-size: 32px;
    font-weight: 500;
    line-height: 125%;
  }

  &__text {
    color: var(--grey-text);
    font-size: 14px;
    font-weight: 400;
    line-height: 142%;
  }
}
</style>
