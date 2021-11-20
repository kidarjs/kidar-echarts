import { defineConfig } from '../src/index'

export default defineConfig({
  name: 'custom',
  resetOption(cols, data, ctx) {
    return {
      dataZoom: {
        show: false
      },
      legend: {
        data: cols.map(t => t.name)
      },
      yAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: data.map(t => t.name),
          axisLabel: {
            interval: 0
          },
          inverse: true
        }
      ],
      xAxis: [{
        type: 'value'
      }],
      series: [
        {
          type: 'bar',
          data: data,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }
      ],
    }
  }
})