import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { EchartsPlugin, KidarEchartsContext } from 'kidar-echarts-plugins/helper'

import { removeListenElResize, listenElResize } from 'nkxrb-tools'

type Prop = {
  style?: Object
  className?: string
} & Omit<KidarEchartsContext, 'init' | 'chart'>

const __DEV__ = process.env.NODE_ENV === 'development'
const PLUGINS: Map<string, EchartsPlugin> = new Map()

const KidarEcharts = React.memo<Prop>(prop => {
  const { className, style, type, cols, data, theme, click } = prop
  const KidarEchartsEl = useRef(null);
  let chart: echarts.ECharts | null = null
  const init = () => {
    chart = echarts.getInstanceByDom(KidarEchartsEl.current) || echarts.init(KidarEchartsEl.current, theme)
    ctx.chart = chart
    chart.setOption({}, false) // 初始化主题中默认的配置，确保chart.getOption()可以获取到值
    listenElResize(KidarEchartsEl.current, () => {
      resetOption()
      chart && chart.resize()
    })
  }

  const ctx = { ...prop, chart, init }

  const resetOption = () => {
    if (!PLUGINS.has(type)) {
      if (__DEV__) {
        throw new Error(`there is not exist ${type} plugin, you can try [ npm i kidar-echarts-plugins or custom plugins ]。
          yon can see：https://github.com/kidarjs/kidar-echarts
        `)
      }
      return
    }

    const option = PLUGINS.get(type).resetOption(cols, data, ctx)
    if (option) {
      chart.setOption(option, true)
    }
  }

  useEffect(() => {
    !chart && init()
    resetOption()
    return () => {
      removeListenElResize(KidarEchartsEl.current)
      chart.dispose()
    }
  }, [type, cols, data])

  useEffect(() => {
    chart.dispose()
    init()
  }, [theme])

  useEffect(() => {
    click ? chart.on('click', params => click(params), ctx) : chart.off('click')
  }, [click])


  return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <div ref={KidarEchartsEl} className={className} style={style}></div>
    </div>
  )
})

const addKidarEchartsPlugin = (pluginName: string, plugin: EchartsPlugin) => {
  if (PLUGINS.has(pluginName)) {
    __DEV__ && console.warn(`pluginName is exist 【${pluginName}】 该插件名已存在, 重复注册将覆盖已有的插件！`)
  }
  PLUGINS.set(pluginName, plugin)
}


export { KidarEcharts, addKidarEchartsPlugin }