<template>
  <div class="tips">
    <div class="tips__inner">
      <h4 class="tips-title">Хотите оставить чаевые?</h4>
      <el-form ref="ruleFormRef" :model="form" class="tips__form">
        <div class="tips__box">
          <label class="tips-label" :for="`tip-1${id}`">
            <input
              type="radio"
              :name="`tips${id}`"
              :id="`tip-1${id}`"
              :value="percent1"
              v-model="tipsRadio"
            />
            <div class="tips-info">
              <p class="tips-price">{{ percent1 }} <span>₴</span></p>
              <p class="tips-percent">(5%)</p>
            </div>
            <img class="tips-img" src="@/img/icon/smile-1.png" alt="" />
          </label>
          <label class="tips-label" :for="`tip-2${id}`">
            <input
              type="radio"
              :name="`tips${id}`"
              :id="`tip-2${id}`"
              :value="percent2"
              v-model="tipsRadio"
            />
            <div class="tips-info">
              <p class="tips-price">{{ percent2 }} <span>₴</span></p>
              <p class="tips-percent">(10%)</p>
            </div>
            <img class="tips-img" src="@/img/icon/smile-2.png" alt="" />
          </label>
          <label class="tips-label" :for="`tip-3${id}`">
            <input
              type="radio"
              :name="`tips${id}`"
              :id="`tip-3${id}`"
              :value="percent3"
              v-model="tipsRadio"
            />
            <div class="tips-info">
              <p class="tips-price">{{ percent3 }} <span>₴</span></p>
              <p class="tips-percent">(15%)</p>
            </div>
            <img class="tips-img" src="@/img/icon/smile-3.png" alt="" />
          </label>
          <el-form-item prop="tips" :rules="rules.tips" class="tips-input">
            <el-input
              v-model.number="form.tips"
              placeholder="Введите сумму"
              @input="tipsRadio = 0"
            />
          </el-form-item>
        </div>
        <el-form-item>
          <button
            class="tips-btn"
            @click.prevent="submitForm()"
            :disabled="(tipsRadio === 0 && form.tips === '') || loadingTips"
          >
            <div v-if="loadingTips" class="tips-btn__box">
              <div class="custom-loading">
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
              <span>Подождите...</span>
            </div>
            <div v-else>
              Оплатить {{ tipsRadio !== 0 ? `${tipsRadio}₴` : "" }}
            </div>
          </button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  data() {
    return {
      tipsRadio: 0,
      percent1: 0,
      percent2: 0,
      percent3: 0,
      loadingTips: false,
    };
  },
  props: {
    totalPrice: Number,
    id: Number,
  },
  methods: {
    percent() {
      this.percent1 = Math.round(this.totalPrice * 0.05);
      this.percent2 = Math.round(this.totalPrice * 0.1);
      this.percent3 = Math.round(this.totalPrice * 0.15);
    },
    async postTips(info) {
      try {
        this.loadingTips = true;
        const { data } = await axios.post(`https://c2ff7a8de0a119c8.mokky.dev/tips`, {
          tips: info,
          orders_id: this.id
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.loadingTips = false;
        this.$emit('hideTips', false);
      }
    },
    submitForm() {
      if (this.form.tips) {
        this.ruleFormRef.validate((valid) => {
          if (valid) {
            this.postTips(this.form.tips);
            this.form.tips = "";
          } else {
            return false;
          }
        });
      } else {
        this.postTips(this.tipsRadio);
      }
    },
  },
  mounted() {
    this.percent();
    this.tipsRadio = this.percent3;
  },
  setup() {
    const ruleFormRef = ref({});
    const form = ref({ tips: "" });

    // кастомное правило
    const checkNumber = (rule, value, callback) => {
      if (!Number.isInteger(value) && value) {
        callback(new Error("Введите число!"));
      } else {
        if (value <= 0 && value) {
          callback(new Error("Недопустимая сумма!"));
        } else {
          callback();
        }
      }
    };

    const rules = ref({
      tips: [{ validator: checkNumber, trigger: "blur" }],
    });

    return {
      ruleFormRef,
      form,
      rules,
    };
  },
};
</script>

<style lang="scss" scoped>
.tips {
  width: 100%;
  &__inner {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  &__box {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-grow: 1;
  }
  &__form {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
}
.tips-title {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--grey-dark);
  max-width: 175px;
}
.tips-input {
  flex: 1;
}
.tips-label {
  flex: 1;
  position: relative;
  height: 56px;

  input {
    appearance: none;
    display: none;
    &:checked + div {
      background-color: rgb(255, 102, 51);
      .tips-percent {
        color: var(--white);
      }
      .tips-price {
        color: var(--white);
        span {
          color: var(--white);
        }
      }
    }
  }
}
.tips-info {
  height: 100%;
  width: 100%;
  padding: 0 20px;
  background-color: var(--grey-light);
  border-radius: $border;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: $transition;
}
.tips-price {
  color: var(--grey-dark);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  span {
    font-size: 13px;
    color: rgb(104, 104, 112);
  }
}
.tips-percent {
  color: rgb(158, 158, 158);
  font-weight: 500;
  font-size: 16px;
}
.tips-img {
  position: absolute;
  right: -4px;
  top: -4px;
}
.tips-btn {
  margin-left: 24px;
  background-color: var(--grey-light);
  border-radius: $border;
  height: 56px;
  padding: 0 24px;
  color: rgb(0, 204, 45);
  font-weight: 500;
  font-size: 16px;
  flex-shrink: 0;
  transition: $transition;
  &:disabled {
    cursor: not-allowed;
    filter: brightness(0.8);
  }
  &__box{
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.custom-loading .circular {
  margin-right: 6px;
  width: 25px;
  height: 25px;
  animation: loading-rotate 2s linear infinite;
}
.custom-loading .circular .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #929292;
  stroke-linecap: round;
}
</style>
<style lang="scss">
.tips {
  .el-form-item {
    --font-size: 16px;
    margin-bottom: 0;
  }
  .el-input {
    height: 56px;
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
    height: min-content;
    line-height: 1.5;
  }
  .el-input {
    --el-input-placeholder-color: #8f8f8f;
  }
  .el-form-item__error {
    padding-top: 0;
    padding-bottom: 2px;
    top: auto;
    bottom: 100%;
  }
}
</style>
