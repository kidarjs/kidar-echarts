import { defineConfig } from '../index'
import * as echarts from 'echarts'
import { Lines3DChart } from 'echarts-gl/charts'
import { GlobeComponent, Geo3DComponent } from 'echarts-gl/components'
import { setTitle } from '../utils/common'

echarts.use([Lines3DChart, GlobeComponent, Geo3DComponent])

const worldPic = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/world.topo.bathy.200401.jpg'
const evnPic = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/starfield.jpg'
// const evnPic = 'http://localhost:3000/src/geojson/20181009153310351.png'

export default defineConfig({
  name: 'earth',
  resetOption(cols, data, ctx) {
    // const title = setTitle(ctx)
    const option = {
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
