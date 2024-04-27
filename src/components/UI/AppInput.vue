<template>
  <div class="input-wrapper">
    <input
      class="input"
      :value="modelValue"
      @input="updateInput"
      type="text"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
import debounce from "lodash.debounce";
export default {
  name: "app-input",
  props: {
    modelValue: String,
    placeholder: String,
  },
  methods: {

  },
  setup(props, {emit}) {
    const updateInput = debounce((event) => {
      emit("update:modelValue", event.target.value);
    }, 500)

    return{
      updateInput
    }
  }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  .input {
    width: 250px;
    height: 45px;
    border: 1px solid #f3f3f3;
    border-radius: 10px;
    padding: 0 10px 0 46px;
    position: relative;
    transition: $transition;

    &::placeholder {
      color: #c4c4c4;
    }

    &:focus {
      border: 1px solid #858585;
    }
  }

}
</style>
