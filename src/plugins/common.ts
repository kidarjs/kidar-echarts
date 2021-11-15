import { getTextWidth } from 'nkxrb-tools'
import { Column, BaseData, KidarEchartsContext } from '../../types/index'
import { SliderDataZoomComponentOption } from 'echarts'

export const setZoom = (barsWidth: number, ctx: KidarEchartsContext): SliderDataZoomComponentOption => {
  const zoom: SliderDataZoomComponentOption = {}
  const { chart, data } = ctx
  let interval = 10
  const end = chart.getWidth() / (barsWidth + interval)

  zoom.show = end < data.length - 1
  zoom.startValue = 0
  zoom.endValue = end

  return zoom
}
