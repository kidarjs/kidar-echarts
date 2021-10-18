<template>
  <div ref="EchartsEl"></div>
</template>
<script>
import * as echarts from 'echarts'
import { removeListenElResize, listenElResize } from 'nkxrb-tools'
import { mergeDeepRight } from 'ramda'

import pie from './plugins/pie'
import line from './plugins/line'

export default {
  name: 'KiEchartsPlus',
  props: {
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
    pie: pie,
    line: line
  },
  watch: {
    type: {
      handler: function (val) {
        if (this.$options.plugins[val]) {
          this.resetOption()
        } else {
          throw new Error(`未找到【${val}】类型：${error}`)
        }
      },
      immediate: true
    },
    data: function () {
      this.resetOption()
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
    resetOption () {
      const option = this.$options.plugins[this.type].resetOption(this.cols, this.data)
      this.chart.clear()
      this.chart.setOption(mergeDeepRight(option, this.option))
    }
  }
}
</script>
