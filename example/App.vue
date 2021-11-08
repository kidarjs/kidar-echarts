<template>
  <div style="text-align: center;">
    <h3 class="title">kidar-vue-echarts</h3>
    <div class="tools-bar">
      <button @click="switchTheme">切换暗色主题</button>
      <button @click="switchType('pie')">pie</button>
      <button @click="switchType('ring')">ring</button>
      <button @click="switchType('line')">line</button>
      <button @click="switchType('multi-line-bar-x')">multi-line-bar-x</button>
      <button @click="switchType('dybar')">dybar（动态排序）</button>
      <button @click="switchType('map')">Map</button>
      <button @click="switchType('map3d')">Map 3D</button>
      <button @click="switchType('treemap')">treemap</button>
    </div>
    <kidar-echarts :type="type" :data="data" :cols="cols" :theme="theme" class="echarts-block" @click="drill" />
  </div>
</template>

<script>
import Mock from "mockjs";
import { KidarEcharts } from "@/index";

export default {
  components: { KidarEcharts },
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
    drill (params) {
      console.log(params)
    },
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