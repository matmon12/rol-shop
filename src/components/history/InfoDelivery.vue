<template>
  <div>
    <h3 class="success__top-title">Информация о доставке</h3>
    <ul class="success__list">
      <li class="success__list-item">
        <p class="success__list-name">Адрес:</p>
        <p class="success__list-value">
          {{ address }}{{ input ? ", подъезд " + input : ""
          }}{{ apartment ? ", кв " + apartment : "" }}{{ floor ? ", этаж " + floor : "" }}
        </p>
      </li>
      <li class="success__list-item">
        <p class="success__list-name">Время:</p>
        <p class="success__list-value">{{ formattedDate[0] }} {{ formattedDate[1] }}</p>
      </li>
      <li class="success__list-item">
        <p class="success__list-name">Способ оплаты:</p>
        <p class="success__list-value">{{ payment }}</p>
      </li>
      <li class="success__list-item">
        <p class="success__list-name">Сумма к оплате:</p>
        <p class="success__list-value">{{ totalPrice }} грн</p>
      </li>
      <li v-if="Number.isInteger(change)" class="success__list-item">
        <p class="success__list-name">Сдача с</p>
        <p class="success__list-value">{{ change }} грн</p>
      </li>
      <li v-if="regularSticks" class="success__list-item">
        <p class="success__list-name">Кол-во человек:</p>
        <p class="success__list-value">{{ regularSticks }}</p>
      </li>
    </ul>
    <div v-if="note || formattedOptions" class="success__options">
      <p class="success__options-title">Примечание:</p>
      <p class="success__options-text">
        {{ note ? note + ". " : "" }}{{ formattedOptions }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formattedOptions: "",
    };
  },
  props: {
    address: String,
    input: {
      type: [Number, String],
    },
    apartment: {
      type: [Number, String],
    },
    floor: {
      type: [Number, String],
    },
    payment: String,
    totalPrice: Number,
    change: {
      type: [Number, String],
    },
    regularSticks: Number,
    animals: {
      type: [Array, String],
    },
    options: {
      type: [Array, String],
    },
    note: String,
    formattedDate: Array,
  },
  methods: {
    optionFormat(animals, optionsDoor) {
      if (animals.length > 0) {
        const dog = animals.find((item) => item === "dog") ? "У меня есть собака." : "";
        const cat = animals.find((item) => item === "cat") ? "У меня есть кошка." : "";
        this.formattedOptions = `${dog ? dog + " " : ""}${cat ? cat + " " : ""}`;
      }
      if (optionsDoor.length > 0) {
        this.formattedOptions += optionsDoor.join(". ") + ".";
      }
    },
  },
  mounted() {
    this.optionFormat(this.animals, this.options);
  },
};
</script>

<style lang="scss" scoped>
.success {
  &__top-title {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  &__list {
  }

  &__list-item {
    & + & {
      margin-top: 8px;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.5;
    position: relative;
    &::after {
      content: "";
      width: 100%;
      position: absolute;
      bottom: 28%;
      height: 1px;
      border-bottom: 1px dashed rgb(210, 210, 215);
    }
  }

  &__list-name {
    background-color: var(--white);
    z-index: 10;
    padding-right: 16px;
    color: rgb(104, 104, 112);
    font-size: 14px;
  }

  &__list-value {
    background-color: var(--white);
    z-index: 10;
    padding-left: 16px;
    color: var(--grey-dark);
    font-size: 16px;
  }

  &__options {
    margin-top: 16px;
  }

  &__options-title {
    color: rgb(104, 104, 112);
    font-size: 14px;
    margin-bottom: 8px;
  }

  &__options-text {
    color: var(--grey-dark);
    font-size: 16px;
  }
}
</style>
