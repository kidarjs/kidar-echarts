---
title: 组件属性
---

# 组件特性

## 属性 | Props


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

