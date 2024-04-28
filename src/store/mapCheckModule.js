import axios from "axios";
import * as turf from "@turf/turf";

export const mapCheckModule = {
  state: () => ({
    deliveryPossible: false,
    polygonCoord1: [
      [30.525609135265174, 50.41581452769492],
      [30.526797353858758, 50.41704674162194],
      [30.526598870391656, 50.41866108161345],
      [30.52590149604774, 50.41975098688669],
      [30.522425353164497, 50.421245281434295],
      [30.520730197067063, 50.420923121020905],
      [30.519861161346252, 50.42113218281552],
      [30.518546878928944, 50.421085915120884],
      [30.516867816085664, 50.4219307217831],
      [30.516213357085984, 50.42147833226991],
      [30.514341175193604, 50.42149889552497],
      [30.514306306476406, 50.42091969376908],
      [30.513816803331178, 50.42012285131241],
      [30.514151408905786, 50.419628459485686],
      [30.514855153496086, 50.419490937093364],
      [30.511780252317603, 50.41692709917943],
      [30.511058193268894, 50.416591145423126],
      [30.513336457415182, 50.415518278488875],
      [30.512651687358204, 50.41437855989807],
      [30.514337052344967, 50.412067352083284],
      [30.517937897914575, 50.4115187660733],
      [30.521717249984505, 50.411127021711366],
      [30.524810301794076, 50.41173932782978],
      [30.52592295371987, 50.413128909469826],
      [30.525609135265174, 50.41581452769492],
    ],
    polygonCoord2: [
      [30.5098794981063, 50.42628119920888],
      [30.51226666412955, 50.42715846727746],
      [30.515678433996502, 50.427624509288435],
      [30.519663852782916, 50.42687216158533],
      [30.521460589013188, 50.4251054368052],
      [30.523487651409056, 50.42316198375982],
      [30.522434850236454, 50.421248960895035],
      [30.520720293229566, 50.420928888987],
      [30.519875737450686, 50.42112499152181],
      [30.51855433089325, 50.421092218566464],
      [30.516854434264705, 50.421924601598306],
      [30.516223597234163, 50.42147820963046],
      [30.514348058325066, 50.421503913674094],
      [30.514144210439984, 50.421891186574015],
      [30.5143856092513, 50.42240012001261],
      [30.513015000444693, 50.422764252515826],
      [30.510881303173356, 50.42282294184412],
      [30.50966711301253, 50.42317672311909],
      [30.509595183950726, 50.42445807423617],
      [30.5098794981063, 50.42628119920888],
    ],
    polygonCoord3: [
      [30.53565310831554, 50.42189449360963],
      [30.5346124950368, 50.42341715413044],
      [30.532402522446606, 50.42341918895238],
      [30.53107248205133, 50.42301200861088],
      [30.531845628799886, 50.422115385518396],
      [30.530302017511836, 50.42210424723551],
      [30.529532223524566, 50.422356143130784],
      [30.529237180532984, 50.42143423186331],
      [30.527660041632206, 50.42115319955797],
      [30.52844324666457, 50.42007703597716],
      [30.528512984098914, 50.41931959400213],
      [30.52893409091424, 50.41809086697714],
      [30.52965962845278, 50.41718858049145],
      [30.529550328435437, 50.416257570671156],
      [30.52876611757469, 50.4151750826024],
      [30.535583789976325, 50.415936340165416],
      [30.53519461821206, 50.41676940341607],
      [30.536759561443716, 50.4170076980345],
      [30.540460276467726, 50.41663327851576],
      [30.54059901792002, 50.417931489990465],
      [30.540084033789153, 50.42026211044566],
      [30.53836742001964, 50.42146850397636],
      [30.537101417364596, 50.42168784493982],
      [30.53565310831554, 50.42189449360963],
    ],
    coord: [30.523745, 50.418901],
    deliveryCheck: false,
    address: "",
    loading: false,
    loadingAddress: false,
    arrayCoord: []
  }),
  mutations: {
    setDeliveryPossible(state, deliveryPossible) {
      state.deliveryPossible = deliveryPossible;
    },
    setDeliveryCheck(state, deliveryCheck) {
      state.deliveryCheck = deliveryCheck;
    },
    setAddress(state, address) {
      state.address = address;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setLoadingAddress(state, loadingAddress) {
      state.loadingAddress = loadingAddress;
    },
    setArrayCoord(state, arrayCoord) {
      state.arrayCoord = arrayCoord;
    }
  },
  actions: {
    async checkAddress({ state, commit }, { lat, long }) {
      try {
        commit("setDeliveryCheck", true);
        commit("setLoading", true);

        var polygon1 = turf.polygon([state.polygonCoord1]);
        var polygon2 = turf.polygon([state.polygonCoord2]);
        var polygon3 = turf.polygon([state.polygonCoord3]);

        // Создаем точки
        var points = turf.points([[lat, long]]);

        // Проверяем точки внутри полигона
        var pointsWithin1 = turf.pointsWithinPolygon(points, polygon1);
        var pointsWithin2 = turf.pointsWithinPolygon(points, polygon2);
        var pointsWithin3 = turf.pointsWithinPolygon(points, polygon3);

        if (
          pointsWithin1.features.length > 0 ||
          pointsWithin2.features.length > 0
        ) {
          commit("setDeliveryPossible", true);
        } else {
          commit("setDeliveryPossible", false);
        }

        const { data } = await axios.get(
          `https://geocode-maps.yandex.ru/1.x/?apikey=37720b8b-dc03-4346-b6a4-3ae3458e9af6&geocode=${lat},${long}&format=json&lang=ru_RU`
        );

        const path =
          data.response.GeoObjectCollection.featureMember[0].GeoObject
            .metaDataProperty.GeocoderMetaData;
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
        commit("setAddress", names);
      } catch (err) {
        console.log(err);
      } finally {
        commit("setLoading", false);
      }
    },
    async geocoderAddress({ state, commit }, item) {
      try {
        commit('setLoadingAddress', true);

        const { data } = await axios.get(
          `https://geocode-maps.yandex.ru/1.x/?apikey=37720b8b-dc03-4346-b6a4-3ae3458e9af6&geocode=${item}&format=json&lang=ru_RU`
        );

        const address =
          data.response.GeoObjectCollection.featureMember[0].GeoObject.Point
            .pos;

        commit('setArrayCoord', address.split(" "));
      } catch (err) {
        console.log(err);
      } finally {
        commit('setLoadingAddress', false);
      }
    },
  },
  namespaced: true,
};
