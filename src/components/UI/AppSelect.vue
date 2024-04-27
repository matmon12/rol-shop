<template>
  <select :value="modelValue" @change="changeOption" class="select">
    <option v-for="(option, id) in options" :key="id" :value="option.value">
      {{ option.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "app-select",
  data() {
    return {
      choices: "",
    };
  },
  props: {
    modelValue: String,
    options: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    changeOption(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
  mounted() {
    this.choices = new this.$Choices(this.$el, {
      searchEnabled: false,
      itemSelectText: "",
    });
  },
  beforeUnmount() {
    this.choices.destroy();
  },
};
</script>

<style lang="scss">
.choices {
  margin-bottom: 0;
  font-size: 16px;
  height: 100%;
  padding: 12px 16px 12px 16px;
}
.choices[data-type*="select-one"] .choices__inner {
  padding-bottom: 0px;
}
.choices__inner {
  padding: 0;
  padding-right: 31px;
  background-color: transparent;
  border: none;
  border-radius: 0;
  min-height: auto;
  height: 100%;
  display: flex;
  align-items: center;
  transition: $transition;
  font-size: 16px;
}
.choices__list--single {
  padding: 0;
  color: var(--grey-dark);
}
.choices[data-type*="select-one"]::after {
  content: url('@/img/icon/arrow-down-mini.svg');
  width: 20px;
  height: 20px;
  border-color: transparent;
  border-width: 0;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0;
  transition: $transition;
}
.choices[data-type*="select-one"].is-open::after {
  border-color: transparent;
  margin-top: 0;
  transform: translateY(-50%) rotate(180deg);
}
.is-open .choices__inner {
  border-radius: 10px 10px 0 0;
}

// список
.choices__list--dropdown,
.choices__list[aria-expanded] {
  background-color: #ffffff41;
  backdrop-filter: blur(10px);
  border: 1px solid #e7e7e79c;
  top: 100%;
  left: 0;
  margin-top: -1px;
  border-radius: 10px;
  word-break: break-all;
}
.choices__list--dropdown .choices__item--selectable.is-highlighted,
.choices__list[aria-expanded] .choices__item--selectable.is-highlighted {
  background-color: #81cfff46;
}
.choices__list--dropdown .choices__item,
.choices__list[aria-expanded] .choices__item {
  padding: 10px 10px 10px 16px;
  font-size: 16px;
  color: var(--grey-dark);
}
</style>
