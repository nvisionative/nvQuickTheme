import type { Plugin } from 'vite';
import {
  copyFonts,
  copyFontAwesome,
  copyBootstrapJs,
  processImages,
  copyContainers,
  updateManifest,
} from './utils.js';

/**
 * Vite plugin that runs DNN-specific post-build tasks after the bundle is
 * written to disk (i.e. after `closeBundle` fires).
 */
export function postBuild(): Plugin {
  return {
    name: 'dnn-post-build',

    closeBundle() {
      console.log('\n🔧 Running post-build tasks...\n');

      try {
        copyFonts();
        copyFontAwesome();
        copyBootstrapJs();
        processImages();
        copyContainers();
        updateManifest();

        console.log('\n✅ Post-build tasks complete!\n');
      } catch (error) {
        console.error('\n❌ Post-build tasks failed:', error);
        throw error;
      }
    },
  };
}
