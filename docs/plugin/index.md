---
title: 插件
---

# kidar-echarts-plugins

## line-bar-x 

通过cols可以实现多条折线、曲线、柱形图、自定义形状柱图的混合搭配
|属性|是否需要|描述
|:---|:---|:---|
|name|必需|legend的取值，当prop为空时，会以name作为key，从数据对象中获取值|
|type|必需|图形类型，可选值有: line, bar, pictorialBar, 当使用pictorialBar时，可以symbol自定义图形|
|prop|可选|优先使用prop作为key，获取数据对象中对应的值|
|stack|可选|可以堆叠相同值的图形|
|color|可选|自定义图形颜色|
|y1|可选|Boolean类型，当y1为true时，将在右侧出现一个Y轴|
|itemStyle|可选|更详细的对象样式，参考echarts.series.itemStyle|

```js
// 按需引入
import { addKidarEchartsPlugin } from 'kidar-echarts'
import LineBarX from 'kidar-echarts-plugins/line-bar-x'
addKidarEchartsPlugin('line-bar-x', LineBarX)
```

:::demo
```vue
<template>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" style="height: 400px; width: 100%;" />
</template>

<script>
  // 对于项目中图表较多的，建议全局引
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
:::

## pie

```js
// 按需引入
import { addKidarEchartsPlugin } from 'kidar-echarts'
import Pie from 'kidar-echarts-plugins/pie'
addKidarEchartsPlugin('pie', Pie)
```
:::demo
```vue
<template>
  <kidar-echarts type="pie" :data="data" style="height: 400px; width: 100%;" />
</template>

<script>
  // 对于项目中图表较多的，建议全局引
  export default {
    data(){
      return{
        data: [
          {name: '2018', value: 75},
          {name: '2019', value: 85},
          {name: '2020', value: 79},
          {name: '2021', value: 84},
          {name: '2022', value: 95}
        ]
      }
    }
  }
</script>
```
:::

## china-map

通过配置data数据,即可渲染出不同城市的属性，在数据对象中添加tos,可以实现不同城市之间的调度关系

```js
// 按需引入
import { addKidarEchartsPlugin } from 'kidar-echarts'
import ChinaMap from 'kidar-echarts-plugins/china-map'
addKidarEchartsPlugin('china-map', ChinaMap)
```

:::demo
```vue
<template>
  <kidar-echarts type="china-map" :data="data" style="height: 400px; width: 100%;" />
</template>

<script>
  // 对于项目中图表较多的，建议全局引
  export default {
    data(){
      return{
        data: [
          {name: '成都', value: 75, tos: [{name: '运城', value: 40}]},
          {name: '深圳', value: 85, tos: [{name: '运城', value: 40}]},
          {name: '上海', value: 79, tos: [{name: '北京', value: 70}, {name: '运城', value: 40}]},
          {name: '北京', value: 84},
          {name: '运城', value: 95, tos: [{name: '北京', value: 40}]}
        ]
      }
    }
  }
</script>
```
:::

## graph

```js
// 按需引入
import { addKidarEchartsPlugin } from 'kidar-echarts'
import Graph from 'kidar-echarts-plugins/graph'
addKidarEchartsPlugin('graph', Graph)
```

:::demo
```vue
<template>
  <kidar-echarts type="graph" :data="data" style="height: 400px; width: 100%;" />
</template>

<script>
  // 对于项目中图表较多的，建议全局引
  export default {
    data(){
      return{
        data: [
          {name: '成都', value: 75},
          {name: '深圳', value: 85},
          {name: '上海', value: 79},
          {name: '北京', value: 94},
          {name: '陕西', value: 34},
          {name: '金城', value: 54},
          {name: '呼和浩特市', value: 14},
          {name: '运城', value: 105}
        ]
      }
    }
  }
</script>
```
:::