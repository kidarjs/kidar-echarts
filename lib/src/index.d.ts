import { EChartsCoreOption } from 'echarts';
import EchartsPlus from './KiEchartsPlus.vue';
export declare class Column {
    name: string;
    color?: string;
}
export declare class BaseData {
    name: string;
    value: number;
}
export interface EchartsPlugin {
    name: string;
    resetOption<T>(cols: Column[], data: Array<T & BaseData>): EChartsCoreOption;
}
export declare function defineConfig(config: EchartsPlugin): EchartsPlugin;
export default EchartsPlus;
