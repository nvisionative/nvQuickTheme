import { 
  copyFonts, 
  copyFontAwesome, 
  copyBootstrapJs, 
  processImages, 
  copyContainers, 
  updateManifest 
} from './utils.js';

export function postBuild() {
  return {
    name: 'dnn-post-build',
    
    // Run after Vite finishes building
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
