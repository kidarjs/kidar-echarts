<template>
  <div :style="`text-align: center;`">
    <h3 class="title">kidar-echarts</h3>
    <div class="tools-bar">
      <button @click="switchTheme">切换暗色主题</button>
      <button @click="switchType('pie')">pie</button>
      <button @click="switchType('ring')">ring</button>
      <button @click="switchType('treemap')">treemap</button>
      <button @click="switchType('line')">line</button>
      <button @click="switchType('multi-line-bar-x')">multi-line-bar-x</button>
      <button @click="switchType('dybar')">dybar（动态排序）</button>
      <button @click="switchType('map')">Map</button>
      <button @click="switchType('map3d')">Map 3D</button>
    </div>
    <kidar-echarts :type="type" :data="data" :cols="cols" :theme="theme" class="echarts-block" @click="drill" />
  </div>
</template>

<script>
import Mock from "mockjs";
import { KidarEcharts } from "@/index";

const data = [{ "name": "吉林省", "value": 61684, "bar": 496, "line": 470 }, { "name": "贵州省", "value": 52562, "bar": 801, "line": 736 }, { "name": "重庆", "value": 50857, "bar": 335, "line": 906 }, { "name": "吉林省", "value": 34610, "bar": 641, "line": 962 }, { "name": "香港特别行政区", "value": 7482, "bar": 356, "line": 498 }, { "name": "辽宁省", "value": 62656, "bar": 632, "line": 241 }, { "name": "四川省", "value": 69524, "bar": 17, "line": 823 }, { "name": "上海", "value": 20918, "bar": 858, "line": 167 }, { "name": "河南省", "value": 73196, "bar": 798, "line": 574 }, { "name": "云南省", "value": 54455, "bar": 602, "line": 709 }, { "name": "海南省", "value": 62191, "bar": 595, "line": 339 }, { "name": "福建省", "value": 92100, "bar": 521, "line": 386 }, { "name": "陕西省", "value": 98426, "bar": 401, "line": 881 }, { "name": "内蒙古自治区", "value": 33366, "bar": 589, "line": 854 }, { "name": "福建省", "value": 68020, "bar": 855, "line": 468 }, { "name": "福建省", "value": 71292, "bar": 348, "line": 355 }, { "name": "山东省", "value": 88152, "bar": 486, "line": 894 }, { "name": "香港特别行政区", "value": 34160, "bar": 555, "line": 712 }, { "name": "新疆维吾尔自治区", "value": 38606, "bar": 62, "line": 364 }, { "name": "台湾", "value": 65613, "bar": 20, "line": 279 }]

export default {
  components: { KidarEcharts },
  data () {
    return {
      type: 'pie',
      data: data,
      color: '#ffffff',
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
      this.color = this.theme ? '#ffffff' : '#100c2a'
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
          // this.loadData()
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