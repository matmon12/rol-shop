<template>
  <button class="button">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'app-button'
  }
</script>

<style lang="scss" scoped>
.button{
  background: #00CC2D;
  padding: 16px 24px;
  color: var(--white);
  font-weight: 500;
  text-align: center;
  border-radius: $border;
  max-width: 311px;
  
  
  &:hover{
    background-color: #83b34a;
  }

  &:disabled{
    background-color: rgb(180, 187, 196);
    cursor: default;
  }
}
</style>