import path from "path";
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import babel from 'rollup-plugin-babel';

const config = defineConfig({
  resolve: {
    alias: {
      "@": `${path.resolve(__dirname, "src")}`,
    }
  },

  build: {
    minify: true,
    outDir: 'lib',
    lib: {
      entry: 'src/index.ts',
      fileName: 'kidar-vue-echarts',
      name: 'KI_ECHARTS_PLUS',
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'echarts'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          echarts: 'echarts'
        }
      }
    }
  },

  plugins: [
    createVuePlugin(),
    babel()
  ],
});

export default config;
