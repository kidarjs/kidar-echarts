import { defineConfig } from '@kidar/echarts-helper';
import { setTitle } from './utils';
import { AXIS_TYPE, CONST_V, POSITION, SERIES_TYPE } from './constant';
export default defineConfig({
    resetOption(cols, data, ctx) {
        const title = setTitle(ctx);
        let max = Math.floor(ctx.chart.getHeight() / 25);
        if (max > data.length) {
            max = data.length;
        }
        return {
            title,
            dataZoom: {
                show: false
            },
            legend: {
                show: false
            },
            yAxis: [
                {
                    type: AXIS_TYPE.category,
                    boundaryGap: true,
                    data: data.map(t => t.name),
                    axisLabel: {
                        interval: 0
                    },
                    min: 0,
                    max: max,
                    inverse: true,
                    animationDuration: 300,
                    animationDurationUpdate: 300
                }
            ],
            xAxis: [{
                    type: AXIS_TYPE.value,
                    max: CONST_V.dataMax,
                    axisLine: {
                        show: false
                    }
                }],
            series: [
                {
                    type: SERIES_TYPE.bar,
                    realtimeSort: true,
                    data: data,
                    label: {
                        show: true,
                        position: POSITION.right,
                        valueAnimation: true
                    }
                }
            ],
            animationDuration: 0,
            animationDurationUpdate: 3000,
            animationEasing: (k) => k,
            animationEasingUpdate: (k) => k
        };
    }
});
