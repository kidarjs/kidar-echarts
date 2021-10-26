<template>
  <div style="text-align: center;">
    <h3 class="title">Kidar-vue-echarts</h3>
    <div class="tools-bar">
      <button @click="switchTheme">切换暗色主题</button>
      <button @click="switchType('pie')">pie</button>
      <button @click="switchType('line')">line</button>
      <button @click="switchType('multi-line-bar-x')">multi-line-bar-x</button>
      <button @click="switchType('dybar')">dybar（动态排序）</button>
      <button @click="switchType('map')">Map</button>
    </div>
    <ki-echarts-plus :type="type" :data="data" :cols="cols" :is-dynamic="isDynamic" :theme="theme" class="echarts-block" />
  </div>
</template>

<script>
import Mock from "mockjs";
import { KiEchartsPlus } from "@/index";

export default {
  components: { KiEchartsPlus },
  data () {
    return {
      type: 'pie',
      data: [],
      cols: [],
      theme: '',
      isDynamic: false,
      setIntervalId: null
    };
  },
  mounted () {
    let type = sessionStorage.getItem('KIDAR_INITPARAMS_TYPE') || 'pie'
    this.switchType(type)
  },
  methods: {
    switchTheme () {
      this.theme = this.theme ? '' : 'dark'
    },
    loadData (len = 20) {
      this.data = Mock.mock({
        [`data|${len}`]: [
          {
            name: "@province",
            value: "@natural(160, 100000)",
            bar: "@natural(10, 1000)",
            line: "@natural(10, 1000)",
          }
        ]
      }).data;
    },
    dynamicLoadData () {
      this.setIntervalId = setInterval(() => {
        this.data.forEach(item => {
          item.value += Mock.mock('@natural(60, 10000)')
        })
      }, 3000);
    },
    switchType (type) {
      this.isDynamic = false
      this.cols = []
      this.setIntervalId && !this.isDynamic && clearInterval(this.setIntervalId)
      switch (type) {
        case 'dybar':
          this.isDynamic = true
          this.dynamicLoadData()
          break
        case 'multi-line-bar-x':
          this.cols = [
            { name: '折线', prop: 'line', color: '#1890ff', type: 'line' },
            { name: '柱子', prop: 'bar', color: '#ff90ff', type: 'bar' }
          ]
          this.loadData(200)
          break
        default:
          this.loadData()
          break
      }
      this.type = type;
      sessionStorage.setItem('KIDAR_INITPARAMS_TYPE', this.type)

    },
  },
};
</script>

<style scoped>
  .tools-bar button {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif, "微软雅黑";
    margin: 0 12px;
  }
  .echarts-block {
    font-family: Algerian;
    width: 60%;
    height: 420px;
    margin: 0 auto;
  }
</style>