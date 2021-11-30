<h1 align="center">kidar-echarts 🍥 更简单的Echarts</h1>

<p align="center">
  将必要有关联的配置属性进行封装，仅暴露用户可能自定义的配置选项，无需关注自适应、鼠标点击事件等操作，支持自定义插件，更好的复用配置
</p>

<p align="center">
 具体可点击查看在线文档 ✨ <a href="https://kidarjs.github.io/kidar-echarts/">Live Doc</a>
</p>
<p align="center">
 可视化大屏示例 ✨ <a href="https://kidarjs.github.io/kidar-vue-examples/#/echartsplus/">Live Demo</a>
</p>

# Now
目前组件还再完善中，也欢迎大家点评，如果你觉得这个组件还不错，也欢迎贡献代码，扩充更多好看的plugin

# 🔥 Features
每个组件实例都是一个echarts，切换不同的echarts采用懒加载技术，更快更简单的实现不同图形的展示

- [x] 快速绘制出简单图形，饼图、折线、柱状、环形、多样组合、地图
- [x] 支持自定义插件
- [x] 支持自适应宽高，当容器大小变化时自动适应
- [x] 支持Typescript
- [x] 支持类型切换，并有过度动画效果
- [x] 支持主题切换，目前有light、dark两种主题色，也可注册自己的主题
- [ ] 支持自定义参数，方便定制tooltip、label等
- [ ] 支持点击事件、鼠标移入移出事件
- [ ] 支持3D

# 效果图预览

仅需几行代码，就能画出好看的大屏了，快试试吧
<img src="./public/dataScreen1.png" alt="preview" style="zoom:100%;" />

<img src="./public/dataScreen2.png" alt="preview" style="zoom:100%;" />


# 涉及的技术
* vite
* vue-demi
* vue2-3
* typescript

# 🚀 Getting started

## Install

```bash
npm install kidar-echarts
```

## Development

1. new .vue file
2. copy the following codes 
3. run it

```vue
<template>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" style="height: 400px; width: 100%" />
</template>
<script>
import { KidarEcharts, addKidarEchartsPlugin } from 'kidar-echarts'
import LineBarX from 'kidar-echarts-plugins/line-bar-x'
addKidarEchartsPlugin('line-bar-x', LineBarX)
export default {
  components: { KidarEcharts },
  data(){
    return {
      cols: [
        {name: '折线', color: '#1890ff', type: 'line'},
        {name: '柱子', color: '#ff90ff', type: 'bar'}
      ],
      data: [
        {name: '2020-01', value: 123},
        {name: '2020-02', value: 456},
        {name: '2020-03', value: 789},
        {name: '2020-04', value: 123}
      ]
    }
  }
}
</script>
```


## 添加自定义插件 Add Plugin 

```ts
// main.ts
import { addKidarEchartsPlugin } from 'kidar-echarts'

import barX from "./plugins/barX";

addKidarEchartsPlugin(barX)

```

```ts
// barX.ts 推荐使用 ts + defineConfig 更友好的提示，提前规避编码错误
import { defineConfig } from 'kidar-echarts-plugins/helper'

export default defineConfig({
  name: 'barX', // 此处的name属性，将用于组件的属性type
  resetOption(cols, data, ctx) {
    return {
      yAxis: [{
        type: 'value'
      }],
      xAxis: [{
        type: 'category',
        data: data.map(t => t.name)
      }],
      series: [
        {
          type: 'bar',
          data: data
        }
      ]
    }
  }
})

```

