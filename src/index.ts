import { computed, defineComponent, h, install, nextTick, onMounted, PropType, ref, toRefs, watch, onUnmounted, App, watchEffect } from 'vue-demi'
import { EchartsPlugin, Column, BaseData, KidarEchartsContext } from 'kidar-echarts-plugins/helper'
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'

install()

declare type rendererType = 'canvas' | 'svg'
const __DEV__ = process.env.NODE_ENV === 'development'
const PLUGINS: Map<string, EchartsPlugin> = new Map()

const KidarEcharts = defineComponent({
  template: `<div ref="KidarEchartsEl"></div>`,
  props: {
    extra: { type: Object },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    tooltip: { type: Function },
    click: { type: Function },
    label: { type: Function },
    type: { type: String, require: true },
    cols: { type: Array as PropType<Column[]>, default: () => [] },
    data: { type: Array as PropType<BaseData[]>, default: () => [] },
    theme: { type: [String, Object] as PropType<string | Object> },
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
      chart = echarts.getInstanceByDom(KidarEchartsEl.value) || echarts.init(KidarEchartsEl.value, theme ? theme.value : '', opts.value)

      listenElResize(KidarEchartsEl.value, () => {
        resetOption()
        chart && chart.resize()
      })
      resetOption()
    }

    onUnmounted(() => {
      removeListenElResize(KidarEchartsEl.value)
      chart?.dispose()
    })
    onMounted(() => {
      KidarEchartsEl.value ? init() : nextTick(() => init())
    })

    const resetOption = () => {
      if (!chart || !type.value) return

      if (!PLUGINS.has(type.value)) {
        if (__DEV__) {
          throw new Error(`there is not exist ${type.value} plugin, you can try [ npm i kidar-echarts-plugins or custom plugins ]。
            yon can see：https://github.com/kidarjs/kidar-echarts
          `)
        }
        return
      }
      chart.setOption({}, false) // 用于初始化option，确保chart.getOption可以拿到默认配置
      const option = PLUGINS.get(type.value)?.resetOption(props.cols || [], data.value, { ...props, chart, init })

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

    watchEffect(() => {
      if (props.click) {
        chart?.on('click', p => props.click!(p))
      }
    })

    watch([theme], () => {
      chart?.dispose()
      init()
    })

    return {
      KidarEchartsEl
    }
  },
  render: () => h('div', { style: 'overflow:hidden !important;' }, [
    h('div', { ref: 'KidarEchartsEl', style: 'height: 100%; width: 100%;' })
  ])
})

const addKidarEchartsPlugin = (pluginName: string, plugin: EchartsPlugin) => {
  if (PLUGINS.has(pluginName)) {
    __DEV__ && console.warn(`pluginName is exist 【${pluginName}】 该插件名已存在, 重复注册将覆盖已有的插件！`)
  }
  PLUGINS.set(pluginName, plugin)
}

const installKidarEcharts = (app: App) => {
  app.component('KidarEcharts', KidarEcharts)
}


export { KidarEcharts, addKidarEchartsPlugin, installKidarEcharts as install }
