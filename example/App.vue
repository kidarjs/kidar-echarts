<template>
  <div :style="`text-align: center;`">
    <h3 class="title">kidar-echarts</h3>
    <div class="tools-bar">
      <button @click="switchTheme">切换暗色主题</button>
      <button @click="switchType('pie')">pie</button>
      <button @click="switchType('ring')">ring</button>
      <button @click="switchType('line')">line</button>
      <button @click="switchType('arealine')">arealine</button>
      <button @click="switchType('line-bar-x')">line-bar-x</button>
      <button @click="switchType('dybar')">dybar（动态排序）</button>
      <button @click="switchType('treemap')">treemap</button>
      <button @click="switchType('graph')">graph</button>
      <button @click="switchType('map')">Map</button>
      <button @click="switchType('map3d')">Map3D</button>
      <button @click="switchType('earth')">地球3D</button>
      <button @click="switchType('custom')">custom</button>
    </div>
    <kidar-echarts :type="type" :data="data" :cols="cols" :theme="theme" class="echarts-block" @click="drill" />
  </div>
</template>

<script>
import Mock from "mockjs";
import { KidarEcharts, addKidarEchartsPlugin } from "@/index";
import custom from './custom-plugin'
addKidarEchartsPlugin(custom)
export default {
  components: { KidarEcharts },
  data () {
    return {
      type: 'pie',
      data: [],
      color: '#ffffff',
      cols: [],
      theme: 'dark',
      isDynamic: false,
      setIntervalId: null
    };
  },
  mounted () {
    let type = sessionStorage.getItem('KIDAR_INITPARAMS_TYPE') || 'pie'
    this.switchType(type)
  },
  methods: {
    drill (params) {
      console.log(params)
    },
    switchTheme () {
      this.color = this.theme ? '#ffffff' : '#100c2a'
      this.theme = this.theme ? '' : 'dark'
    },
    loadData (len = 30) {
      let res = Mock.mock({
        [`data|${len}`]: [
          {
            name: "@province",
            value: "@natural(1600, 59600)",
            va: "@natural(2100, 19040)",
            vb: "@natural(1700, 5466)",
            ratio: function () {
              return Number.prototype.toFixed.call(this.va / (this.va + this.vb) * 100, 2)
            }
          }
        ]
      }).data
      const nameSet = new Set()
      this.data = res.filter(t => !nameSet.has(t.name) && nameSet.add(t.name))
    },
    dynamicLoadData () {
      this.loadData(30)
      this.setIntervalId = setInterval(() => {
        this.data.forEach(item => {
          item.value += Mock.mock('@natural(60, 10000)')
        })
      }, 1000);
    },
    switchType (type) {
      this.isDynamic = false
      this.cols = []
      this.setIntervalId && !this.isDynamic && clearInterval(this.setIntervalId)
      this.type = type;
      this.cols = [
        { name: '2021', prop: 'vb', color: '#1890ff', type: 'bar', stack: 'year' },
        { name: '2020', prop: 'va', color: '#ff90ff', type: 'bar', stack: 'year' },
        { name: '比例', prop: 'ratio', color: '#44ff99', type: 'line', y1: true }
      ]
      switch (type) {
        case 'dybar':
          this.isDynamic = true
          this.dynamicLoadData()
          break
        case 'multi-line-bar-x':
          this.loadData()
          break
        default:
          if (!this.data || this.data.length === 0) {
            this.loadData()
          }
          break
      }
      sessionStorage.setItem('KIDAR_INITPARAMS_TYPE', this.type)

    },
  },
};
</script>

<style scoped>
  .tools-bar button {
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif, "微软雅黑";
    margin: 12px 12px 0;
    cursor: pointer;
  }
  .echarts-block {
    font-family: Algerian;
    width: 60%;
    height: 620px;
    margin: 15px auto;
  }
</style>