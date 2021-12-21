

## 开始使用

KidarEcharts，是对echarts的进一步封装，采用插件的方式，收集各类优秀的option配置案例，并转换成可复用的插件。

这样我们就可以很容易的画出漂亮的图表，也可以很容易移植社区中优秀的案例，减少了echarts冗长的配置文档学习。

[KidarEcharts组件文档](https://kidarjs.github.io/kidar-echarts)
[这里有个可视化大屏案例](https://kidarjs.github.io/kidar-vue-examples/#/echartsplus/)

**当前状态：Beta** 如果觉得不错，欢迎star支持

### 特性
- 简单轻量，没有捆绑功能，所有插件均按需加载
- 可复用，插件化的配置，提高了类似图表的复用性
- 可扩展，支持自定义插件
- 支持主题切换

### 技术栈
- echarts
- vue2 | vue3 | react
- pnpm + monorepo 
- vite

### 安装

Vue2 | Vue3
```bash
# 必须, echarts5.x 这里推荐到官网进行定制所需依赖，生成一个最小依赖包进行全局引入
$ npm i @kidar/echarts-vue @kidar/echarts-plugins echarts@5 

```

React

```bash
# 必须, echarts5.x 这里推荐到官网进行定制所需依赖，生成一个最小依赖包进行全局引入
$ npm i @kidar/echarts-react @kidar/echarts-plugins echarts@5 
```

引入插件
```bash
# 按需安装
# 内置了折线-柱状图混搭、圆环图、饼图、面积图、泡泡图、中国地图、矩形
$ npm i @kidar/echarts-plugins
```

切换主题
```bash
# dark、light两种主题
$ npm i @kidar/echarts-theme
```

### 项目中使用

```vue
<template>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" theme="dark" style="height: 400px; width: 560px;" />
</template>

<script>
  // 对于项目中图表较多的，建议全局引入
  import { KidarEcharts, addKidarEchartsPlugin } from '@kidar/echarts-vue'
  import LineBarX from '@kidar/echarts-plugins/line-bar-x'
  addKidarEchartsPlugin('line-bar-x', LineBarX)

  export default {
    data(){
      return{
        cols: [
          { name: '成都', color: '#fbd161', type: 'bar' },
          { name: '深圳东', color: '#1890ff', type: 'bar', stack: '深圳' },
          { name: '深圳西', color: '#ff90ff', type: 'bar', stack: '深圳' },
          { name: '上海', color: '#9900ff', type: 'bar' },
          { name: '比例', prop: 'ratio', color: '#44ff99', type: 'line', y1: true }
        ],
        data: [
          {name: '2018', '深圳西': 150, '成都': 350, '深圳东': 300, '上海': 380, ratio: 75},
          {name: '2019', '深圳西': 250, '成都': 450, '深圳东': 250, '上海': 480, ratio: 85},
          {name: '2020', '深圳西': 280, '成都': 550, '深圳东': 300, '上海': 580, ratio: 79},
          {name: '2021', '深圳西': 300, '成都': 390, '深圳东': 350, '上海': 680, ratio: 84},
          {name: '2022', '深圳西': 330, '成都': 540, '深圳东': 400, '上海': 780, ratio: 95}
        ]
      }
    }
  }
</script>
```