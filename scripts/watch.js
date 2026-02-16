import { build } from 'vite';

console.log('Watching for file changes...');

build({
  build: {
    watch: {}
  }
}).catch(err => {
  console.error('Watch failed:', err);
  process.exit(1);
});
