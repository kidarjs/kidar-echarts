import { defineConfig } from '@kidar/echarts-helper';
import { setTitle } from './utils';
export default defineConfig({
    resetOption(cols, data, ctx) {
        const { extra } = ctx;
        const { radius } = extra || {};
        const title = setTitle(ctx);
        return {
            title,
            legend: {
                type: 'scroll',
                bottom: 20,
                left: 'center',
                padding: [5, 16],
                data: data.map(t => t.name)
            },
            series: [
                {
                    id: ctx.chartId,
                    animationDurationUpdate: 1000,
                    universalTransition: true,
                    type: 'pie',
                    radius: radius ? radius : ['35%', '50%'],
                    data: data
                }
            ]
        };
    }
});
