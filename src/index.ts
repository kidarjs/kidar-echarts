import { isVue2, computed, defineComponent, h, install, nextTick, onMounted, PropType, ref, toRefs, watch } from 'vue-demi'
import { EchartsPlugin, Column, BaseData, KidarEchartsContext } from '../types/index'
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'

install()

declare type rendererType = 'canvas' | 'svg'

const LAZY_LOAD_PLUGINS = import.meta.glob('./plugins/*.ts')
const PLUGINS: Map<string, EchartsPlugin> = new Map()

const KidarEcharts = defineComponent({
  template: `<div ref="KidarEchartsEl"></div>`,
  props: {
    omit: { type: Number, default: 0 },
    rotate: { type: Number, default: 0 },
    zoomNum: { type: Number, default: 7 },
    type: { type: String, default: 'pie' },
    cols: { type: Array as PropType<Column[]>, default: () => [] },
    data: { type: Array as PropType<BaseData[]>, default: () => [] },
    theme: { type: [String, Object] as PropType<string | object> },
    locale: { type: String, default: 'zh-cn' },
    renderer: { type: String as PropType<rendererType>, default: 'canvas' },
    useDirtyRect: { type: Boolean, default: false },
    devicePixelRatio: { type: Number, default: window.devicePixelRatio },
  },
  setup(props: KidarEchartsContext, { emit, attrs }: any) {
    const KidarEchartsEl = ref()
    const { theme, type, cols, data } = toRefs(props)
    let chart: echarts.ECharts | null = null
    const opts = computed(() => {
      return {
        locale: props.locale,
        renderer: props.renderer,
        devicePixelRatio: props.devicePixelRatio,
        useDirtyRect: props.useDirtyRect
      }
    })
    const init = () => {
      console.log(KidarEchartsEl.value)
      chart = echarts.init(KidarEchartsEl.value, theme?.value, opts.value)
      chart.on('click', 'series', params => {
        emit('click', params)
      })

      listenElResize(KidarEchartsEl.value, () => {
        resetOption()
        chart && chart.resize()
      })
    }
    onMounted(() => {
      KidarEchartsEl.value ? init() : nextTick(() => init())
    })

    const resetOption = async () => {
      if (!chart) return

      if (PLUGINS.has(type.value)) {
        try {
          let importPlugin = await LAZY_LOAD_PLUGINS[`./plugins/${type.value}.ts`]()
          PLUGINS.set(type.value, importPlugin.default.default || importPlugin.default || importPlugin)
        } catch (error) {
          throw new Error(`未找到【${type.value}】类型, 目前KidarEcharts仅支持pie,line,bar,dybar,multi-line-bar-x
          若没有满意的类型，可自定义类型plugin，并使用KidarEcharts.use(plugin)添加自定义类型。
          自定义类型可参考技术文档：https://github.com/kidarjs/kidar-echarts
          ：${error}`)
        }
      }
      const option = PLUGINS.get(type.value)?.resetOption(cols.value, data.value, { ...props, chart })

      try {
        option && chart.setOption(option, true)
      } catch (error: any) {
        if (error.message && error.message.indexOf('not be called during main process') > 0) {
          chart.dispose()
          option && chart.setOption(option, true)
        } else {
          throw new Error(error)
        }
      }
    }

    watch([type, cols, data], resetOption, { deep: true })

    resetOption()

    return {
      KidarEchartsEl
    }
  }
})

export function defineConfig(config: EchartsPlugin) {
  return config
}

KidarEcharts.addPlugin = (plugin: EchartsPlugin) => {
  if (PLUGINS.has(plugin.name)) {
    throw Error(`pluginName is exist ${plugin.name} 该插件名已存在`)
  }
  PLUGINS.set(plugin.name, plugin)
  return KidarEcharts
}


export { KidarEcharts }
