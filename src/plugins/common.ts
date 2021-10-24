import { getTextWidth } from 'nkxrb-tools'
import { Column, BaseData, KiEchartsPlus } from '../../types/index'
import { SliderDataZoomComponentOption } from 'echarts'

export const setZoom = (cols: Column[], data: BaseData[], ctx: KiEchartsPlus): SliderDataZoomComponentOption => {
  const zoom: SliderDataZoomComponentOption = {}
  let interval = 10
  // %#@!%^&%阿松大
  // zoom.show = ctx.chart?.getWidth()

  return zoom
}

const REG_Letter = /[a-z|\(|\)|\[|\]|\-|\,|\.|\/|\\|\=|\{|\%|\}]/

export const omitStr = (value: string) => {
  let len = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charAt(i)) {

    }
  }
}