import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { postBuild } from './scripts/postbuild.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: './src',
  base: './',
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
  
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['./node_modules'],
        quietDeps: true,
      },
    },
  },
  
  plugins: [
    postBuild(),
  ],
});
