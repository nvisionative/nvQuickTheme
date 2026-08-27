import { build } from 'vite';

console.log('Building for production...');

build()
  .then(() => {
    console.log('Build complete!');
  })
  .catch((err: Error) => {
    console.error('Build failed:', err);
    process.exit(1);
  });
