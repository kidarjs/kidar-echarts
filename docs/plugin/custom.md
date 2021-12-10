# 自定义插件

## 创建一个脚手架
  - 引入 @kidar/echarts-helper，你会得到更好的提示

## 新建一个文件

```ts
import { defineConfig, KidarEchartsContext } from '@kidar/echarts-helper'

export default defineConfig({
  resetOption(cols, data, ctx: KidarEchartsContext & { extra?: unknow }) {
    const { extra, chart } = ctx
    // TODO 你可以在这里添加自己的逻辑代码，最后返回echarts的option，组件会自动重置chart的option
    // 或者返回false，自定义chart.setOption()的时机

    return {
      ...
      series: [...]
    }
  }
})

```

## 测试

## 发布

## 在项目中安装引入
```ts
import CustomPluginName from 'xxx'
import {addKidarEchartsPlugin} from '@kidar/echarts-vue'
// 自定义导入的插件名称，建议使用小写中横线风格
addKidarEchartsPlugin('custom-plugin-name', CustomPluginName)
```