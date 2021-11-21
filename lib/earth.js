import { defineConfig } from "./kidar-echarts.es.js";
import * as echarts from "echarts";
import { Lines3DChart } from "echarts-gl/charts";
import { GlobeComponent, Geo3DComponent } from "echarts-gl/components";
import "vue-demi";
echarts.use([Lines3DChart, GlobeComponent, Geo3DComponent]);
const worldPic = "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/world.topo.bathy.200401.jpg";
const evnPic = "http://localhost:3000/src/geojson/20181009153310351.png";
var earth = defineConfig({
  name: "earth",
  resetOption(cols, data, ctx) {
    const option = {
      backgroundColor: "#000",
      globe: {
        baseTexture: worldPic,
        displacementScale: 0.04,
        shading: "realistic",
        environment: evnPic,
        realisticMaterial: {
          roughness: 1
        },
        postEffect: {
          enable: true
        },
        light: {
          main: {
            intensity: 5,
            shadow: true
          },
          ambientCubemap: {
            diffuseIntensity: 0.2
          }
        }
      }
    };
    return option;
  }
});
export { earth as default };
