import {
  copyFonts,
  copyFontAwesome,
  copyBootstrapJs,
  processImages,
  copyContainers,
} from './utils.js';
import { logInfo, logSuccess, logError } from './helpers.js';

export function postBuild() {
  return {
    name: 'dnn-post-build',

    // Runs after Vite finishes writing the bundle
    closeBundle() {
      logInfo('Running post-build tasks...\n');

      try {
        copyFonts();
        copyFontAwesome();
        copyBootstrapJs();
        processImages();
        copyContainers();

        logSuccess('Post-build tasks complete!\n');
      } catch (error) {
        logError('Post-build tasks failed', error);
        throw error;
      }
    },
  };
}
