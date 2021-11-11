<template>
  <div ref="EchartsEl"></div>
</template>
<script>
import { ref, reactive, defineComponent } from 'vue-demi'
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'
import { debounce } from 'lodash-es'
import pie from './plugins/pie'

const LAZY_LOAD_PLUGINS = import.meta.glob('./plugins/*.ts')

export default defineComponent({
  name: 'KidarEcharts',
  props: {
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
      chart: null,
      chartId: 'echarts-transition-id',
      setOptionFn: undefined
    }
  },
  created () {
    this.setOptionFn = debounce(this.resetOption, 500)
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
      this.chart && this.beforeDestroy()
      this.init()
    },
    theme: function () {
      this.chart && this.beforeDestroy()
      this.init()
    },
    type: function () {
      this.setOptionFn()
    },
    data: {
      handler: function () {
        this.setOptionFn()
      },
      deep: true
    }
  },
  mounted () {
    this.$refs.EchartsEl ? this.init() : this.$nextTick(() => this.init())
  },
  beforeDestroy () {
    this.beforeDestroy()
  },
  methods: {
    beforeDestroy () {
      this.chart && removeListenElResize(this.$refs.EchartsEl)
      this.chart.dispose()
    },
    init () {
      this.chart = echarts.init(this.$refs.EchartsEl, this.theme, this.opts)

      this.chart.on('click', 'series', params => {
        this.$emit('click', params)
      })

      listenElResize(this.$refs.EchartsEl, () => {
        this.setOptionFn()
        this.chart.resize()
      })
      this.setOptionFn()
    },
    async resetOption () {
      if (!this.chart) return
      let plugin = this.$options.plugins[this.type]
      if (!plugin) {
        try {
          let importPlugin = await LAZY_LOAD_PLUGINS[`./plugins/${this.type}.ts`]()
          plugin = this.$options.plugins[this.type] = importPlugin.default.default || importPlugin.default || importPlugin
        } catch (error) {
          throw new Error(`未找到【${this.type}】类型, 目前KidarEcharts仅支持pie,line,bar,dybar,multi-line-bar-x
          若没有满意的类型，可自定义类型plugin，并使用KidarEcharts.use(plugin)添加自定义类型。
          自定义类型可参考技术文档：https://github.com/kidarjs/kidar-echarts
          ：${error}`)
        }
      }
      const option = plugin.resetOption(this.cols, this.data, this)

      try {
        option && this.chart.setOption(option, true)
      } catch (error) {
        if (error.message && error.message.indexOf('not be called during main process') > 0) {
          this.chart.dispose()
          this.chart.setOption(option, true)
        } else {
          throw new Error(error)
        }
      }
    }
  }
})
</script>
