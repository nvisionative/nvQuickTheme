import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import checker from 'vite-plugin-checker';
import { postBuild } from './scripts/postbuild.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite Configuration for DNN Theme
 *
 * This file contains ONLY configuration.
 * All build logic lives in ./scripts/
 */
export default defineConfig({
  // Source directory
  root: './src',
  base: './',

  build: {
    outDir: '../dist',
    emptyOutDir: true,

    rollupOptions: {
      // Entry point(s) — change 'custom' to match your JS filename
      input: {
        custom: resolve(__dirname, 'src/js/custom.js'),
      },

      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/[name].min.js',
        assetFileNames: (assetInfo) => {
          // assetInfo.names is available in Rollup 4 / Vite 5+
          const name = assetInfo.names?.[0] ?? assetInfo.name;

          if (name?.endsWith('.css')) {
            return 'css/[name].min[extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },

    minify: 'terser',
    sourcemap: true,
    cssMinify: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['./node_modules'],
      },
    },
  },

  plugins: [
    // Runs TypeScript and ESLint checks on every rebuild.
    // Errors appear in the terminal and as a browser overlay during serve/watch.
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "scripts/**/*.ts" "*.ts"',
        // Report ESLint errors as build errors (not just warnings)
        useFlatConfig: true,
      },
    }),
    postBuild(),
  ],
});
