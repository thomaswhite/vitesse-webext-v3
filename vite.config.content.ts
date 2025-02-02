import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import { sharedConfig } from './vite.config'
import { isDev, r } from './scripts/utils'
import windiConfig from './windi.config'
import packageJson from './package.json'

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist/contentScripts'),
    cssCodeSplit: false,
    emptyOutDir: true,
    sourcemap: isDev ? 'inline' : false,
    minify:  false, // isDev ? false : 'terser',
    lib: {
      entry: r('src/contentScripts/index.ts'),
      name: packageJson.name,
      // formats: [  isDev ? 'es':'cjs' ], // iife
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: {
        ...windiConfig,
        // disable preflight to avoid css population
        preflight: false,
      },
    }),
  ],
})
