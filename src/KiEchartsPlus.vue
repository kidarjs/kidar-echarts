<template>
  <div ref="EchartsEl"></div>
</template>
<script>
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'

import pie from './plugins/pie'

const LAZY_LOAD_PLUGINS = import.meta.glob('./plugins/*.ts')

export default {
  name: 'KiEchartsPlus',
  props: {
    isDynamic: { type: Boolean, default: false },
    omit: { type: Number, default: 0 },
    rotate: { type: Number, default: 0 },
    zoomNum: { type: Number, default: 7 },
    type: { type: String, default: 'pie' },
    cols: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    theme: { type: [String, Object] },
    locale: { type: String, default: 'zh-cn' },
    renderer: { type: String, default: 'canvas' },
    useDirtyRect: { type: Boolean, default: false },
    devicePixelRatio: { type: Number, default: window.devicePixelRatio },
  },
  data () {
    return {
      chart: null
    }
  },
  computed: {
    opts: function () {
      return {
        locale: this.locale,
        renderer: this.rendererType,
        devicePixelRatio: this.devicePixelRatio,
        useDirtyRect: this.useDirtyRect
      }
    }
  },
  plugins: {
    pie: pie
  },
  watch: {
    opts: function () {
      this.chart && this.chart.dispose()
      this.init()
    },
    theme: function () {
      this.chart && this.chart.dispose()
      this.init()
    },
    type: function () {
      this.resetOption()
    },
    data: {
      handler: function () {
        this.resetOption()
      },
      deep: true
    }
  },
  mounted () {
    this.$refs.EchartsEl ? this.init() : this.$nextTick(() => this.init())
  },
  beforeDestroy () {
    this.chart && removeListenElResize(this.$refs.EchartsEl)
    this.chart.dispose()
  },
  methods: {
    init () {
      this.chart = echarts.init(this.$refs.EchartsEl, this.theme, this.opts)
      listenElResize(this.$refs.EchartsEl, () => {
        this.resetOption()
        this.chart.resize()
      })
      this.resetOption()
    },
    async resetOption () {
      if (!this.chart) return
      let plugin = this.$options.plugins[this.type]
      if (!plugin) {
        try {
          let importPlugin = await LAZY_LOAD_PLUGINS[`./plugins/${this.type}.ts`]()
          plugin = this.$options.plugins[this.type] = importPlugin.default.default || importPlugin.default || importPlugin
        } catch (error) {
          throw new Error(`未找到【${this.type}】类型, 目前KiEchartsPlus仅支持
          （pie、line、bar、dybar、multi-line-bar-x）
          若没有满意的类型，可自定义类型plugin，并使用KiEchartsPlus.use(plugin)添加自定义类型。
          自定义类型可参考技术文档：https://github.com
          ：${error}`)
        }
      }
      const option = plugin.resetOption(this.cols, this.data, this)
      !plugin.isDynamic && this.chart.clear()
      this.chart.setOption(option)
    }
  }
}
</script>
