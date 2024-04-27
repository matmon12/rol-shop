<template>
  <div class="order">
    <div class="container">
      <div class="order__inner">
        <Category class="category-pages" />
        <Crumbs :paths="paths" class="crumbs" />

        <h1 class="order-title">Оформление заказа</h1>
        <div class="order-wrapper">
          <div class="order-left">
            <div class="order__person">
              <h4 class="order__person-title">Личные данные</h4>
              <el-form ref="ruleFormRef3" :model="form">
                <div class="order__person-inputs">
                  <el-form-item label="Имя" prop="name" :rules="rules.name">
                    <el-input v-model="form.name" placeholder="Ввод" />
                  </el-form-item>
                  <el-form-item label="Телефон" prop="tel" :rules="rules.tel">
                    <el-input
                      v-model="form.tel"
                      v-mask="['+7 (###) ###-##-##']"
                      placeholder="Ввод"
                    />
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div class="order__delivery">
              <div class="order__delivery-head">
                <h4 class="order__delivery-title">Доставка</h4>
                <el-tooltip content="Проверьте входит ли ваш адрес в зону доставки">
                  <el-button
                    plain
                    @click="
                      dialogVisible = true;
                      this.$store.commit('map/setDeliveryCheck', false);
                    "
                  >
                    Зона доставки
                    <img src="@/img/icon/info.svg" alt="" />
                  </el-button>
                </el-tooltip>
                <el-dialog v-model="dialogVisible" title="Зона доставки" align-center>
                  <p class="order-dialog__text">
                    Выберите место на карте, а мы проверим возможна ли доставка в эту зону
                  </p>
                  <div
                    v-if="deliveryCheck"
                    v-loading="loadingDeliveryCheck"
                    :element-loading-spinner="svg"
                    element-loading-svg-view-box="-10, -10, 50, 50"
                    class="order-dialog__check"
                  >
                    <img
                      class="order-dialog__check-img"
                      :src="
                        deliveryPossible
                          ? require('@/img/icon/check-green.svg')
                          : require('@/img/icon/none.svg')
                      "
                      alt=""
                    />
                    <p class="order-dialog__check-address">{{ addressDialog }}</p>
                    <span>—</span>
                    <p
                      :class="
                        deliveryPossible
                          ? 'order-dialog__check-green'
                          : 'order-dialog__check-red'
                      "
                    >
                      {{ deliveryPossible ? "Доставка возможна" : "Доставка невозможна" }}
                    </p>
                  </div>
                  <ul class="order-dialog__list">
                    <li class="order-dialog__list-item">
                      <img src="@/img/icon/circle-1.svg" alt="zone" />
                      <span>—</span>
                      <p class="order-dialog__list-text">Бесплатная доставка</p>
                    </li>
                    <li class="order-dialog__list-item">
                      <img src="@/img/icon/circle-2.svg" alt="zone" />
                      <span>—</span>
                      <p class="order-dialog__list-text">Платная доставка</p>
                    </li>
                    <li class="order-dialog__list-item">
                      <img src="@/img/icon/circle-3.svg" alt="zone" />
                      <span>—</span>
                      <p class="order-dialog__list-text">Доставку не делаем</p>
                    </li>
                  </ul>
                  <div class="destination__map">
                    <Map :geocoderCoord="geocoderCoord" ref="Map" />
                  </div>
                  <app-button
                    class="order-dialog__btn"
                    @click="checkAddress({ lat, long })"
                    :disabled="loadingDeliveryCheck"
                  >
                    <img src="@/img/icon/location-white.svg" alt="" />
                    Проверить адрес
                  </app-button>
                </el-dialog>
              </div>
              <p class="order__delivery-text">
                Зона бесплатной доставки уточняется у оператора
              </p>
              <div class="tabs-wrapper">
                <div
                  class="tabs order__tabs"
                  :class="tab === 'tab_1' ? 'tabs-active-1' : 'tabs-active-2'"
                >
                  <div
                    class="tab"
                    @click="tab = 'tab_1'"
                    :class="{ 'tab--is-active': tab === 'tab_1' }"
                  >
                    Доставка
                  </div>
                  <div
                    class="tab"
                    @click="(tab = 'tab_2'), fetchRestaurant()"
                    :class="{ 'tab--is-active': tab === 'tab_2' }"
                  >
                    Самовывоз
                  </div>
                </div>
                <div class="tabs__content">
                  <div v-if="tab === 'tab_1'" class="tab__content">
                    <p class="delivery__text">Минимальная сумма заказа 400 грн</p>
                    <div class="delivery__old" v-if="!addAddress && address.length > 0">
                      <ul class="address__list" v-auto-animate>
                        <label
                          class="address__list-item"
                          v-for="(item, index) in address"
                          :key="index"
                        >
                          <div class="address__info">
                            <p class="address__address">
                              {{ `${item.city}, ${item.address}` }}
                            </p>
                            <p class="address__other">
                              Подьезд {{ item.input ? item.input : "(-)" }}, этаж
                              {{ item.floor ? item.floor : "(-)" }}, квартира
                              {{ item.apartment ? item.apartment : "(-)" }}
                            </p>
                          </div>

                          <input
                            type="radio"
                            name="address"
                            v-model="addressRadio"
                            :value="item.id"
                          />
                        </label>
                      </ul>
                      <div class="delivery__btns">
                        <button class="delivery__btn" @click="addAddress = true">
                          Добавить новый адрес
                        </button>
                        <el-popconfirm
                          width="220"
                          title="Вы уверены что хотите удалить адрес?"
                          @confirm="removeAddress"
                          confirm-button-text="да"
                          cancel-button-text="нет"
                          icon-color="#626AEF"
                          :icon="EpInfoFilled"
                        >
                          <template #reference>
                            <button class="delivery__btn">Удалить адрес</button>
                          </template>
                        </el-popconfirm>
                      </div>
                      <div class="delivery__other">
                        <label for="delivery__other-1" class="delivery__other-label">
                          <input
                            class="delivery__other-input"
                            type="checkbox"
                            id="delivery__other-1"
                            v-model="doorOptions1"
                            value="Не звонить в дверь"
                          />
                          <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                                doorOptions1.find((item) => item === 'Не звонить в дверь')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                          Не звонить в дверь
                        </label>
                        <label for="delivery__other-2" class="delivery__other-label">
                          <input
                            class="delivery__other-input"
                            type="checkbox"
                            id="delivery__other-2"
                            v-model="doorOptions1"
                            value="Оставить под дверью"
                          />
                          <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                                doorOptions1.find((item) => item === 'Оставить под дверью')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                          Оставить под дверью
                        </label>
                      </div>
                    </div>
                    <div class="delivery__new" v-if="addAddress || address.length === 0">
                      <el-form ref="ruleFormRef1" :model="form">
                        <div class="delivery__new-city">
                          <label for="city-1" class="delivery__new-label">
                            <input
                              type="radio"
                              name="city"
                              id="city-1"
                              v-model="cityRadio1"
                              value="Киев"
                            />
                            <p>Киев</p>
                          </label>
                          <label for="city-2" class="delivery__new-label">
                            <input
                              type="radio"
                              name="city"
                              id="city-2"
                              v-model="cityRadio1"
                              value="Днепр"
                            />
                            <p>Днепр</p>
                          </label>
                          <label for="city-3" class="delivery__new-label">
                            <input
                              type="radio"
                              name="city"
                              id="city-3"
                              v-model="cityRadio1"
                              value="Харьков"
                            />
                            <p>Харьков</p>
                          </label>
                          <label for="city-4" class="delivery__new-label">
                            <input
                              type="radio"
                              name="city"
                              id="city-4"
                              v-model="cityRadio1"
                              value="Одесса"
                            />
                            <p>Одесса</p>
                          </label>
                        </div>
                        <el-form-item
                          label="Улица, дом"
                          prop="address"
                          :rules="rules.address"
                        >
                          <el-autocomplete
                            v-model="form.address"
                            :fetch-suggestions="fetchAddressSelect"
                            :trigger-on-focus="true"
                            :select-when-unmatched="false"
                            placeholder="Введите адрес"
                            @select="handleSelectAddress"
                            @input="this.checkFromSelect = false"
                            :debounce="1000"
                            clearable
                            fit-input-width
                            popper-class="my-autocomplete"
                            class="destination__form-search"
                          >
                            <template #default="{ item }">
                              <div class="address">{{ item.address }}</div>
                            </template>
                          </el-autocomplete>
                        </el-form-item>
                        <div class="delivery__new-inputs">
                          <el-form-item label="Дом">
                            <el-input v-model="form.house" placeholder="Ввод" />
                          </el-form-item>
                          <el-form-item label="Подъезд">
                            <el-input v-model="form.input" placeholder="Ввод" />
                          </el-form-item>
                          <el-form-item label="Этаж">
                            <el-input v-model="form.floor" placeholder="Ввод" />
                          </el-form-item>
                          <el-form-item label="Квартира">
                            <el-input v-model="form.apartment" placeholder="Ввод" />
                          </el-form-item>
                        </div>
                        <div class="delivery__other">
                          <label for="delivery__other-1" class="delivery__other-label">
                            <input
                              class="delivery__other-input"
                              type="checkbox"
                              id="delivery__other-1"
                              v-model="doorOptions2"
                              value="Не звонить в дверь"
                            />
                            <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                                doorOptions2.find((item) => item === 'Не звонить в дверь')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                            Не звонить в дверь
                          </label>
                          <label for="delivery__other-2" class="delivery__other-label">
                            <input
                              class="delivery__other-input"
                              type="checkbox"
                              id="delivery__other-2"
                              v-model="doorOptions2"
                              value="Оставить под дверью"
                            />
                            <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                                doorOptions2.find((item) => item === 'Оставить под дверью')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                            Оставить под дверью
                          </label>
                        </div>
                        <div class="delivery__new-back">
                          <el-form-item>
                            <button
                              class="delivery__new-back__btn"
                              @click.prevent="sumbitForm(ruleFormRef1)"
                              :disabled="
                                loadingPostAddress ||
                                loadingDeliveryCheck ||
                                loadingAddress
                              "
                            >
                              <div
                                v-if="
                                  loadingPostAddress ||
                                  loadingDeliveryCheck ||
                                  loadingAddress
                                "
                                class="delivery__new-back__box"
                              >
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
                                <span class="delivery__new-back__loading">{{
                                  loadingDeliveryCheck || loadingAddress
                                    ? "Проверка адреса"
                                    : loadingPostAddress
                                    ? "Идет отправка"
                                    : ""
                                }}</span>
                              </div>
                              <div v-else class="delivery__new-back__box">
                                <img src="@/img/icon/arrow-green.svg" alt="" />
                                <span>Назад</span>
                              </div>
                            </button>
                          </el-form-item>
                          <el-tooltip
                            content="Не забудьте нажать кнопку 'Назад' иначе адрес не сохранится"
                          >
                            <p class="delivery__new-back__text">
                              Адрес доставки сохранится автоматически
                            </p>
                          </el-tooltip>
                        </div>
                      </el-form>
                    </div>
                  </div>
                  <div v-if="tab === 'tab_2'" class="tab__content">
                    <el-form ref="ruleFormRef2" :model="form">
                      <div class="delivery__new-city">
                        <label for="city-1" class="delivery__new-label">
                          <input
                            type="radio"
                            name="city"
                            id="city-1"
                            @change="fetchRestaurant(), (form.restaurant = '')"
                            v-model="cityRadio2"
                            value="Киев"
                          />
                          <p>Киев</p>
                        </label>
                        <label for="city-2" class="delivery__new-label">
                          <input
                            type="radio"
                            name="city"
                            id="city-2"
                            @change="fetchRestaurant(), (form.restaurant = '')"
                            v-model="cityRadio2"
                            value="Днепр"
                          />
                          <p>Днепр</p>
                        </label>
                        <label for="city-3" class="delivery__new-label">
                          <input
                            type="radio"
                            name="city"
                            id="city-3"
                            @change="fetchRestaurant(), (form.restaurant = '')"
                            v-model="cityRadio2"
                            value="Харьков"
                          />
                          <p>Харьков</p>
                        </label>
                        <label for="city-4" class="delivery__new-label">
                          <input
                            type="radio"
                            name="city"
                            id="city-4"
                            @change="fetchRestaurant(), (form.restaurant = '')"
                            v-model="cityRadio2"
                            value="Одесса"
                          />
                          <p>Одесса</p>
                        </label>
                      </div>
                      <el-form-item
                        label="Ресторан с которого будете забирать"
                        prop="restaurant"
                        :rules="rules.restaurant"
                      >
                        <el-autocomplete
                          v-model="form.restaurant"
                          :fetch-suggestions="filterArray"
                          placeholder="Введите адрес"
                          @select="handleSelect"
                          @input="this.fromSelectRestaurant = false"
                          :debounce="500"
                          clearable
                          fit-input-width
                          popper-class="my-autocomplete"
                          class="destination__form-search"
                        >
                          <template #default="{ item }">
                            <div class="address">{{ item.address }}</div>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
            <div class="order__time">
              <h3 class="order__time-title">Время доставки</h3>
              <p class="order__time-text">Время доставки заказа уточните по телефону.</p>
              <div class="order__time-selects">
                <div class="order__time-select">
                  <p class="order__time-select-title">День</p>
                  <el-select
                    v-model="selectDay"
                    popper-class="order-select"
                    @change="generateTimeOptions"
                  >
                    <el-option
                      v-for="item in optionsDay"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span class="order__time-select-item">{{ item.label }}</span>
                    </el-option>
                  </el-select>
                </div>
                <div class="order__time-select">
                  <p class="order__time-select-title">Время</p>
                  <el-select v-model="selectTime" popper-class="order-select">
                    <el-option
                      v-for="item in optionsTime"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <div class="order__payment">
              <h3 class="order__payment-title">Способ оплаты</h3>
              <p class="order__payment-text">
                Алкогольные напитки оплачиваются только наличными
              </p>
              <form v-if="tab === 'tab_1'" action="">
                <div class="order__payment-list">
                  <label class="order__payment-label" for="radio-1">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-1"
                      v-model="paymentDelivery"
                      checked
                      value="Наличными курьеру"
                    />
                    Наличными курьеру
                  </label>
                  <label class="order__payment-label" for="radio-2">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-2"
                      v-model="paymentDelivery"
                      value="Оплата терминалом курьеру"
                    />
                    Оплата терминалом курьеру
                  </label>
                  <label class="order__payment-label" for="radio-3">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-3"
                      v-model="paymentDelivery"
                      value="Оплата картой online"
                    />
                    Оплата картой online
                  </label>
                  <label class="order__payment-label" for="radio-4">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-4"
                      v-model="paymentDelivery"
                      value="Оплата через BitPay"
                    />
                    Оплата через BitPay
                  </label>
                </div>
              </form>
              <form v-if="tab === 'tab_2'" action="">
                <div class="order__payment-list">
                  <label class="order__payment-label" for="radio-1">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-1"
                      v-model="paymentPickup"
                      checked
                      value="Наличными в точке выдачи"
                    />
                    Наличными в точке выдачи
                  </label>
                  <label class="order__payment-label" for="radio-2">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-2"
                      v-model="paymentPickup"
                      value="Оплата картой online"
                    />
                    Оплата картой online
                  </label>
                  <label class="order__payment-label" for="radio-3">
                    <input
                      class="order__payment-radio"
                      type="radio"
                      name="payment"
                      id="radio-3"
                      v-model="paymentPickup"
                      value="Оплата через BitPay"
                    />
                    Оплата через BitPay
                  </label>
                </div>
              </form>
              <div
                v-if="
                  (paymentDelivery === 'Наличными курьеру' && tab === 'tab_1') ||
                  (paymentPickup === 'Наличными в точке выдачи' && tab === 'tab_2')
                "
                class="order__payment-change"
              >
                <el-form ref="ruleFormRef5" :model="form">
                  <el-form-item
                    label="Подготовить сдачу с"
                    prop="change"
                    :rules="rules.number"
                    class="order__payment-change-input"
                  >
                    <el-input v-model.number="form.change" placeholder="500">
                      <template #suffix>
                        <span>грн</span>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <div class="order__comment">
              <h3 class="order__comment-title">Комментарий</h3>
              <el-form ref="ruleFormRef4" :model="form">
                <div class="order__comment-inputs">
                  <el-form-item
                    label="Обычные палочки"
                    prop="comment1"
                    :rules="rules.number"
                  >
                    <el-input v-model.number="form.comment1" placeholder="4" />
                  </el-form-item>
                  <el-form-item
                    label="Учебные палочки"
                    prop="comment2"
                    :rules="rules.number"
                  >
                    <el-input v-model.number="form.comment2" placeholder="1" />
                  </el-form-item>
                </div>
                <el-form-item label="Примечание к заказу">
                  <el-input
                    class="order__comment-textarea"
                    v-model="form.note"
                    type="textarea"
                    :rows="2"
                  />
                </el-form-item>
                <div class="delivery__other">
                  <label for="order__comment-1" class="delivery__other-label">
                    <input
                      v-model="animals"
                      class="delivery__other-input"
                      type="checkbox"
                      id="order__comment-1"
                      value="cat"
                    />
                    <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                            animals.find((item) => item === 'cat')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                    У меня есть кошка
                  </label>
                  <label for="order__comment-2" class="delivery__other-label">
                    <input
                      v-model="animals"
                      class="delivery__other-input"
                      type="checkbox"
                      id="order__comment-2"
                      value="dog"
                    />
                    <div class="delivery__other-check">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="
                            animals.find((item) => item === 'dog')
                              "><path fill="none" stroke="currentColor" stroke-dasharray="24" stroke-dashoffset="24" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11L11 17L21 7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0"/></path></svg>
                          </div>
                    У меня есть собака
                  </label>
                </div>
              </el-form>
            </div>
          </div>
          <div class="order-right">
            <el-scrollbar max-height="700px">
              <CartList />
            </el-scrollbar>

            <EmptyBlock
              v-if="cart.length === 0"
              :imgUrl="require('@/img/icon/cart-empty.svg')"
              title="Вы еще не добавили товары в корзину"
              text="Добавьте товары в корзину, чтобы сделать заказ"
            />

            <SliderOrder
              class="order-added"
              v-loading="sliderLoading"
              :slides="products"
              @order-add-cart="(item) => onClickAddPlus(item)"
            />

            <div class="order__total">
              <el-form ref="ruleFormRef6">
                <div class="order__total-promokod">
                  <el-form-item class="order__total-input">
                    <p v-if="codeValid === false" class="order__total-novalid">
                      Промокод введен не верно!
                    </p>
                    <el-input placeholder="Введите промокод" v-model="form.code">
                      <template #suffix>
                        <img
                          v-if="codeValid === true"
                          src="@/img/icon/check-green.svg"
                          alt=""
                        />
                        <img
                          v-if="codeValid === false"
                          src="@/img/icon/warning.svg"
                          alt=""
                        />
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <button
                      class="order__total-promokod-btn"
                      @click.prevent="codeValid === true ? cancelCode() : checkCode()"
                      :disabled="codeLoading || freeLoading"
                    >
                      <div v-if="codeLoading" class="order__total-btn-box">
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
                      <span v-if="!codeLoading">{{
                        codeValid === true ? "Отменить" : "Применить"
                      }}</span>
                    </button>
                  </el-form-item>
                </div>
              </el-form>
              <div v-if="freeProduct.length > 0" class="order__total-list">
                <div class="order__total-item" v-for="item in freeProduct" :key="item.id">
                  <div class="order__total-list-left">
                    <div class="order__total-imgwrapper">
                      <img
                        class="order__total-img"
                        :src="require(`@/img/products/${item.imgUrl}`)"
                        alt=""
                      />
                    </div>
                    <div class="order__total-info">
                      <p class="order__total-list-title">{{ item.title }}</p>
                      <p class="order__total-list-weight">Вес: {{ item.weight }} г</p>
                    </div>
                  </div>
                  <div class="order__total-list-right">
                    <p class="order__total-count">{{ item.count }} шт</p>
                    <p class="order__total-free">Бесплатно</p>
                  </div>
                  <div class="order__total-list-btn">
                    <img src="@/img/icon/plus-green.svg" alt="" />
                  </div>
                </div>
              </div>
              <div class="order__total-box">
                <div class="order__total-left">
                  <p class="order__total-text">Итого:</p>
                  <p class="order__total-price">{{ totalPrice }}<span>грн</span></p>
                </div>
                <button
                  @click="postOrder"
                  class="order__total-btn"
                  :disabled="totalPrice < 400 || isCreatingOrder"
                >
                  <div v-if="isCreatingOrder" class="order__total-btn-box">
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
                    <span>Отправка...</span>
                  </div>
                  <span v-else>Оформить заказ</span>
                </button>
              </div>
              <p v-if="totalPrice < 400" class="order__total-warning">
                Минимальная сумма заказа 400 грн
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject, ref, computed } from "vue";
import * as turf from "@turf/turf";
import emitter from "@/store/eventBus.js";
import { mapActions, mapMutations, mapState, useStore } from "vuex";
import EpInfoFilled from "~icons/ep/info-filled";
import LineMdConfirm from "~icons/line-md/confirm";
export default {
  data() {
    let currentDate = new Date();

    let data1 = new Date();
    let data2 = new Date();
    let data3 = new Date();
    let data4 = new Date();
    let data5 = new Date();
    data1.setDate(currentDate.getDate());
    data2.setDate(currentDate.getDate() + 1);
    data3.setDate(currentDate.getDate() + 2);
    data4.setDate(currentDate.getDate() + 3);
    data5.setDate(currentDate.getDate() + 4);

    let month1 = data1.getMonth() + 1;
    let month2 = data2.getMonth() + 1;
    let month3 = data3.getMonth() + 1;
    let month4 = data4.getMonth() + 1;
    let month5 = data5.getMonth() + 1;

    data1 = data1 < 10 ? "0" + data1.getDate() : data1.getDate();
    data2 = data2 < 10 ? "0" + data2.getDate() : data2.getDate();
    data3 = data3 < 10 ? "0" + data3.getDate() : data3.getDate();
    data4 = data4 < 10 ? "0" + data4.getDate() : data4.getDate();
    data5 = data5 < 10 ? "0" + data5.getDate() : data5.getDate();

    month1 = month1 < 10 ? "0" + month1 : month1;
    month2 = month2 < 10 ? "0" + month2 : month2;
    month3 = month3 < 10 ? "0" + month3 : month3;
    month4 = month4 < 10 ? "0" + month4 : month4;
    month5 = month5 < 10 ? "0" + month5 : month5;

    return {
      input: "",
      dialogVisible: false,
      tab: "tab_1",
      addAddress: false,
      paths: [{ name: "Оформление заказа", path: "/rol-shop/order" }],
      loadingPostAddress: false,
      restaurants: [],
      optionsDay: [
        {
          value: `${data1}.${month1}`,
          label: "Сегодня",
        },
        {
          value: `${data2}.${month2}`,
          label: "Завтра",
        },
        {
          value: `${data3}.${month3}`,
          label: `${data3}.${month3}`,
        },
        {
          value: `${data4}.${month4}`,
          label: `${data4}.${month4}`,
        },
        {
          value: `${data5}.${month5}`,
          label: `${data5}.${month5}`,
        },
      ],
      optionsTime: [],
      selectDay: "",
      selectTime: "",
      lat: "",
      long: "",
      svg: `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0); stroke: #f63"/>
      `,
      paymentDelivery: "Наличными курьеру",
      paymentPickup: "Наличными в точке выдачи",
      sliderLoading: false,
      validForm1: false,
      validForm2: false,
      validForm3: false,
      isCreatingOrder: false,
      orderId: null,
      animals: ["dog"],
      doorOptions1: ["Оставить под дверью"],
      doorOptions2: ["Оставить под дверью"],
      addressRadio: "",
      cityRadio1: "Киев",
      cityRadio2: "Киев",
      resultsOrder: "",
      coord: this.$store.state.map.coord,
      result: [],
      orderDone: false,
      idAddress: "",
      EpInfoFilled: EpInfoFilled,
    };
  },
  components: {
    LineMdConfirm,
  },
  methods: {
    ...mapActions({
      checkAddress: "map/checkAddress",
    }),
    ...mapMutations({
      setPaths: "crumbs/setPaths",
    }),
    async fetchAddressSelect(value, cb) {
      try {
        if (value) {
          const { data } = await axios.get(
            `https://suggest-maps.yandex.ru/v1/suggest?apikey=00748542-2e0b-439d-864b-98b4baac2c5f&text=${this.cityRadio1}, ${value}&bbox=${this.area}&lang=ru_RU&strict_bounds=1&types=street,metro,house,district,vegetation&print_address=1`
          );
          if (data.results) {
            this.result = data.results.map((item) => ({
              address: item.title.text,
              house: item.address.component.find((pl) => pl.kind == "HOUSE")
                ? item.address.component.find((pl) => pl.kind == "HOUSE").name
                : "",
            }));

            // возвращение данных
            cb(this.result);
          } else {
            // если нет результатов / скрытие списка
            cb([]);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    handleSelectAddress(item) {
      // заполнение полей
      this.form.address = item.address;
      this.form.house = item.house;

      // проверка что адрес был выбран из списка
      this.checkFromSelect = true;
    },
    async fetchAddress() {
      let apiRes = null;
      try {
        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/address`);

        this.address = data;

        // по умолчанию первый отмечен
        if (this.address.length > 0) {
          this.addressRadio = this.address[0].id;
        }
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
    async fetchRestaurant() {
      try {
        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/restaurant?city=${this.cityRadio2}`
        );

        this.restaurants = data;
      } catch (err) {
        console.log(err);
      }
    },
    async fetchProduct() {
      let apiRes = null;
      try {
        this.sliderLoading = true;

        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?category=drinks`
        );

        this.products = data.map((obj) => ({
          ...obj,
          isAdded: false,
          count: 1,
        }));
      } catch (err) {
        apiRes = err.response.status;
      } finally {
        this.sliderLoading = false;
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
    geocoderCoord(lat, long) {
      this.lat = lat;
      this.long = long;

      // скрытие блока при клике по карте
      this.$store.commit("map/setDeliveryCheck", false);
    },
    async removeAddress() {
      await axios.delete(
        `https://c2ff7a8de0a119c8.mokky.dev/address/${this.addressRadio}`
      );

      let index = this.address.findIndex((item) => item.id == this.addressRadio);
      if (index !== -1) {
        this.address.splice(index, 1);
      }

      // первый адрес отмечен
      if (this.address.length > 0) {
        this.addressRadio = this.address[0].id;
      }
    },
    sumbitForm(forName) {
      forName.validate((valid) => {
        if (valid) {
          this.postAddress().then(() => {
            this.addAddress = false;
            this.fetchAddress();
          });
        } else {
          return false;
        }
      });
    },
    async postAddress() {
      try {
        this.loadingPostAddress = true;

        if (
          !this.repeatAddress(
            this.form.address,
            this.form.house,
            this.form.input,
            this.form.floor,
            this.form.apartment,
            this.cityRadio1
          )
        ) {
          const { data } = await axios.post(
            `https://c2ff7a8de0a119c8.mokky.dev/address`,
            {
              address: this.form.address,
              house: this.form.house,
              input: this.form.input,
              floor: this.form.floor,
              apartment: this.form.apartment,
              city: this.cityRadio1,
            }
          );
        }

        this.form.address = "";
        this.form.house = "";
        this.form.input = "";
        this.form.floor = "";
        this.form.apartment = "";
      } catch (err) {
        console.log(err);
      } finally {
        this.loadingPostAddress = false;
      }
    },
    filterArray(input, cb) {
      const results = this.restaurants.filter((element) =>
        element.address.toLowerCase().includes(input.toLowerCase())
      );
      cb(results);
    },
    handleSelect(item) {
      // ресторан из списка
      this.fromSelectRestaurant = true;
      this.form.restaurant = item.address;
    },
    async validForms() {
      if (!this.ruleFormRef3) return;
      await this.ruleFormRef3.validate((valid, fields) => {
        if (valid) {
          this.validForm1 = true;
        }
      });
      if (this.tab === "tab_2") {
        await this.ruleFormRef2.validate((valid, fields) => {
          if (valid) {
            this.validForm2 = true;
          }
        });
      }
      if (this.tab === "tab_1" && (this.addAddress || this.address.length === 0)) {
        await this.ruleFormRef1.validate((valid, fields) => {
          if (valid) {
            this.validForm3 = true;
          }
        });
      }
    },
    generateTimeOptions() {
      this.optionsTime = [];
      if (this.selectDay === this.optionsDay[0].value) {
        let currentDate = new Date();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();

        this.optionsTime.push({ value: `${hours}:${minutes}`, label: "Ближайшее" });

        if (minutes > 30) {
          this.optionsTime.push({ value: `${hours + 2}:30`, label: `${hours + 2}:30` });
          for (let i = hours + 3; i < 23; i++) {
            this.optionsTime.push({ value: `${i}:00`, label: `${i}:00` });
            this.optionsTime.push({ value: `${i}:30`, label: `${i}:30` });
          }
        } else {
          for (let i = hours + 2; i < 23; i++) {
            this.optionsTime.push({ value: `${i}:00`, label: `${i}:00` });
            this.optionsTime.push({ value: `${i}:30`, label: `${i}:30` });
          }
        }
      } else {
        for (let i = 11; i < 23; i++) {
          this.optionsTime.push({ value: `${i}:00`, label: `${i}:00` });
          this.optionsTime.push({ value: `${i}:30`, label: `${i}:30` });
        }
      }
      this.selectTime = this.optionsTime[0].value;
    },
    postOrder() {
      this.validForms().then(() => {
        if (this.tab === "tab_2") {
          //самовывоз
          if (this.validForm1 && this.validForm2) {
            this.createOrder();
          }
        } else if (
          this.tab === "tab_1" &&
          (this.addAddress || this.address.length === 0)
        ) {
          // доставка и добавить
          if (this.validForm1 && this.validForm3) {
            this.createOrder();
          }
        } else {
          // доставка и сохраненный адрес
          if (this.validForm1) {
            this.createOrder();
          }
        }
      });
    },
    async createOrder() {
      try {
        this.isCreatingOrder = true;

        const info = {
          name: this.form.name,
          tel: this.form.tel,
          day: this.selectDay,
          time: this.selectTime,
          year: new Date().getFullYear(),
          payment: this.tab === "tab_1" ? this.paymentDelivery : this.paymentPickup,
          items: this.cart,
          totalPrice: this.totalPrice,
          animals: this.animals,
          methods: this.tab === "tab_1" ? "Доставка" : "Самовывоз",
          address: "",
          options: "",
          number: "",
          status: 0,
        };

        // сдача
        if (
          (this.paymentDelivery === "Наличными курьеру" && this.tab === "tab_1") ||
          (this.paymentPickup === "Наличными в точке выдачи" && this.tab === "tab_2")
        ) {
          info.change = this.form.change ? this.form.change : "без сдачи";
        }

        if (this.form.comment1) {
          info.regularSticks = this.form.comment1;
        }
        if (this.form.comment2) {
          info.traningSticks = this.form.comment2;
        }
        if (this.form.note) {
          info.note = this.form.note;
        }
        if (this.freeProduct.length > 0) {
          info.freeProduct = this.freeProduct;
        }

        if (this.tab === "tab_1" && !this.addAddress && this.address.length > 0) {
          const result = this.address.find((item) => {
            return item.id === this.addressRadio;
          });
          info.address = result;
          info.options = this.doorOptions1;
        }

        if (this.tab === "tab_1" && (this.addAddress || this.address.length === 0)) {
          const result = {
            city: this.cityRadio1,
            address: this.form.address,
            house: this.form.house,
            input: this.form.input,
            floor: this.form.floor,
            apartment: this.form.apartment,
          };
          info.address = result;
          info.options = this.doorOptions2;
        }

        if (this.tab === "tab_2") {
          const result = {
            city: this.cityRadio2,
            address: this.form.restaurant,
          };
          info.address = result;
        }

        // история заказов в localStorage
        this.historyOrder = Number(this.historyOrder) + 1;
        localStorage.setItem("order", JSON.stringify(this.historyOrder));
        info.number = this.historyOrder;

        const { data } = await axios.post(
          `https://c2ff7a8de0a119c8.mokky.dev/orders`,
          info
        );

        this.cart = [];
      } catch (err) {
        console.log(err);
      } finally {
        this.isCreatingOrder = false;
        this.orderDone = true;
      }
    },
    async fetchOrder(number) {
      let apiRes = null;
      try {
        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/orders?number=${number}`
        );

        this.resultsOrder = data[0];
        this.cart = this.resultsOrder.items;
      } catch (err) {
        if (err.response) {
          apiRes = err.response.status;
        }
      } finally {
        if (apiRes == 404) {
          this.$router.push("/rol-shop/404");
        }
      }
    },
    onRepeatOrder(number) {
      this.fetchOrder(number).then(() => {
        // включение кнопки для карточек и слайдера и favorites
        // this.sushi = this.updateItemsStatus(this.sushi);
        // this.rolls = this.updateItemsStatus(this.rolls);
        // this.sets = this.updateItemsStatus(this.sets);
        // this.snacks = this.updateItemsStatus(this.snacks);
        // this.drinks = this.updateItemsStatus(this.drinks);
        // this.slides = this.updateItemsStatus(this.slides);
        // this.favorites = this.updateItemsStatus(this.favorites);
        // this.categores = this.updateItemsStatus(this.categores);
        // this.slidesTovar = this.updateItemsStatus(this.slidesTovar);
        this.products = this.updateItemsStatus(this.products);
        // this.cart.some((cartItem) => cartItem.id === this.product.id)
        //   ? (this.product.isAdded = true)
        //   : null;

        // заполнение полей
        this.form.name = this.resultsOrder.name;
        this.form.tel = this.resultsOrder.tel;
        this.form.change =
          this.resultsOrder.change !== "без сдачи" ? this.resultsOrder.change : "";
        this.animals = this.resultsOrder.animals;

        if (this.resultsOrder.methods === "Доставка") {
          this.tab = "tab_1";
          this.paymentDelivery = this.resultsOrder.payment;

          if (
            this.repeatAddress(
              //если адрес есть в сохраненных
              this.resultsOrder.address.address,
              this.resultsOrder.address.house,
              this.resultsOrder.address.input,
              this.resultsOrder.address.floor,
              this.resultsOrder.address.apartment,
              this.resultsOrder.address.city
            )
          ) {
            this.addressRadio = this.idAddress;
            this.doorOptions1 = this.resultsOrder.options;
          } else {
            // не сохраненный адрес
            this.addAddress = true;

            this.cityRadio1 = this.resultsOrder.address.city;
            this.form.address = this.resultsOrder.address.address;
            this.form.house = this.resultsOrder.address.house;
            this.form.input = this.resultsOrder.address.input;
            this.form.floor = this.resultsOrder.address.floor;
            this.form.apartment = this.resultsOrder.address.apartment;

            this.doorOptions2 = this.resultsOrder.options;
          }
        }
        if (this.resultsOrder.methods === "Самовывоз") {
          this.tab = "tab_2";
          this.paymentPickup = this.resultsOrder.payment;

          this.cityRadio2 = this.resultsOrder.address.city;
          this.form.restaurant = this.resultsOrder.address.address;
          this.fetchRestaurant();
        }
        if (this.resultsOrder.regularSticks) {
          this.form.comment1 = this.resultsOrder.regularSticks;
        }
        if (this.resultsOrder.traningSticks) {
          this.form.comment2 = this.resultsOrder.traningSticks;
        }
        if (this.resultsOrder.note) {
          this.form.note = this.resultsOrder.note;
        }
      });
    },
    updateItemsStatus(items) {
      return items.map((item) => ({
        ...item,
        isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
      }));
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
          this.idAddress = item.id;
          return true;
        }
      }
      return false;
    },
  },
  mounted() {
    // значения по умолчанию
    this.selectDay = this.optionsDay[0].value;
    // генерация времени
    this.generateTimeOptions();
    // координаты центра по умолчанию
    this.lat = this.coord[0];
    this.long = this.coord[1];
    // slider
    this.fetchProduct().then(() => {
      this.products = this.products.map((item) => ({
        ...item,
        isAdded: this.cart.some((cartItem) => cartItem.id === item.id),
      }));
    });

    // прослушивание событие с корзины
    // emitter.on("is-order-fetching", this.onRepeatOrder);

    // если есть параметр repeat повтор заказа
    if (this.$route.query.repeat) {
      this.fetchAddress().then(() => {
        const number = this.$route.query.repeat;
        this.onRepeatOrder(number);
      });
    } else {
      this.fetchAddress();
    }
  },
  computed: {
    ...mapState({
      deliveryPossible: (state) => state.map.deliveryPossible,
      deliveryCheck: (state) => state.map.deliveryCheck,
      addressDialog: (state) => state.map.address,
      loadingDeliveryCheck: (state) => state.map.loading,
      loadingAddress: (state) => state.map.loadingAddress,
    }),
    checkCart() {
      return this.cart.length === 0;
    },
    repeatOnPage() {
      return Object.prototype.hasOwnProperty.call(this.$route.query, "repeat");
    },
  },
  watch: {
    repeatOnPage(value) {
      // если повтор заказа был сделан когда страница уже была открыта
      if (value) {
        const number = this.$route.query.repeat;
        this.onRepeatOrder(number);
      }
    },
    checkCart(value) {
      if (value) {
        if (!this.orderDone) {
          // удаление query из запроса если нет товаров в корзине
          this.$router.push({ path: "/rol-shop/order" });
        } else {
          this.$router.push({ path: "/rol-shop/success" });
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.setPaths(vm.paths);
    });
  },
  setup(props) {
    const { address, area } = inject("address");
    const { cart, addToCart, removeFromCart, totalPrice, historyOrder } = inject("cart");
    const {
      sushi,
      rolls,
      sets,
      snacks,
      drinks,
      slides,
      favorites,
      categores,
      product,
      slidesTovar,
      products,
    } = inject("items");
    const form = ref({
      name: "",
      tel: "",
      address: "",
      house: "",
      input: "",
      floor: "",
      apartment: "",
      restaurant: "",
      comment1: "",
      comment2: "",
      note: "",
      change: "",
      code: "",
    });
    const ruleFormRef1 = ref({});
    const ruleFormRef2 = ref({});
    const ruleFormRef3 = ref({});
    const ruleFormRef4 = ref({});
    const ruleFormRef5 = ref({});
    const ruleFormRef6 = ref({});
    const ruleFormRef7 = ref({});
    const ruleFormRef8 = ref({});

    const code = ref();
    const codeValid = ref();
    const codeLoading = ref(false);
    const freeProduct = ref([]);
    const freeLoading = ref(false);

    const store = useStore();
    var arrayCoord = computed(() => store.state.map.arrayCoord);
    var deliveryPossible = computed(() => store.state.map.deliveryPossible);
    var checkFromSelect = ref(false);
    var fromSelectRestaurant = ref(false);

    // кастомное правило
    const checkNumber = (rule, value, callback) => {
      if (!Number.isInteger(value) && value) {
        callback(new Error("Введите число!"));
      } else {
        if (value <= 0 && value) {
          callback(new Error("Неверное кол-во!"));
        } else {
          callback();
        }
      }
    };

    // получение промокода
    const fetchCode = async () => {
      try {
        codeLoading.value = true;

        const { data } = await axios.get(`https://c2ff7a8de0a119c8.mokky.dev/code`);

        code.value = data[0].code;
      } catch (err) {
        console.log(err);
      } finally {
        codeLoading.value = false;
      }
    };

    // получение товаров по промокоду
    const fetchFree = async () => {
      try {
        freeLoading.value = true;

        const { data } = await axios.get(
          `https://c2ff7a8de0a119c8.mokky.dev/items?category=snacks&id=41`
        );

        freeProduct.value = data.map((obj) => ({
          ...obj,
          count: 1,
        }));
      } catch (err) {
        console.log(err);
      } finally {
        freeLoading.value = false;
      }
    };

    const checkCode = () => {
      fetchCode().then(() => {
        if (code.value === form.value.code) {
          codeValid.value = true;
          fetchFree();
        } else {
          codeValid.value = false;
        }
      });
    };

    const cancelCode = () => {
      freeProduct.value = [];
      codeValid.value = "";
      form.value.code = "";
    };

    // проверка адреса на доступность для доставки
    const checkGeo = (rule, value, callback) => {
      let possible = false;
      let address = `${props.cityRadio1}, ${value}`;
      store.dispatch("map/geocoderAddress", address).then(() => {
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

    // проверка что адрес был выбран из списка
    const checkSelect = (rule, value, callback) => {
      if (!checkFromSelect.value) {
        callback(new Error("Адрес не выбран!"));
      } else {
        callback();
      }
    };

    // проверка что ресторан был выбран из списка
    const checkRestaurant = (rule, value, callback) => {
      if (!fromSelectRestaurant.value) {
        callback(new Error("Адрес не выбран!"));
      } else {
        callback();
      }
    };

    const rules = ref({
      address: [
        { required: true, message: "Нужно заполнить!", trigger: "blur" },
        { min: 5, message: "Слишком короткий!", trigger: "blur" },
        { validator: checkGeo, trigger: "submit" },
        { validator: checkSelect, trigger: "submit" },
      ],
      restaurant: [
        { required: true, message: "Нужно заполнить!", trigger: "blur" },
        { min: 5, message: "Слишком короткий!", trigger: "blur" },
        { validator: checkRestaurant, trigger: "submit" },
      ],
      name: [
        { required: true, message: "Нужно заполнить!", trigger: "blur" },
        { min: 3, message: "Слишком короткий!", trigger: "blur" },
      ],
      tel: [
        { required: true, message: "Нужно заполнить!", trigger: "blur" },
        { min: 18, message: "Слишком короткий!", trigger: "blur" },
      ],
      number: [{ validator: checkNumber, trigger: "blur" }],
    });

    const onClickAddPlus = (item) => {
      if (!item.isAdded) {
        addToCart(item);
      } else {
        removeFromCart(item);
      }
    };

    return {
      address,
      form,
      ruleFormRef1,
      ruleFormRef2,
      ruleFormRef3,
      ruleFormRef4,
      ruleFormRef5,
      ruleFormRef6,
      ruleFormRef7,
      ruleFormRef8,
      rules,
      cart,
      onClickAddPlus,
      products,
      totalPrice,
      checkCode,
      codeValid,
      codeLoading,
      freeProduct,
      cancelCode,
      freeLoading,
      historyOrder,
      sushi,
      rolls,
      sets,
      snacks,
      drinks,
      slides,
      favorites,
      categores,
      product,
      slidesTovar,
      area,
      checkFromSelect,
      fromSelectRestaurant,
    };
  },
};
</script>

<style lang="scss" scoped>
.crumbs {
  position: absolute;
  top: 0;
  left: 0;
}
.destination__map {
  // flex-grow: 1;
  width: 100%;
  height: 400px;
  border-radius: $border;
  overflow: hidden;
}
.order {
  &__inner {
    position: relative;
  }
}
.order-title {
  color: var(--grey-dark);
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.4;
}
.order-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 64px;
}
.order-left {
  width: 645px;
}
.order {
  &__person {
    background-color: var(--white);
    border-radius: $border;
    padding: 24px;
    margin-bottom: 20px;
  }

  &__person-title {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  &__person-inputs {
    display: flex;
    gap: 12px;
  }

  &__delivery {
    background-color: var(--white);
    border-radius: $border;
    padding: 24px;
    margin-bottom: 20px;
  }

  &__delivery-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  &__delivery-title {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 500;
    line-height: 1.4;
  }
}
.order-dialog {
  &__text {
    font-weight: 400;
    color: rgb(104, 104, 112);
  }

  &__list {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    margin-top: 40px;
  }

  &__list-item {
    display: flex;
    gap: 12px;
    span {
      color: var(--grey-dark);
      font-size: 20px;
      font-weight: 400;
    }
  }

  &__list-text {
    color: var(--grey-dark);
    font-size: 20px;
    font-weight: 400;
  }

  &__btn {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    align-items: center;
    &:disabled {
      cursor: default;
      background-color: #929292;
    }
  }
}
.address {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__list-item {
    width: 100%;
    border-radius: $border;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid rgb(237, 237, 237);
    &::before {
      content: url("@/img/icon/location-grey.svg");
      height: 24px;
      width: 20px;
    }
    input {
      appearance: none;
      min-width: 24px;
      height: 24px;
      border: 1px solid rgb(158, 158, 158);
      border-radius: 50%;
      position: relative;
      transition: $transition;
      cursor: pointer;
      &::before {
        content: "";
        width: 14px;
        height: 14px;
        background-color: transparent;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        transition: $transition;
      }
      &:checked {
        border: 2px solid rgb(255, 102, 51);
        &::before {
          background-color: rgb(255, 102, 51);
        }
      }
    }
  }

  &__info {
    flex-grow: 1;
  }

  &__address {
    color: var(--grey-dark);
    font-weight: 500;
    font-size: 14px;
  }

  &__other {
    color: rgb(104, 104, 112);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.3;
  }
}
.order {
  &__delivery-text {
    color: rgb(104, 104, 112);
    font-size: 14px;
    margin-bottom: 16px;
  }

  &__tabs {
    display: flex;
    background: var(--grey-light);
    border-radius: $border;
    padding: 6px 8px;
    position: relative;
    margin-bottom: 8px;
    &::after {
      content: "";
      background-color: rgb(255, 102, 51);
      border-radius: $border;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: calc(50% - 8px);
      height: calc(100% - 12px);
      transition: $transition;
    }
    &.tabs-active-1 {
      &::after {
        left: 8px;
        right: auto;
      }
    }
    &.tabs-active-2 {
      &::after {
        transform: translateY(-50%) translateX(100%);
      }
    }
  }
}
.tabs-wrapper {
}
.tabs {
  &__content {
  }
}
.tab {
  flex: 1;
  text-align: center;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $transition;
  z-index: 1;
  color: var(--grey-dark);
  font-weight: 500;
  cursor: pointer;
  &__content {
  }
}
.delivery {
  &__text {
    margin-left: 8px;
    font-size: 14px;
    color: var(--grey-dark);
    margin-bottom: 24px;
  }

  &__btns {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  &__btn {
    flex: 1;
    text-align: center;
    background-color: var(--grey-light);
    border-radius: $border;
    height: 56px;
    font-weight: 500;
    &:nth-child(1) {
      color: rgb(0, 204, 45);
    }
    &:nth-child(2) {
      color: rgb(244, 72, 55);
    }
  }

  &__other {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__other-label {
    width: fit-content;
    display: flex;
    align-items: center;
    color: var(--grey-dark);
  }
}
input.delivery__other-input {
  appearance: none;
  &:checked + div {
    border: 2px solid rgb(255, 102, 51);
    background-color: rgb(255, 102, 51);
  }
}
.tab--is-active {
  color: var(--white);
}
.delivery__other-check{
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid rgb(158, 158, 158);
  cursor: pointer;
  transition: $transition;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  svg{
    height: 20px;
    width: 17px;
  }
}

.delivery {
  &__new {
  }

  &__new-city {
    margin: 24px 0;
    display: flex;
    gap: 12px;
  }

  &__new-label {
    input {
      appearance: none;
      display: none;
      &:checked + p {
        background-color: rgb(255, 102, 51);
        color: var(--white);
      }
    }
    p {
      border-radius: $border;
      background-color: var(--grey-light);
      padding: 12px;
      color: var(--grey-dark);
      font-weight: 500;
      transition: $transition;
    }
  }

  &__new-inputs {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    margin-bottom: 24px;
  }

  &__new-back {
    margin-top: 24px;
    display: flex;
    gap: 16px;
    &__btn {
      padding: 16px;
      border-radius: $border;
      background-color: var(--grey-light);
      width: 290px;
      color: rgb(0, 204, 45);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        transform: rotate(90deg);
      }
      &:disabled {
        cursor: default;
      }
    }
    &__text {
      color: rgb(104, 104, 112);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      &::before {
        content: url("@/img/icon/info-grey.svg");
        height: 18px;
      }
    }
    &__box {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    &__loading {
      color: #929292;
    }
  }
}
// loading
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
.order {
  &__time {
    border-radius: $border;
    padding: 24px;
    background-color: var(--white);
    margin-bottom: 20px;
  }

  &__time-title {
    color: var(--grey-dark);
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 8px;
  }

  &__time-text {
    margin-bottom: 24px;
    color: rgb(104, 104, 112);
    font-size: 14px;
  }

  &__time-selects {
    display: flex;
    gap: 8px;
  }

  &__time-select {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__time-select-title {
    color: rgb(158, 158, 158);
    font-size: 14px;
  }
}
.order-dialog {
  &__check {
    margin-top: 12px;
    display: flex;
    gap: 12px;
    font-size: 18px;
    font-weight: 500;
  }

  &__check-img {
  }

  &__check-address {
    color: var(--grey-dark);
  }

  &__check-green {
    color: rgb(0, 204, 45);
  }
  &__check-red {
    color: red;
  }
}
.order {
  &__payment {
    border-radius: $border;
    background-color: var(--white);
    padding: 24px;
    margin-bottom: 20px;
  }

  &__payment-title {
    font-weight: 500;
    font-size: 24px;
    color: var(--grey-dark);
    margin-bottom: 8px;
  }

  &__payment-text {
    color: rgb(104, 104, 112);
    margin-bottom: 24px;
    font-size: 14px;
  }

  &__payment-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__payment-label {
    display: flex;
    gap: 16px;
    font-size: 16px;
    color: var(--grey-dark);
  }

  &__payment-radio {
    appearance: none;
    min-width: 24px;
    height: 24px;
    border: 1px solid rgb(158, 158, 158);
    border-radius: 50%;
    position: relative;
    cursor: pointer;
    &::before {
      content: "";
      width: 14px;
      height: 14px;
      background-color: transparent;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: $transition;
    }
    &:checked {
      border: 2px solid rgb(255, 102, 51);
      &::before {
        background-color: rgb(255, 102, 51);
      }
    }
  }

  &__payment-change {
    margin-top: 20px;
  }

  &__payment-change-input {
    max-width: 205px;
  }
}
.order {
  &__comment {
    background-color: var(--white);
    border-radius: $border;
    padding: 24px;
  }

  &__comment-title {
    color: var(--grey-dark);
    font-weight: 500;
    font-size: 24px;
    margin-bottom: 24px;
  }

  &__comment-inputs {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  &__comment-textarea {
    margin-bottom: 24px;
    height: 96px;
  }
}
.order-right {
  width: 778px;
  &__drawer {
  }
  .basket-list {
    gap: 20px;
    padding: 0 0 0 16px;
    margin-right: 0;
    overflow-y: hidden;
  }
}
.order-added {
  margin-top: 64px;
}
.order {
  &__total {
    margin-top: 64px;
  }

  &__total-promokod {
    display: flex;
    margin-bottom: 16px;
    gap: 12px;
  }

  &__total-promokod-btn {
    background-color: var(--white);
    border-radius: $border;
    height: 56px;
    padding: 0 24px;
    color: rgb(0, 204, 45);
    font-weight: 500;
    font-size: 16px;
    &:disabled {
      filter: brightness(0.8);
      cursor: default;
    }
  }

  &__total-box {
    background-color: var(--white);
    border-radius: $border;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__total-left {
    display: flex;
    flex-direction: column;
  }

  &__total-text {
    margin-bottom: 8px;
    color: rgb(104, 104, 112);
    font-size: 14px;
  }

  &__total-btn {
    background-color: rgb(0, 204, 45);
    border-radius: $border;
    height: 56px;
    padding: 0 24px;
    color: var(--white);
    font-size: 16px;
    font-weight: 500;
    &-box {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    &:disabled {
      background-color: rgb(197, 197, 197);
      cursor: default;
    }
  }

  &__total-warning {
    margin-top: 12px;
    color: rgb(255, 102, 51);
    font-size: 16px;
  }
  &__total-price {
    color: var(--grey-dark);
    font-size: 32px;
    font-weight: 700;
    line-height: 80%;
    span {
      color: var(--grey-text);
      font-size: 21px;
      font-weight: 700;
      margin-left: 8px;
    }
  }
  &__total-novalid {
    margin-bottom: 12px;
    color: rgb(244, 72, 55);
    font-size: 16px;
  }
}
.order {
  &__total-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__total-item {
    background-color: var(--white);
    border-radius: 24px;
    padding: 12px 34px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  &__total-list-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__total-imgwrapper {
    height: 87px;
    width: 107px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__total-img {
    object-fit: cover;
  }

  &__total-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }

  &__total-list-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.3;
    color: var(--grey-dark);
  }

  &__total-list-weight {
    color: rgb(255, 102, 51);
    font-size: 14px;
    font-weight: 500;
  }

  &__total-list-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__total-count {
    font-size: 16px;
    font-weight: 500;
    color: rgb(158, 158, 158);
  }

  &__total-free {
    color: rgb(0, 204, 45);
    font-size: 18px;
    font-weight: 500;
  }

  &__total-list-btn {
    width: 32px;
    height: 32px;
    background-color: rgb(204, 245, 213);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 0;
    transform: translateX(-50%);
  }
}
</style>

<style lang="scss">
.order {
  &__person-inputs {
    display: flex;
    gap: 12px;
  }
  // inputs
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
  &__delivery {
    .el-button {
      line-height: 1.5;
      height: auto;
      cursor: pointer;
      color: rgb(255, 102, 51);
      transition: $transition;
      font-weight: 500;
      background-color: transparent;
      border: none;
      border-color: none;
      padding: 0;
      font-size: 16px;
      border-radius: 0;
      span {
        display: flex;
        gap: 13px;
      }
    }
  }

  .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
    > .el-form-item__label:before {
    content: "*";
    color: var(--el-color-danger);
    margin-right: 0;
    margin-left: 5px;
    order: 1;
  }
  .el-autocomplete {
    width: 100%;
  }
  // select
  .el-select__wrapper.is-hovering:not(.is-focused) {
    box-shadow: none;
  }
  .el-select__wrapper {
    font-size: 16px;
    padding: 12px 16px;
    gap: 6px;
    min-height: 48px;
    line-height: inherit;
    border-radius: $border;
    background-color: var(--grey-light);
    box-shadow: none;
  }
  .el-select__suffix {
    i {
      svg {
        display: none;
      }
      &::before {
        content: url("@/img/icon/arrow-down-mini.svg");
        height: 20px;
      }
    }
  }
  .el-select__placeholder {
    color: var(--grey-dark);
    font-size: 16px;
  }
}
.order-select {
  &.el-popper.is-light {
    background: var(--white);
    border: 1px solid #bdbdbd;
  }
  &.el-select-dropdown {
    border-radius: $border;
    overflow: hidden;
  }
  &.el-select__popper.el-popper {
    box-shadow: none;
  }
  .el-select-dropdown__list {
    padding: 0;
  }
  .el-select-dropdown__item.is-selected {
    color: var(--grey-dark);
    font-weight: 700;
  }
  .el-select-dropdown__item.is-hovering {
    background-color: #a1cafa88;
  }
  .el-select-dropdown__item {
    font-size: 16px;
    padding: 5px 10px;
    color: var(--grey-dark);
    height: auto;
    line-height: 1.5;
  }
}
// textarea
.el-textarea__inner {
  padding: 12px 16px;
  line-height: 1.5;
  color: var(--grey-dark);
  background-color: var(--grey-light);
  box-shadow: none;
  border-radius: $border;
  font-size: 16px;
  height: 100%;
}
.el-textarea__inner:hover {
  box-shadow: none;
}
.el-textarea {
  --el-input-placeholder-color: #8f8f8f;
}

// корзина
.order-right {
  .basket__item {
    background-color: var(--white);
    padding: 12px 34px;
    height: 111px;
    border-radius: 24px;
  }
  .basket-remove {
    border-radius: 8px;
    background: var(--grey-light);
    width: 32px;
    height: 32px;
    svg {
      width: 20px;
      height: 20px;
    }
    &:hover {
      background-color: rgb(255, 102, 51);
    }
  }
  .basket__left {
    gap: 16px;
    align-items: center;
    height: 100%;
  }
  .basket__imgwrapper {
    height: auto;
    width: 107px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .basket__item-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 4px;
    line-height: 1.45;
  }
  .basket__weight {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.5;
  }
  .basket__right {
    gap: 34px;
  }
  .basket__btn {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: var(--grey-light);
  }
  .basket-count {
    font-size: 14px;
  }
}

.order__total {
  .el-input {
    height: 56px;
    width: 214px;
    background: var(--white);
    border-radius: 12px;
    color: #1d1d1f;
    font-weight: 400;
  }
  .el-input__wrapper {
    padding: 12px 24px;
  }
  .el-input {
    --el-input-placeholder-color: rgb(158, 158, 158);
  }
  .el-input__inner {
    font-size: 18px;
    font-weight: 400;
  }
  .el-form-item {
    flex-grow: 0;
  }
  .el-form-item__content {
    flex-direction: column;
    justify-content: flex-end;
  }
}
.el-scrollbar {
  overflow: hidden;
  position: relative;
  height: auto;
}

// dialog
.el-dialog {
  margin: auto;
  background: var(--white);
  border-radius: $border;
  box-shadow: none;
  width: 1100px;
  padding: 32px;
}
.el-dialog__header {
  padding: 0;
  padding-bottom: 0;
  margin-right: 0;
  margin-bottom: 12px;
  height: min-content;
  span {
    font-size: 32px;
    font-weight: 700;
    color: var(--grey-dark);
    line-height: 1.3;
    display: block;
  }
}
.el-dialog__headerbtn {
  position: absolute;
  top: 32px;
  right: 32px;
  padding: 0;
  width: 32px;
  height: 32px;
  background: var(--grey-light);
  cursor: pointer;
  font-size: 0;
  border-radius: 8px;
  &::after {
    content: url("@/img/icon/close.svg");
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.el-dialog__body {
  padding: 0;
  color: inherit;
  font-size: inherit;
}

// tooltip
.el-popper[role="tooltip"] {
  color: var(--grey-text);
  background: var(--grey-light);
  border: 1px solid var(--grey-text);
  padding: 10px;
  max-width: 200px;
}
// стрелка
.el-popper[role="tooltip"].el-popper .el-popper__arrow::before {
  border: 1px solid var(--grey-text);
  background: var(--grey-light);
  width: 10px;
  height: 10px;
}
</style>
