import { createStore } from "vuex";
import {favoriteModule} from "@/store/favoriteModule";
import {mapCheckModule} from "@/store/mapCheckModule"; 
import {dateModule} from "@/store/dateModule";
import { orderModule } from "@/store/orderModule";
import {crumbsModule} from "@/store/crumbsModule";
import { themeModule } from "@/store/themeModule";

export default createStore({
  modules: {
    favorite: favoriteModule,
    map: mapCheckModule,
    date: dateModule,
    order: orderModule,
    crumbs: crumbsModule,
    theme: themeModule
  }
})