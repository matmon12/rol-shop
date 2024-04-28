<template>
  <div class="success__steps">
    <div
      class="success__steps-item"
      v-for="(item, id) in methods === 'Доставка' ? stepsDelivery : stepsPickup"
      :key="id"
      :class="{ 'steps--check': id <= steps }"
    >
      <div class="success__steps-top">
        <div class="success__steps-lines">
          <span class="line-left"></span>
        </div>
        <div class="success__steps-number">
          <span class="steps-number">{{ id + 1 }}</span>
        </div>
        <div class="success__steps-lines">
          <span class="line-right"></span>
        </div>
      </div>
      <p class="success__steps-text">
        {{ item.split(" ")[0] }}<br />{{ item.split(" ").slice(1).join(" ") }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepsDelivery: [
        "Подтверждение заказа",
        "Приготовление",
        "Ожидание курьера",
        "Курьер в пути",
        "Курьер на месте",
      ],
      stepsPickup: [
        "Подтверждение заказа",
        "Приготовление",
        "Отправка в пункт выдачи",
        "Ожидает в пункте выдачи",
        "Заказ получен",
      ],
    };
  },
  props: {
    methods: String,
    steps: Number,
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.success {
  &__steps {
    display: flex;
  }

  &__steps-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
    &:nth-child(1) {
      .line-left {
        display: none;
      }
    }
    &:last-child {
      .line-right {
        display: none;
      }
    }
  }
  &__steps-top {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 24px;
  }
  &__steps-lines {
    flex-grow: 1;
  }

  &__steps-number {
    color: var(--grey-dark);
    width: 24px;
    height: 24px;
    background-color: rgba(39, 39, 39, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    span {
      display: block;
    }
  }

  &__steps-text {
    color: rgb(158, 158, 158);
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    line-height: 1.4;
  }
}
.line-left,
.line-right {
  display: block;
  width: 100%;
  height: 4px;
  background-color: rgba(39, 39, 39, 0.05);
}
.line-left {
  border-radius: 0 5px 5px 0;
}
.line-right {
  border-radius: 5px 0 0 5px;
}

.steps--check {
  .success__steps-number {
    width: 20px;
    height: 20px;
    background-color: rgb(85, 179, 11);
    position: relative;
    &::after {
      content: url("@/img/icon/check.svg");
      line-height: 1;
      font-size: 7px;
    }
  }
  .success__steps-text {
    color: var(--grey-dark);
  }
  .steps-number {
    display: none;
  }
  .line-right {
    background-color: var(--grey-dark);
  }
  & + .success__steps-item {
    .line-left {
      background-color: var(--grey-dark);
    }
  }
}
</style>
