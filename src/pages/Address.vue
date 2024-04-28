<template>
  <div class="address-wrapper">
    <div class="address__head">
      <h1 class="address__title">Адрес доставки</h1>
      <app-button class="address__btn" @click="$router.push('/rol-shop/map')">
        Новый адрес
        <img src="@/img/icon/plus-white.svg" alt="plus" />
      </app-button>
    </div>

    <ul class="address__list" v-auto-animate>
      <li class="address__list-item" v-for="(item, id) in address" :key="id">
        <div class="address__info">
          <p class="address__address">{{ `${item.city}, ${item.address}` }}</p>
          <p class="address__other">
            Подьезд {{ item.input }}, этаж {{ item.floor }}, квартира
            {{ item.apartment }}
          </p>
        </div>

        <el-popconfirm
          width="220"
          title="Вы уверены что хотите удалить адрес?"
          @confirm="removeAddress(item.id)"
          confirm-button-text="да"
          cancel-button-text="нет"
          icon-color="#626AEF"
          :icon="iconInfo"
        >
          <template #reference>
            <button class="address__remove-btn">
              <img src="@/img/icon/drawer.svg" alt="address" />
            </button>
          </template>
        </el-popconfirm>
      </li>
    </ul>
    <EmptyBlock
      v-if="address.length == 0"
      :imgUrl="require('@/img/icon/address-empty.svg')"
      title="У вас нет сохраненных адресов"
      text="Переходите в интересующую вас категорию и сделайте свой первый заказ и адрес сохранится автоматически"
    />
  </div>
</template>

<script>
import axios from "axios";
import { inject, shallowRef } from "vue";
import { mapMutations } from "vuex";
import EpInfoFilled from '~icons/ep/info-filled';
export default {
  data() {
    return {
      paths: [
        { name: "Профиль", path: "/rol-shop/profile" },
        { name: "Адрес доставки", path: "/rol-shop/profile/address" },
      ],

    };
  },

  methods: {
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchAddress() {
      let apiRes = null;
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/address`);

        this.address = data;
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
    async removeAddress(id) {
      let apiRes = null;
      try {
        await axios.delete(`https://c2ff7a8de0a119c8.mokky.dev/address/${id}`);

        let index = this.address.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.address.splice(index, 1);
        }
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setPaths(vm.paths);
    });
  },
  mounted() {
    this.fetchAddress();
  },
  setup() {
    const { address } = inject("address");
    const iconInfo = shallowRef(EpInfoFilled);

    return {
      address,
      iconInfo
    };
  },
};
</script>

<style lang="scss" scoped>
.address {
  &-wrapper {
    flex-grow: 1;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  &__title {
    color: var(--grey-dark);
    font-size: 48px;
    font-weight: 700;
    line-height: 133%;
  }
  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 56px;
  }
}
.address {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__list-item {
    width: 100%;
    background-color: var(--white);
    border-radius: $border;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    &::before {
      content: url("@/img/icon/location-grey.svg");
      height: 22px;
    }
  }

  &__info {
    flex-grow: 1;
  }

  &__address {
    color: var(--grey-dark);
    font-weight: 500;
  }

  &__other {
    color: rgb(104, 104, 112);
    font-size: 14px;
    font-weight: 400;
  }

  &__remove-btn {
    background-color: rgba(39, 39, 39, 0.05);
    border-radius: 8px;
    height: 29px;
    width: 29px;
  }
}
</style>
<style lang="scss">
.el-popover.el-popper.is-light {
    background: var(--grey-light);
    border: 1px solid var(--grey-text);
    border-radius: $border;
    color: var(--grey-text);
    line-height: 1.4;
    font-size: 14px;
}
.el-popconfirm__icon {
    width: 30px;
    height: 30px;
    svg{
      width: 100%;
      height: 100%;
    }
}
.el-popconfirm__action{
  .is-text {
    color: var(--grey-text);
    border: 1px solid var(--grey-text);
    background-color: transparent;
    border-radius: 5px;
  }
  .el-button--primary {
    border-radius: 5px;
    background-color: rgb(0, 190, 204);
  }
}
// стрелка
.el-popover.el-popper.is-light .el-popper__arrow::before {
    border: 1px solid var(--grey-text);
    background: var(--grey-light);
    width: 10px;
    height: 10px;
  }
</style>
