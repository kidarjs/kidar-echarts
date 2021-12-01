---
title: 组件属性
---

# 组件特性

## 安装 | Install

如果使用的是 Vue2 | Vue3,使用kidar-echarts
```bash
$ npm install kidar-echarts
```

如果使用的是 React,使用kidar-echarts-react
```bash
$ npm install kidar-echarts-react
```
## 属性 | Props
Vue和React组件的属性是一致的，对应的插件是共用的，和框架无关

|属性  | 数据类型 |默认值| 
|:---|:---|:---|
|type  | string | 必填，此处为注册插件时定义的名称 |
|data  | BaseData[] | 必填，图表数据，不同的插件，数据结构会有差异，详见[插件](/plugin/) |
|cols | Column[] | 图表纬度，当存在多个series时，可以使用此属性定制，具体属性参考对应的插件配置 |
|theme| string | 默认使用echarts默认主题，可以通过注册主题来替换 |
|extra| Object | 额外的配置参数，适配一些定义了额外属性的图表 |
|locale| string | 国际化配置，默认中文，zh-cn |
|renderer| 'canvas' 或 'svg' | 默认使用canvas渲染，可以切换为svg |
|tooltip| Function | 自定义 tooltip|
|label| Function | 自定义 label |
|click| Function | 自定义点击事件 |


## 主题切换

改变theme属性，即可切换主题，theme取值根据注册的名称来定

如果想自定义主题，可以到echarts官网在线定制，或者参考 kidar-echarts-plugins/theme/dark 文件进行修改

```ts
// 引入主题文件，并注册
import kidarLightTheme from 'kidar-echarts-plugins/theme/light'
import kidarDarkTheme from 'kidar-echarts-plugins/theme/dark'
import * as echarts from 'echarts'
echarts.registerTheme('light', kidarLightTheme)
echarts.registerTheme('dark', kidarDarkTheme)
```

:::demo
```vue
<template>
  <button @click="changeTheme">切换主题</button>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" :theme="theme" style="height: 400px; width: 100%;" />

  <p>KidarEcharts内置了自适应容器功能，下面展示了不同大小的div的表现</p>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" :theme="theme" style="height: 400px; width: 30%;display: inline-block;" />
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" :theme="theme" style="height: 400px; width: 70%;display: inline-block;" />
</template>

<script>
  export default {
    data(){
      return{
        theme: 'light',
        cols: [
          { name: '峰值', prop: 'peak', color: '#fbd161', type: 'pictorialBar' },
          { name: '趋势', prop: 'value', color: '#44ff99', type: 'line' },
        ],
        data: [
          {name: '2015', peak: 150, value: 184 },
          {name: '2016', peak: 250, value: 284 },
          {name: '2017', peak: 380, value: 384 },
          {name: '2018', peak: 350, value: 484 },
          {name: '2019', peak: 450, value: 384 },
          {name: '2020', peak: 550, value: 584 },
          {name: '2021', peak: 390, value: 684 },
          {name: '2022', peak: 540, value: 584 }
        ]
      }
    },
    methods:{
      changeTheme(){
        this.theme = this.theme==='light'?'dark':'light'
      }
    }
  }
</script>
```
:::