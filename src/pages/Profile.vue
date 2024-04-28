<template>
  <div class="profile">
    <div class="container">
      <Crumbs  class="crumbs" />

      <div class="profile__inner">
        <Menu />

        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      paths: [{ name: "Профиль", path: "/rol-shop/profile" }],
    }
  },
  methods: {
    ...mapMutations({
      setPaths: "crumbs/setPaths"
    })
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.setPaths(vm.paths);
    })
  },
  beforeRouteUpdate(to, from, next) {
    if (from.name === 'History' || from.name === 'Favorites' || from.name === 'Address') {
      this.setPaths(this.paths);
      next();
    } else {
      next()
    } 
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.crumbs {
  margin-bottom: 32px;
}
.profile{
  margin-bottom: 64px;
  &__inner{
    display: flex;
    gap: 153px;
  }
}
</style>
