import browserSync from 'browser-sync';
import { build }   from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logInfo, logSuccess, logError } from './helpers.js';
import config from '../serve.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const bs = browserSync.create();

function startBrowserSync() {
  return new Promise((resolve) => {
    bs.init({
      proxy: {
        target: config.dnnUrl,
        proxyOptions: { rejectUnauthorized: false },
      },
      port:      config.port,
      open:      `${new URL(config.dnnUrl).protocol}//localhost:${config.port}`,
      logPrefix: 'DNN Theme',
      notify: {
        styles: {
          top: 'auto',
          bottom: '0',
          borderRadius: '5px 0 0 0',
        },
      },
      ghostMode: {
        clicks: false,
        forms:  false,
        scroll: false,
      },
      middleware: [
        function (req, res, next) {
          next();
        },
      ],
    }, () => {
      console.log('');
      logSuccess('Browser-Sync started!');
      logInfo(`Local:    ${new URL(config.dnnUrl).protocol}//localhost:${config.port}`);
      logInfo(`Proxying: ${config.dnnUrl}`);

      const networkIp = bs.getOption('urls').get('external');
      if (networkIp) logInfo(`Network:  ${networkIp}`);

      console.log('');
      resolve();
    });
  });
}

async function startViteWatcher() {
  const watcher = await build({
    configFile: resolve(__dirname, '../vite.config.js'),
    build: {
      watch: {
        include: config.sourcePaths,
      },
    },
  });

  watcher.on('event', (event) => {
    switch (event.code) {
      case 'START':
        logInfo('Rebuilding...');
        break;
      case 'BUNDLE_END':
        logSuccess(`Rebuilt in ${event.duration}ms`);
        bs.reload();
        console.log('');
        event.result?.close();
        break;
      case 'ERROR':
        logError('Build failed', event.error);
        console.log('');
        break;
    }
  });

  logInfo(`Watching: ${config.sourcePaths.join(', ')}`);
  console.log('');
}

console.log('');
logInfo('Starting DNN theme development server...');
console.log('');

try {
  await startBrowserSync();
  await startViteWatcher();

  logInfo('Ready! Edit files in src/ and the browser will auto-refresh.');
  logInfo('Press Ctrl+C to stop.');
  console.log('');
} catch (error) {
  console.log('');
  logError('Failed to start development server', error);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log(`  - Is your DNN site running at ${config.dnnUrl}?`);
  console.log(`  - Is port ${config.port} already in use?`);
  console.log(`  - Check serve.config.js for correct settings`);
  console.log('');
  process.exit(1);
}
