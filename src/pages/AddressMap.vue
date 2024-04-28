<template>
  <div class="destination">
    <div class="container">
      <Crumbs :paths="paths" class="crumbs" />

      <h1 class="destination-title">Добавление адреса доставки</h1>
      <div class="destination__inner">
        <div class="destination__form">
          <h6 class="destination__form-title">
            Введите адрес <br />или выберите на карте
          </h6>
          <el-form ref="ruleFormRef" :model="form">
            <el-form-item prop="address" :rules="rules.address">
              <el-autocomplete
                v-model="form.address"
                :fetch-suggestions="fetchAddressSelect"
                :trigger-on-focus="false"
                placeholder="Введите адрес"
                @select="handleSelect"
                :debounce="1000"
                clearable
                fit-input-width
                popper-class="my-autocomplete"
                class="destination__form-search"
              >
                <template #prefix>
                  <img src="@/img/icon/search.svg" alt="" />
                </template>
                <template #default="{ item }">
                  <div class="address">{{ item.address }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
            <div class="destination__list">
              <el-form-item prop="house">
                <p class="destination__list-title">Номер дома</p>
                <el-input
                  class="destination__list-input"
                  placeholder="Номер"
                  v-model="form.house"
                />
              </el-form-item>
              <el-form-item prop="input">
                <p class="destination__list-title">Подъезд</p>
                <el-input
                  class="destination__list-input"
                  placeholder="Номер"
                  v-model="form.input"
                />
              </el-form-item>
              <el-form-item prop="floor">
                <p class="destination__list-title">Этаж</p>
                <el-input
                  class="destination__list-input"
                  placeholder="Номер"
                  v-model="form.floor"
                />
              </el-form-item>
              <el-form-item prop="apartment">
                <p class="destination__list-title">Квартира</p>
                <el-input
                  class="destination__list-input"
                  placeholder="Номер"
                  v-model="form.apartment"
                />
              </el-form-item>
            </div>
            <el-form-item>
              <el-button
                class="destination__btn"
                color="#00cc2d"
                @click="sumbitForm(ruleFormRef)"
                :loading="
                  loading || loadingDeliveryCheck || loadingAddress || loadingGeocoder
                "
                :disabled="
                  loading || loadingDeliveryCheck || loadingAddress || loadingGeocoder
                "
              >
                <template #loading>
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
                </template>
                {{
                  loadingDeliveryCheck 
                    ? "Проверка адреса"
                    : loading
                    ? "Идет отправка"
                    : loadingGeocoder || loadingAddress
                    ? "Подождите"
                    : "Сохранить адрес"
                }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="destination__map">
          <Map :geocoderCoord="geocoderCoord" ref="Map" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject } from "vue";
import axios from "axios";
import { useStore, mapState, mapMutations } from "vuex";
import { ElNotification } from "element-plus";
export default {
  data() {
    return {
      loading: false,
      loadingFetch: false,
      paths: [
        { name: "Профиль", path: "/rol-shop/profile" },
        { name: "Адрес доставки", path: "/rol-shop/profile/address" },
        { name: "Добавление адреса доставки", path: "/rol-shop/map" },
      ],
      result: [],
      rules: {
        address: [
          { required: true, message: "Нужно заполнить!", trigger: "blur" },
          { min: 5, message: "Слишком короткий!", trigger: "blur" },
          { validator: this.checkGeo, trigger: "submit" },
          { validator: this.checkSelect, trigger: "submit" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchAddressSelect(value, cb) {
      try {
        this.checkFromSelect = false;
        if (value) {
          const { data } = await axios.get(
            `https://suggest-maps.yandex.ru/v1/suggest?apikey=00748542-2e0b-439d-864b-98b4baac2c5f&text=${value}&bbox=${this.area}&lang=ru_RU&strict_bounds=1&print_address=1`
          );
          this.result = data.results.map((item) => ({
            address: item.address.formatted_address,
            house: item.address.component.find((pl) => pl.kind == "HOUSE")
              ? item.address.component.find((pl) => pl.kind == "HOUSE").name
              : "",
            city: item.address.component.find((pl) => pl.kind == "LOCALITY")
              ? item.address.component.find((pl) => pl.kind == "LOCALITY").name
              : "",
            miniAddress: item.address.component.filter((item) =>
              ["HOUSE", "STREET", "VEGETATION", "DISTRICT", "METRO"].includes(
                item.kind[0]
              )
            ),
          }));
          // возвращение данных
          cb(this.result);
        }
      } catch (err) {
        console.log(err);
      }
    },
    async fetchAddress() {
      let apiRes = null;
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/address`);

        this.address = data;
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        this.loading = false;
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
    async postAddress() {
      let apiRes = null;
      let repeat = false;
      try {
        this.loading = true;
        let joinAddress = this.miniAddress.map((item) => item.name).join(", ");

        if (
          !this.repeatAddress(
            joinAddress,
            this.form.house,
            this.form.input,
            this.form.floor,
            this.form.apartment,
            this.city
          )
        ) {
          const { data } = await axios.post(
            `https://c2ff7a8de0a119c8.mokky.dev/address`,
            {
              address: joinAddress,
              house: this.form.house,
              input: this.form.input,
              floor: this.form.floor,
              apartment: this.form.apartment,
              city: this.city,
            }
          );
        } else {
          // notif
          this.openNotif("error", "Ошибка!", "Такой адрес уже есть в сохраненных");
          repeat = true;
        }

        this.form.address = "";
        this.form.house = "";
        this.form.input = "";
        this.form.floor = "";
        this.form.apartment = "";
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        this.fetchAddress();
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
        if (!repeat) {
          this.openNotif("success", "Успех!", "Ваш адрес успешно сохранен!");
        }
      }
    },
    handleSelect(item) {
      // заполнение полей
      this.form.address = item.address;
      this.form.house = item.house;

      // сохранение города
      this.city = item.city;

      // сохранение адреса без города
      this.miniAddress = item.miniAddress;

      // перемещение по карте
      this.$refs.Map.moveMap(item.address);

      // проверка что адрес был выбран из списка или карты
      this.checkFromSelect = true;
    },
    sumbitForm(forName) {
      forName.validate((valid) => {
        if (valid) {
          this.postAddress();
        } else {
          return false;
        }
      });
    },
    repeatAddress(address, house, input, floor, apartment, city) {
      for (let item of this.address) {
        if (
          item.address === address &&
          item.house === house &&
          item.input === input &&
          item.floor === floor &&
          item.apartment === apartment &&
          item.city === city
        ) {
          return true;
        }
      }
      return false;
    },
    openNotif(reason, title, message) {
      if (reason === "error") {
        ElNotification.error({
          title: title,
          message: message,
          showClose: false,
        });
      }
      if (reason === "success") {
        ElNotification.success({
          title: title,
          message: message,
          showClose: false,
        });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setPaths(vm.paths);
    });
  },
  computed: {
    ...mapState({
      loadingDeliveryCheck: (state) => state.map.loading,
      loadingAddress: (state) => state.map.loadingAddress,
    }),
  },
  mounted() {
    this.fetchAddress();
  },
  setup() {
    const store = useStore();
    var arrayCoord = computed(() => store.state.map.arrayCoord);
    var deliveryPossible = computed(() => store.state.map.deliveryPossible);
    const { area, address } = inject("address");
    const form = ref({
      address: "",
      house: "",
      input: "",
      floor: "",
      apartment: "",
    });
    const ruleFormRef = ref();
    const loadingGeocoder = ref(false);
    var checkFromSelect = ref(false);
    const city = ref();
    const miniAddress = ref();

    const geocoderCoord = async (lat, long) => {
      try {
        loadingGeocoder.value = true;

        form.value.address = "";
        form.value.house = "";

        const { data } = await axios.get(
          `https://geocode-maps.yandex.ru/1.x/?apikey=37720b8b-dc03-4346-b6a4-3ae3458e9af6&geocode=${lat},${long}&format=json&lang=ru_RU`
        );

        const path =
          data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty
            .GeocoderMetaData;

        // заполнение полей адреса и дом
        if (path.kind == "house") {
          form.value.house = path.Address.Components.find(
            (item) => item.kind == "house"
          ).name;
        }
        const filteredArray = path.Address.Components.filter((item) =>
          [
            "street",
            "metro",
            "district",
            "area",
            "province",
            "railway_station",
            "station",
            "vegetation",
            "other",
            "house",
          ].includes(item.kind)
        );
        const names = filteredArray.map((item) => item.name).join(", ");
        // адрес с карты в инпут
        form.value.address = names;

        // город
        let isCity = path.Address.Components.filter((item) => item.kind === "locality");
        if (isCity.length > 0) {
          city.value = isCity[0].name;
        }

        // адрес без города
        let isAddress = path.Address.Components.filter((item) =>
          [
            "street",
            "metro",
            "district",
            "railway_station",
            "station",
            "vegetation",
            "house",
          ].includes(item.kind)
        );
        if (isAddress.length > 0) {
          miniAddress.value = isAddress;
        }

        // проверка что адрес был выбран из списка или карты
        checkFromSelect.value = true;
      } catch (err) {
        console.log(err);
      } finally {
        loadingGeocoder.value = false;
      }
    };

    // проверка адреса на доступность для доставки
    const checkGeo = (rule, value, callback) => {
      let possible = false;
      store.dispatch("map/geocoderAddress", value).then(() => {
        store
          .dispatch("map/checkAddress", {
            lat: arrayCoord.value[0],
            long: arrayCoord.value[1],
          })
          .then(() => {
            possible = deliveryPossible.value;
            if (value && !possible) {
              callback(new Error("Доставка по этому адресу не осуществляется!"));
            } else {
              callback();
            }
          });
      });
    };

    // проверка что адрес был выбран из списка или карты
    const checkSelect = (rule, value, callback) => {
      if (!checkFromSelect.value) {
        callback(new Error("Адрес не выбран!"));
      } else {
        callback();
      }
    };

    return {
      geocoderCoord,
      form,
      ruleFormRef,
      checkGeo,
      checkSelect,
      loadingGeocoder,
      checkFromSelect,
      city,
      miniAddress,
      area,
      address,
    };
  },
};
</script>

<style lang="scss" scoped>
.crumbs {
  margin-bottom: 32px;
}
.destination-title {
  color: var(--grey-dark);
  font-size: 48px;
  font-weight: 700;
  line-height: 133%;
  margin-bottom: 24px;
}
.destination {
  margin-bottom: 64px;
  &__inner {
    display: flex;
    gap: 24px;
  }

  &__form {
    height: fit-content;
    min-width: 379px;
    max-width: 379px;
    border-radius: $border;
    background-color: var(--white);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__form-title {
    color: var(--grey-dark);
    text-align: center;
    font-weight: 500;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 24px;
    column-gap: 12px;
    margin-top: 24px;
  }

  &__list-item {
  }

  &__list-title {
    color: #9e9e9e;
    font-size: 14px;
    line-height: 142%;
    margin-bottom: 4px;
  }

  &__map {
    // flex-grow: 1;
    width: 100%;
    height: 540px;
    border-radius: $border;
    overflow: hidden;
  }
}
</style>
<style lang="scss">
.ymaps-2-1-79-map-copyrights-promo {
  display: none;
}
.icon-marker {
  cursor: pointer;

  width: 57px;
  height: 57px;
  border-radius: 50%;

  position: relative;
  transform: translate(-50%, -90%);
  &::after {
    content: url("@/img/icon/location.svg");
  }
}
// inputs
.destination__list-input {
  height: 48px;
  width: 100%;
  background: var(--grey-light);
  border-radius: $border;
  color: var(--grey-dark);
  font-weight: 400;
  &::placeholder {
    color: #8f8f8f;
  }
}
// btn
.destination__btn {
  height: 56px;
  padding: 16px 24px;
  color: var(--white);
  font-weight: 500;
  text-align: center;
  border-radius: $border;
  width: 100%;
  max-width: 100%;
  margin-top: 16px;
  transition: $transition;
}

.el-button {
  --el-button-disabled-bg-color: rgb(185, 185, 185);
}
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: rgb(185, 185, 185);
  border-color: rgb(185, 185, 185);
}

.destination {
  .el-form-item__content {
    line-height: inherit;
    position: relative;
    font-size: inherit;
  }

  // autocomplete
  .el-autocomplete {
    width: 100%;
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
    padding: 1px 18px;
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

  // form
  .el-form-item {
    display: flex;
    --font-size: 14px;
    margin-bottom: 0px;
  }

  // loading
  .el-button .custom-loading .circular {
    margin-right: 6px;
    width: 25px;
    height: 25px;
    animation: loading-rotate 2s linear infinite;
  }
  .el-button .custom-loading .circular .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--el-button-text-color);
    stroke-linecap: round;
  }
}

// dropdown
.el-autocomplete__popper.el-popper.is-light {
  background: var(--grey-light);
  border: 1px solid #bdbdbd;
}
.el-autocomplete__popper.el-popper {
  box-shadow: none;
}
.el-popper {
  border-radius: $border;
  padding: 0px;
  font-size: 16px;
  line-height: 1.5;
  overflow-wrap: normal;
}
.el-autocomplete-suggestion {
  border-radius: $border;
}
// dropdown контейнер
.el-autocomplete-suggestion__wrap {
  max-height: 280px;
  padding: 0;
  border-radius: $border;
}
.el-autocomplete-suggestion li {
  padding: 10px 20px;
  line-height: 1.5;
  cursor: pointer;
  color: var(--grey-dark);
  font-size: 16px;
  transition: $transition;
  white-space: break-spaces;
  &:not(:last-child) {
    border-bottom: 1px solid #bdbdbd;
  }
  &:hover {
    background-color: #e6e4e4;
  }
}
// очистка поля
.el-input .el-input__clear,
.el-input .el-input__password {
  color: var(--el-input-icon-color);
  font-size: 20px;
  cursor: pointer;
}
// стрелка
  .el-autocomplete__popper.el-popper.is-light .el-popper__arrow::before {
    border: 1px solid #bdbdbd;
    background: var(--grey-light);
    width: 10px;
    height: 10px;
  }
  .el-autocomplete__popper.el-popper[data-popper-placement^="bottom"] > .el-popper__arrow::before {
    border-top-left-radius: 2px;
  }
</style>
