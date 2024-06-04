// @ts-check
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export type RollupOptions = import("vite").BuildOptions["rollupOptions"];
export function defineViteConfig(
  base: {
    name: string;
    titleName: string;
    rollupOptions?: RollupOptions;
  },
  dir: string = __dirname
) {
  const { name, titleName, rollupOptions } = base;
  return defineConfig({
    build: {
      lib: {
        entry: resolve(dir, "src/index.ts"),
        name: titleName,
        fileName: name,
        formats: ["es", "cjs"],
      },
      rollupOptions: {
        ...rollupOptions,
      },
    },
    plugins: [dts({ rollupTypes: true })],
  });
}
