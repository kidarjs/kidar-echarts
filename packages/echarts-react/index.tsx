import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { EchartsPlugin, KidarEchartsContext } from '@kidar/echarts-helper'

import { removeListenElResize, listenElResize } from 'nkxrb-tools'

type Prop = {
  style?: Object
  className?: string
} & Omit<KidarEchartsContext, 'init' | 'chart'>

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
    if (!type) {
      throw new Error(`type props is required, you can set type property like type="pie"。
          yon can see docs: https://kidarjs.github.io/kidar-echarts/guide/#%E5%AE%89%E8%A3%85
        `)
    }
    if (!PLUGINS.has(type)) {
      throw new Error(`there is not exist ${type} plugin, you can try [ npm i kidar-echarts-plugins or custom plugins ]。
          yon can see: https://kidarjs.github.io/kidar-echarts/guide/#%E5%AE%89%E8%A3%85
        `)
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
    console.warn(`pluginName is exist 【${pluginName}】 该插件名已存在, 全局只引入一次就够了!`)
    return
  }
  PLUGINS.set(pluginName, plugin)
}


export { KidarEcharts, addKidarEchartsPlugin }