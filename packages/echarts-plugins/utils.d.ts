import { SliderDataZoomComponentOption } from 'echarts';
import { KidarEchartsContext } from '@kidar/echarts-helper';
export declare const isNull: (val: any) => boolean;
export declare function setTitle(ctx: KidarEchartsContext): {
    show: boolean;
    text: string | undefined;
    subtext: string | undefined;
    left: string;
    top: string;
};
export declare const setZoom: (barsWidth: number, ctx: KidarEchartsContext) => SliderDataZoomComponentOption;
export declare function omitNum(val: number): string | 0;
/**
 * 获取一个数的近似整值
 * @param val
 */
export declare function approximateNum(val: number): number;
export declare function getLinearColor(startColor: string, endColor: string): {
    color: {
        type: "linear";
        x: number;
        y: number;
        x2: number;
        y2: number;
        colorStops: {
            offset: number;
            color: string;
        }[];
        global: boolean;
    };
};
export declare const baseSerie: {
    animationDurationUpdate: number;
    universalTransition: boolean;
};
export declare const defaultColors: string[];
