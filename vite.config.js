import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { postBuild } from './scripts/postbuild.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite Configuration for DNN Theme
 * 
 * This file contains ONLY configuration.
 * All build logic is in ./scripts/
 */
export default defineConfig({
  // Source directory
  root: './src',
  base: './',
  
  // Build configuration
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  
    lib: {
      entry: resolve(__dirname, 'src/js/custom.js'),
      name: 'custom',
      formats: ['es'],
      fileName: () => 'js/custom.min.js',
      cssFileName: 'css/style.min.css',
    },
  
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/style.min.css';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  
    minify: 'terser',
    sourcemap: true,
    cssMinify: true,
  },
  
  // SCSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['./node_modules'],
      },
    },
  },
  
  // Plugins
  plugins: [
    postBuild(), // Runs post-build tasks automatically
  ],
});
