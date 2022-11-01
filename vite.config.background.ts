import { defineConfig } from 'vite'
import { sharedConfig } from './vite.config'
import { isDev, r } from './scripts/utils'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev
      ? {}
      : undefined,
    outDir: r('extension/dist/background'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false, //isDev ? 'inline' : false,
    minify: false, // isDev ? false : 'terser',
    lib: {
      entry: r('src/background/index.ts'),
      name: packageJson.name,
      // formats: [  isDev ? 'es':'cjs' ], // iife
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
        // extend: true,
      },
    },
  },
  plugins: sharedConfig.plugins,
})
