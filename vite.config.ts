import path from "path";
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import babel from 'rollup-plugin-babel';

const config = defineConfig({
  optimizeDeps: {
    exclude: ['vue-demi']
  },
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    },
    dedupe: ["vue-demi"],
  },

  build: {
    minify: true,
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      fileName: 'kidar-echarts',
      name: 'KIDAR_ECHARTS'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'echarts'],
      output: [
        {
          format: "es",
          esModule: true,
          exports: "named",
          globals: {
            vue: 'Vue',
            echarts: 'echarts'
          }
        },
        {
          format: 'umd',
          inlineDynamicImports: true,
          interop: "esModule",
          exports: "named",
          globals: { // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
            vue: 'Vue',
            echarts: 'echarts'
          }

        }
      ]
    }
  },

  plugins: [
    createVuePlugin(),
    babel()
  ],
});

export default config;
