// @ts-check
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Lnear Utils',
      fileName: 'lnear-utils',
      formats: ['es'],
    },
    target: ["esnext"],
    rollupOptions: {},
  },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [dts({ rollupTypes: true })],
});

