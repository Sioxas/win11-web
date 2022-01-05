import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import ViteTS from 'vite-plugin-ts';
import swc from "rollup-plugin-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    swc({
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true, // If you use react
          dynamicImport: true,
          decorators: true,
        },
        target: "es2021",
        transform: {
          decoratorMetadata: true,
          react: {
            refresh: true,
          }
        },
      },
    }),
  ],
  // esbuild: false,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
