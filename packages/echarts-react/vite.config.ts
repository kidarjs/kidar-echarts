// @ts-ignore
import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import fs from "fs";

const pathResolver = (path: string) => resolve(__dirname, path);

const external = ['react', 'react-dom', 'echarts', 'nkxrb-tools', 'kidar-echarts-plugins']
const globals = {
  'echarts': 'echarts',
  'react': 'React',
  'react-dom': 'ReactDom',
  'nkxrb-tools': 'NkxrbTools'
}

export default defineConfig({
  base: "./",
  plugins: [
    react()
  ],
  build: {
    minify: true,
    outDir: 'lib',
    lib: {
      entry: './index.tsx',
      fileName: 'kidar-echarts-react',
      name: 'KIDAR_ECHARTS'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: external,
      output: [
        {
          format: "es",
          esModule: true,
          exports: "named",
          globals: globals
        },
        {
          format: 'umd',
          inlineDynamicImports: true,
          interop: "esModule",
          exports: "named",
          globals: globals
        }
      ]
    }
  }
});
