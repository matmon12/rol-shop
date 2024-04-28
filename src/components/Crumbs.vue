<template>
  <div class="crumbs">
    <div class="crumbs__inner">
      <div @click="goBack" class="back">
        <img src="@/img/icon/arrow-left.svg" alt=" back" />
        Назад
      </div>
      <div class="home">
        <router-link to="/rol-shop/">
          <img src="@/img/icon/home.svg" alt="home" />
        </router-link>
      </div>
      <div class="crumbs-list">
        <div class="crumbs-item" v-for="item in paths" :key="item">
          <router-link :to="item.path">
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      paths: (state) => state.crumbs.paths
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.crumbs {
  &__inner {
    display: flex;
    align-items: center;
  }
}
.back {
  margin-right: 16px;
  background: var(--white);
  border-radius: $border;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #00cc2d;
  font-size: 12px;
  font-weight: 500;
  line-height: 133%;
  height: 41px;
  cursor: pointer;
}
.home {
  display: flex;
  align-items: center;
  margin-right: 8px;
  &::after {
    content: url("@/img/icon/arrow-rigth-low.svg");
    display: block;
    width: 21px;
    height: 21px;
    margin-left: 4px;
  }
}

.crumbs-list {
  display: flex;
  gap: 8px;
}
.crumbs-item {
  a {
    color: #9e9e9e;
    font-size: 14px;
    font-weight: 500;
  }
  &:not(:last-child) {
    display: flex;
    align-items: center;

    &::after {
      content: url("@/img/icon/arrow-rigth-low.svg");
      display: block;
      width: 21px;
      height: 21px;
      margin-left: 8px;
    }
  }
}
</style>
