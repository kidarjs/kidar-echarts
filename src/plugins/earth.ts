import { defineConfig } from '../index'
import * as echarts from 'echarts'
import { Lines3DChart } from 'echarts-gl/charts'
import { GlobeComponent, Geo3DComponent } from 'echarts-gl/components'

echarts.use([Lines3DChart, GlobeComponent, Geo3DComponent])

const worldPic = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/world.topo.bathy.200401.jpg'
const evnPic = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/starfield.jpg'

export default defineConfig({
  name: 'earth',
  resetOption(cols, data, ctx) {
    const option = {
      backgroundColor: '#000',
      globe: {
        baseTexture: worldPic,
        // heightTexture: worldPic,
        displacementScale: 0.04,
        shading: 'realistic',
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
            // texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
            diffuseIntensity: 0.2
          }
        }
      }
    }

    return option
  }
})
