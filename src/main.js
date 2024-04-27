import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import directives from "@/directives";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
import components from "@/components/UI";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueTheMask from "vue-the-mask";
import * as turf from "@turf/turf";

import Home from "@/pages/Home.vue";
import Favorites from "@/pages/Favorites.vue";
import History from "@/pages/History.vue";
import CategoryPage from "@/pages/CategoryPage.vue";
import Product from "@/pages/Product.vue";
import Address from "@/pages/Address.vue";
import AddressMap from "@/pages/AddressMap.vue";
import OrderPlacing from "./pages/OrderPlacing.vue";
import OrderSuccess from "./pages/OrderSuccess.vue";
import CancelOrder from "./pages/CancelOrder.vue";
import Profile from "@/pages/Profile.vue";
import UserHome from "@/pages/UserHome.vue";
import Error404 from "@/pages/Error404.vue";

const app = createApp(App);

const routes = [
  { path: "/rol-shop/", name: "Home", component: Home },
  { path: "/rol-shop/map", name: "Map", component: AddressMap },
  { path: "/rol-shop/:category", name: "Category", component: CategoryPage },
  { path: "/rol-shop/:category/:id", name: "Product", component: Product },
  { path: "/rol-shop/order", name: "Order", component: OrderPlacing },
  { path: "/rol-shop/success", name: "OrderSuccess", component: OrderSuccess },
  { path: "/rol-shop/cancel", name: "CancelOrder", component: CancelOrder },
  { path: "/rol-shop/404", name: "Error404", component: Error404},
  {
    path: "/rol-shop/profile",
    name: "Profile",
    component: Profile,
    children: [
      { path: "favorites", name: "Favorites", component: Favorites },
      { path: "history", name: "History", component: History },
      { path: "address", name: "Address", component: Address },
      {path: '', name: 'UserHome', component: UserHome}
    ],
  },
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

components.forEach((component) => {
  app.component(component.name, component);
});

directives.forEach((directive) => {
  app.directive(directive.name, directive);
});

const ChoicesPlugin = {
  install(app) {
    app.config.globalProperties.$Choices = Choices;
  },
};


app
  .use(autoAnimatePlugin)
  .use(router)
  .use(store)
  .use(ChoicesPlugin)
  .use(ElementPlus)
  .use(VueTheMask)
  .mount("#app");

import "./index.scss";
