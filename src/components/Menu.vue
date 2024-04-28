<template>
  <div>
    <aside class="menu">
      <div class="menu__links">
        <div class="menu-link" v-for="(item, id) in items" :key="id">
          <router-link :to="item.path" :class="{ 'is-active': $route.path == item.path }">
            <div class="menu__imgwrapper">
              <img class="menu__img" :src="item.imgUrl" alt="icon" />
            </div>
            <p class="menu-link__text">{{ item.title }}</p>
          </router-link>
        </div>
        <div class="menu-link">
          <button class="menu-btn" @click="changeTheme()">
            <div class="menu__imgwrapper">
              <LineMdMoonToSunnyOutlineLoopTransition v-if="!theme" class="menu__img theme-img" />
              <LineMdSunnyOutlineToMoonLoopTransition v-else class="menu__img theme-img" style="color: yellow;"/>
            </div>
            <p class="menu-link__text">Тема сайта</p>
          </button>
        </div>
      </div>
      <div class="menu-person">
        <div class="menu-person__content" v-if="loadingUser">
          <el-skeleton
            style="
              --el-skeleton-circle-size: 60px;
              width: min-content;
              margin-right: 20px;
            "
          >
            <template #template>
              <el-skeleton-item variant="circle" />
            </template>
          </el-skeleton>
          <el-skeleton :rows="3"> </el-skeleton>
        </div>
        <div class="menu-person__content" v-if="!loadingUser">
          <img class="menu-person__img" src="@/img/icon/person.png" alt="person" />
          <div class="menu-person__info">
            <div class="menu-person__box">
              <p class="menu-person__name">{{ user.name }}</p>
              <button class="menu-person__btn" @click="dialogVisible = true">
                <img src="@/img/icon/editor.svg" alt="edit" />
              </button>
            </div>
            <p class="menu-person__email">{{ user.email }}</p>
            <p class="menu-person__tel">{{ user.tel }}</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="Редактирование личной информации"
    align-center
    class="person"
  >
    <el-form ref="ruleFormRef" :model="form" :rules="rules">
      <div class="person__input-wrapper">
        <el-form-item label="Имя" prop="name">
          <el-input v-model="form.name" placeholder="Ввод" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Ввод" />
        </el-form-item>
      </div>
      <el-form-item prop="type" class="person-checkbox">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Я принимаю правила пользования" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <button
          class="person__btn-save"
          @click.prevent="submitForm"
          :disabled="loadingFetch"
        >
          <div class="custom-loading" v-if="loadingFetch">
            <svg class="circular" viewBox="-10, -10, 50, 50">
              <path
                class="path"
                d="
                          M 30 15
                          L 28 17
                          M 25.61 25.61
                          A 15 15, 0, 0, 1, 15 30
                          A 15 15, 0, 1, 1, 27.99 7.5
                          L 15 15
                        "
                style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
              />
            </svg>
          </div>
          {{ loadingFetch ? "Изменение данных" : "Сохранить изменения" }}
        </button>
      </el-form-item>
      <el-form-item>
        <button class="person__btn-cancel" @click.prevent="cancelChanges">
          Отменить
        </button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import axios from "axios";
import { ElMessage, ElSkeleton } from "element-plus";
import { ref } from "vue";
import { mapMutations, mapState } from "vuex";
import OouiSuccess from "~icons/ooui/success";
import LineMdSunnyOutlineToMoonLoopTransition from '~icons/line-md/sunny-outline-to-moon-loop-transition';
import LineMdMoonToSunnyOutlineLoopTransition from '~icons/line-md/moon-to-sunny-outline-loop-transition';

export default {
  data() {
    return {
      dialogVisible: false,
      loadingFetch: false,
      loadingUser: false,
      themeLocal: false,
      items: [
        {
          title: "История заказов",
          path: "/rol-shop/profile/history",
          imgUrl: require("@/img/icon/history.svg"),
        },
        {
          title: "Избранные товары",
          path: "/rol-shop/profile/favorites",
          imgUrl: require("@/img/icon/heart.svg"),
        },
        {
          title: "Адрес доставки",
          path: "/rol-shop/profile/address",
          imgUrl: require("@/img/icon/address.svg"),
        },
      ],
      OouiSuccess: OouiSuccess,
    };
  },
  components: {
    ElSkeleton,
    LineMdSunnyOutlineToMoonLoopTransition,
    LineMdMoonToSunnyOutlineLoopTransition
  },
  computed: {
    ...mapState({
      theme: (state) => state.theme.theme,
    }),
  },
  methods: {
    ...mapMutations({
      setTheme: "theme/setTheme",
    }),
    async fetchUser() {
      try {
        this.loadingUser = true;
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/users`);
        this.user = data[0];
        this.form.name = this.user.name;
        this.form.email = this.user.email;
      } catch (err) {
        console.log(err);
      } finally {
        this.loadingUser = false;
      }
    },
    async saveChanges() {
      try {
        this.loadingFetch = true;
        await axios.delete(`https://c2ff7a8de0a119c8.mokky.dev/users/${this.user.id}`);
        const { data } = await axios.post(`https://c2ff7a8de0a119c8.mokky.dev/users`, {
          name: this.form.name,
          email: this.form.email,
          tel: "89534133883",
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.dialogVisible = false;
        this.loadingFetch = false;
        this.fetchUser();
        this.message("Данные обновлены");
      }
    },
    submitForm() {
      this.ruleFormRef.validate((valid) => {
        if (valid) {
          this.saveChanges();
        } else {
          return false;
        }
      });
    },
    cancelChanges() {
      this.dialogVisible = false;
      this.form.name = this.user.name;
      this.form.email = this.user.email;
    },
    changeTheme() {
      this.themeLocal = !this.theme;
      this.setTheme(this.themeLocal);
      if (this.themeLocal) {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    },
    message(text) {
      ElMessage({
        message: text,
        type: "success",
        icon: this.OouiSuccess,
      });
    },
  },
  mounted() {
    this.fetchUser();
  },
  setup(props) {
    const user = ref("");
    const ruleFormRef = ref({});
    const form = ref({
      name: "",
      email: "",
      type: [],
    });
    const rules = ref({
      name: [
        { required: true, message: "Нужно заполнить!", trigger: ["blur", "change"] },
        { min: 3, message: "Слишком короткий!", trigger: ["blur", "change"] },
      ],
      email: [
        {
          required: true,
          message: "Нужно заполнить!",
          trigger: "blur",
        },
        {
          type: "email",
          message: "Некорректный email!",
          trigger: ["blur", "change"],
        },
      ],
      type: [
        {
          type: "array",
          required: true,
          message: "Нужно отметить!",
          trigger: "change",
        },
      ],
    });
    return {
      ruleFormRef,
      form,
      rules,
      user,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu {
  width: 246px;
  &__links {
    margin-bottom: 16px;
  }

  &__imgwrapper {
    background: var(--white);
    width: 46px;
    height: 46px;
    border-radius: $border;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
}
.theme-img {
  width: 25px;
  height: 25px;
}
.menu-link {
  &:not(:last-child) {
    margin-bottom: 12px;
  }
  a {
    padding: 10px 12px;
    border-radius: $border;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &__text {
    color: var(--grey-dark);
    font-weight: 500;
  }
}
.menu-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  border-radius: $border;
}
.menu-person {
  background-color: var(--white);
  border-radius: $border;
  padding: 16px;
  &__content {
    display: flex;
    justify-content: space-between;
  }
  &__img {
    width: 55px;
    height: 55px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 147px;
    flex-grow: 1;
  }

  &__box {
    display: flex;
    justify-content: space-between;
  }

  &__name {
    color: var(--grey-dark);
    font-weight: 500;
  }

  &__btn {
    border-radius: 4px;
    background-color: var(--grey-light);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__email {
    color: #9e9e9e;
    font-size: 14px;
    font-weight: 400;
    line-height: 142%;

    overflow: hidden;
    text-overflow: ellipsis;
    font-feature-settings: "clig" off, "liga" off;
  }

  &__tel {
    color: var(--grey-dark);
    font-size: 14px;
    font-weight: 500;
    line-height: 142%;
  }
}
.is-active {
  background-color: #ff6633;
  .menu-link__text {
    color: var(--white);
  }
}
.person {
  &__btn-save {
    width: 100%;
    height: 56px;
    background-color: rgb(0, 204, 45);
    border-radius: $border;
    color: var(--white);
    font-size: 16px;
    font-weight: 500;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }

  &__btn-cancel {
    margin-top: 12px;
    background-color: var(--grey-light);
    height: 56px;
    width: 100%;
    color: rgb(0, 204, 45);
    font-size: 16px;
    font-weight: 500;
    border-radius: $border;
  }

  &__input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-bottom: 22px;
  }
}
</style>
<style lang="scss">
.person {
  .el-form-item {
    flex-direction: column;
    flex-grow: 1;
    margin-bottom: 0;
  }
  .el-form-item__label {
    justify-content: flex-start;
    color: rgb(158, 158, 158);
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 4px;
    padding: 0;
    line-height: 1.5;
    height: auto;
  }
  .el-input {
    height: 48px;
    width: 100%;
    background: var(--grey-light);
    border-radius: $border;
    color: var(--grey-dark);
    font-weight: 400;
  }
  .el-input__wrapper {
    flex-grow: 1;
    padding: 12px 16px;
    background-color: transparent;
    border-radius: $border;
    cursor: text;
    transition: none;
    transform: none;
    box-shadow: none;
    &:hover,
    &.is-focus {
      box-shadow: none;
    }
  }
  .el-input__prefix-inner > :last-child {
    margin-right: 16px;
  }
  .el-input__inner {
    --el-input-inner-height: 100%;
    width: 100%;
    color: var(--grey-dark);
    font-size: 16px;
    height: 100%;
    line-height: 1.5;
  }
  .el-input {
    --el-input-placeholder-color: #8f8f8f;
  }
  .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
    > .el-form-item__label:before {
    display: none;
  }

  // dialog
  .el-dialog__headerbtn {
    top: 24px;
    right: 24px;
  }
  .el-dialog__header {
    margin-bottom: 24px;
    padding-top: 38px;
    span {
      text-align: center;
    }
  }
  &.el-dialog {
    border-radius: 16px;
    max-width: 480px;
    width: auto;
    padding: 34px;
  }
  .el-dialog__body {
    color: transparent;
  }

  .person-checkbox {
    margin-bottom: 24px;
  }

  // checkbox{
  .el-checkbox {
    color: rgb(64, 64, 64);
    font-weight: 400;
    font-size: 14px;
    margin-right: 0px;
    height: auto;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: rgb(64, 64, 64);
  }
  .el-checkbox__label {
    padding-left: 16px;
    line-height: 1.5;
    font-size: 16px;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: rgb(255, 102, 51);
    border-color: rgb(255, 102, 51);
  }
  .el-checkbox__inner {
    border: 2px solid rgb(158, 158, 158);
    border-radius: 6px;
    width: 24px;
    height: 24px;
    background-color: transparent;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: translate(-50%, -50%) rotate(0) scaleY(1);
    border-color: transparent;
  }
  .el-checkbox__inner::after {
    content: url("@/img/icon/check.svg");
    border: none;
    height: min-content;
    left: 50%;
    top: 50%;
    transform: rotate(0) scaleY(0);
    width: auto;
    line-height: 1;
  }
}
// loading
.custom-loading {
  height: 25px;
}
.custom-loading .circular {
  width: 25px;
  height: 25px;
  animation: loading-rotate 2s linear infinite;
}
.custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--white);
  stroke-linecap: round;
}

.menu-person {
  .el-skeleton__item:not(.el-skeleton__circle) {
    height: 12px;
  }
  .el-skeleton__paragraph {
    margin-top: 5px;
  }
}

// message
.el-message {
  border-radius: $border;
  background-color: rgba(145, 240, 145, 0.253);
  border: 1px solid #67c23a;
  backdrop-filter: blur(10px);
  .el-icon {
    height: auto;
    width: auto;
    svg{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
