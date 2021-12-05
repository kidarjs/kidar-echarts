import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import babel from '@rollup/plugin-babel';

const config = defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  build: {
    minify: true,
    outDir: 'lib',
    lib: {
      entry: 'index.ts',
      fileName: 'kidar-echarts',
      name: 'KIDAR_ECHARTS'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'echarts', 'vue-demi', 'echarts-gl/charts', 'echarts-gl/components'],
      output: [
        {
          format: "es",
          esModule: true,
          exports: "named",
          globals: {
            vue: 'Vue',
            echarts: 'echarts',
            'vue-demi': 'VueDemi',
          }
        },
        {
          format: 'umd',
          inlineDynamicImports: true,
          interop: "esModule",
          exports: "named",
          globals: { // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            vue: 'Vue',
            echarts: 'echarts',
            'vue-demi': 'VueDemi',
            'echarts-gl/charts': 'EchartsGLCharts',
            'echarts-gl/components': 'EchartsGLComponents',
          }
        }
      ]
    }
  },

  plugins: [
    vue(),
    babel()
  ],
});

export default config;
