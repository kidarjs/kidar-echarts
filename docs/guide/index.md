---
navbar: true
---

### 为什么要使用KidarEcharts

当我们使用echarts画图表时，由于使用原生Echarts,option配置项太多，很容易遗漏犯错，当项目中图表很多时，类似的图表很难复用，抽取组件也很麻烦。

频繁的编写option很痛苦，属性多得记不住，总是需要查看文档来进行配置

因此更贴合Vue使用者习惯的 kidar-echarts 组件，将会给你带来更舒适的编码体验，减少了echarts的学习成本。

kidar-echarts为了解决这个问题，将大家常用的option进行收集封装，通过懒加载的方式展现，减少echarts配置的学习成本。
并且支持自定义option文件，并通过添加插件的方式导入，方便复用。同时你也可以寻找社区分享的好用的option进行安装使用，我们仅需要关注图表所需数据格式、维度，就能画出漂亮的图表了。

### 安装

```sh
# 必须, echarts5.x 这里推荐到官网进行定制所需依赖，生成一个最小依赖包进行全局引入
npm i echarts@5 

# 必须
npm i kidar-echarts  

# 按需安装
# 内置了折线-柱状图混搭、圆环图、饼图、面积图、泡泡图、中国地图、矩形
# 还包括了dark、light两种主题
npm i kidar-echarts-plugins

```

### 引入

```html
<template>
  <kidar-echarts type="line-bar-x" :data="data" :cols="cols" style="height: 400px; width: 100%" />
</template>

<script>
  import { KidarEcharts } from 'kidar-echarts'
</script>
```