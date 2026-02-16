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
    
    rollupOptions: {
      // Entry point(s) - change 'custom' to match your JS filename
      input: {
        custom: resolve(__dirname, 'src/js/custom.js'),
      },
      
      // Output file naming
      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/[name].min.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name].min[extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    
    // Minification settings
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
