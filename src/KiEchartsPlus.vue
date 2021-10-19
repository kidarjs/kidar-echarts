<template>
  <div ref="EchartsEl"></div>
</template>
<script>
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'
import { mergeDeepRight } from 'ramda'

import pie from './plugins/pie'

const plugins = import.meta.glob('./plugins/*.ts')

export default {
  name: 'KiEchartsPlus',
  props: {
    isDynamic: { type: Boolean, default: false },
    type: { type: String, default: 'pie' },
    option: { type: Object, default: () => ({}) },
    cols: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] }
  },
  data () {
    return {
      chart: null
    }
  },
  plugins: {
    pie: pie
  },
  watch: {
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
    this.$nextTick(() => this.init())
  },
  beforeDestroy () {
    this.chart && removeListenElResize(this.$refs.EchartsEl) && this.chart.dispose()
  },
  methods: {
    init () {
      this.chart = echarts.init(this.$refs.EchartsEl)
      listenElResize(this.$refs.EchartsEl, () => this.chart.resize())
      this.resetOption()
    },
    async resetOption () {
      let option = {}
      if (!this.$options.plugins[this.type]) {
        try {
          const plugin = await plugins[`./plugins/${this.type}.ts`]()
          this.$options.plugins[this.type] = plugin.default.default || plugin.default || plugin
        } catch (error) {
          throw new Error(`未找到【${this.type}】类型：${error}`)
        }
      }
      option = this.$options.plugins[this.type].resetOption(this.cols, this.data)
      console.log(this.isDynamic)
      !this.isDynamic && this.chart.clear()
      this.chart.setOption(mergeDeepRight(option, this.option))
    }
  }
}
</script>
