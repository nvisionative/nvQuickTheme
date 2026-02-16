import { build } from 'vite';
import { createPackage } from './utils.js';

console.log('Building theme...');

build().then(() => {
  console.log('Build complete. Creating DNN package...');
  return createPackage();
}).then(() => {
  console.log('✅ Packaging complete!');
}).catch(err => {
  console.error('❌ Packaging failed:', err);
  process.exit(1);
});
