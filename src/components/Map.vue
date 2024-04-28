<template>
  <div id="map"></div>
</template>

<script>
import { ref, inject, computed } from "vue";
import axios from "axios";
import { useStore, mapState } from "vuex";
import { prop } from "vue-class-component";
import * as turf from "@turf/turf";

export default {
  props: {
    geocoderCoord: Function,
    newMarker: Array,
  },
  mounted() {

    this.initMap();
  },
  methods: {},
  setup(props) {
    const store = useStore();
    // из store vuex
    const polygonCoord1 = store.state.map.polygonCoord1;
    const polygonCoord2 = store.state.map.polygonCoord2;
    const polygonCoord3 = store.state.map.polygonCoord3;
    var coord = store.state.map.coord;
    var arrayCoord = computed(() => store.state.map.arrayCoord);
    var theme = computed(() => store.state.theme.theme);

    const zoom = ref(16);
    let map, marker;

    const initMap = async () => {
      await ymaps3.ready;
      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
        YMapFeature,
        YMapListener,
        YMapControls,
        YMapControlButton,
      } = ymaps3;
      map = new YMap(document.getElementById("map"), {
        location: {
          center: coord,
          zoom: zoom.value,
        },
      });

      // стили
      const layer = new YMapDefaultSchemeLayer({
        theme: theme.value ? "dark" : "light",
        customization: [
          {
            tags: {
              any: ["traffic_light"],
            },
            stylers: {
              visibility: "off",
            },
          },
          {
            tags: {
              any: ["entrance"],
            },
            stylers: {
              visibility: "off",
            },
          },
          {
            tags: {
              any: ["road"],
              none: [
                "road_1",
                "road_2",
                "road_3",
                "road_4",
                "road_5",
                "road_6",
                "road_7",
              ],
            },
            elements: "label.icon",
            stylers: {
              visibility: "off",
            },
          },
          {
            tags: {
              any: ["building", "address", "fence"],
            },
            stylers: {
              visibility: "off",
            },
          },
          {
            tags: {
              any: ["transit"],
            },
            stylers: {
              visibility: "off",
            },
          },
        ],
      });
      map.addChild(layer);
      map.addChild(new YMapDefaultFeaturesLayer());

      // маркер
      const markerElement = document.createElement("div");
      markerElement.className = "icon-marker";
      marker = new YMapMarker({ coordinates: coord }, markerElement);
      map.addChild(marker);

      // маркер точки выдачи
      if (props.newMarker && props.newMarker.length > 0) {
        const markerElementDest = document.createElement("div");
        markerElementDest.className = "icon-marker";
        let markerDest = new YMapMarker(
          { coordinates: props.newMarker },
          markerElementDest
        );
        map.addChild(markerDest);

        // центр между точками
        var point1 = turf.point(coord);
        var point2 = turf.point(props.newMarker);
        var midpoint = turf.midpoint(point1, point2);

        // расстояние между точками
        var distance = turf.distance(point1, point2);

        // перемещение к центру
        map.update({
          location: {
            ...{
              center: midpoint.geometry.coordinates,
              zoom: calculateZoomLevel(distance),
            },
            duration: 1000,
          },
          tilt: Math.PI / 180,
        });
      }

      // полигоны
      const polygon1 = new YMapFeature({
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoord1],
        },
        style: {
          stroke: [{ color: "#ffc700", width: 2 }],
          fill: "#ffc80059",
        },
      });
      const polygon2 = new YMapFeature({
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoord2],
        },
        style: {
          stroke: [{ color: "#55b20b", width: 2 }],
          fill: "#56b20b50",
        },
      });
      const polygon3 = new YMapFeature({
        geometry: {
          type: "Polygon",
          coordinates: [polygonCoord3],
        },
        style: {
          stroke: [{ color: "#f44837", width: 2 }],
          fill: "#f4473752",
        },
      });
      map.addChild(polygon1);
      map.addChild(polygon2);
      map.addChild(polygon3);

      // обработка клика / перемещение по карте по клику
      function changeMapPosition(location, camera) {
        map.update({ location: { ...location, duration: 1000 }, camera });
      }
      const click = (object, event) => {
        changeMapPosition(
          {
            center: [event.coordinates[0], event.coordinates[1]],
            zoom: zoom.value,
          },
          { tilt: Math.PI / 180 }
        );
        coord = [event.coordinates[0], event.coordinates[1]];
        marker.update({ coordinates: coord });
        // геокодер
        props.geocoderCoord(event.coordinates[0], event.coordinates[1]);
      };
      const mapListener = new YMapListener({
        onClick: click,
      });
      map.addChild(mapListener);
    };

    const moveMap = (item) => {
      // преобразование адреса в координаты
      store.dispatch("map/geocoderAddress", item).then(() => {
        // перемещение по карте
        map.update({
          location: {
            ...{
              center: [arrayCoord.value[0], arrayCoord.value[1]],
              zoom: zoom.value,
            },
            duration: 1000,
          },
          tilt: Math.PI / 180,
        });
        coord = [arrayCoord.value[0], arrayCoord.value[1]];
        marker.update({ coordinates: coord });
      });
    };

    const calculateZoomLevel = (distance) => {
      const earthRadius = 6371; // Радиус Земли
      const pixelWidth = 1.1; // Ширина тайла карты в пикселях
      const zoom = Math.round(
        Math.log2((earthRadius * 2 * Math.PI) / (distance * pixelWidth))
      );

      return zoom;
    };

    return {
      initMap,
      map,
      marker,
      coord,
      zoom,
      moveMap,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
