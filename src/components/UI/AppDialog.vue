<template>
  <div class="dialog" v-if="show">
    <slot></slot>
  </div>
</template>

<script>
import toggleMixin from "@/mixins/toggleMixin";

export default {
  name: "app-dialog",
  mixins: [toggleMixin],
  mounted() {},
};
</script>

<style scoped>
.dialog {
  margin: auto;
  padding: 24px;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0px 6px 20px 0px rgba(29, 29, 31, 0.07);
}

</style>
