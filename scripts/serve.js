/**
 * DNN Theme Development Server
 *
 * Starts a Browser-Sync proxy server that:
 * 1. Proxies your local DNN site
 * 2. Uses Vite's own file watcher to rebuild on source changes
 * 3. Auto-refreshes the browser when the build completes
 *
 * Chokidar is no longer used — Vite's watch mode handles source watching
 * and debouncing internally, and emits lifecycle events we hook into.
 */

import browserSync from 'browser-sync';
import { build }   from 'vite';
import { logInfo, logSuccess, logError } from './helpers.js';
import config from '../serve.config.js';

const bs = browserSync.create();

// ============================================================================
// BROWSER-SYNC
// ============================================================================

/**
 * Start the Browser-Sync proxy.
 *
 * `files` is intentionally omitted from the init options here — we trigger
 * reloads manually from the Vite watcher events so the browser only refreshes
 * after a full successful build, not just on any file write.
 */
function startBrowserSync() {
  bs.init({
    proxy:     config.dnnUrl,
    port:      config.port,
    open:      true,
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
        // Extend here if you need custom request handling (e.g. CORS headers)
        next();
      },
    ],
  });

  console.log('');
  logSuccess('Browser-Sync started!');
  logInfo(`Local:    http://localhost:${config.port}`);
  logInfo(`Proxying: ${config.dnnUrl}`);

  const networkIp = bs.getOption('urls').get('external');
  if (networkIp) logInfo(`Network:  ${networkIp}`);

  console.log('');
}

// ============================================================================
// VITE WATCHER
// ============================================================================

/**
 * Start Vite in watch mode and wire its lifecycle events to Browser-Sync.
 *
 * Vite's watcher already debounces rapid file changes, so we don't need
 * a manual setTimeout like the old chokidar approach required.
 *
 * Relevant Rollup watcher event codes:
 *   START       – a new build cycle is beginning
 *   BUNDLE_END  – build finished (includes duration)
 *   ERROR       – build failed
 *   END         – all bundles written for this cycle
 */
async function startViteWatcher() {
  const watcher = await build({
    build: {
      watch: {
        // Respect the sourcePaths from serve.config.js so the watcher scope
        // stays consistent with the old chokidar setup.
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
        // Tell Browser-Sync to reload all connected browsers
        bs.reload();
        console.log('');
        event.result?.close(); // Release the bundle from memory
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

// ============================================================================
// START SERVER
// ============================================================================

console.log('');
logInfo('Starting DNN theme development server...');
console.log('');

try {
  startBrowserSync();
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
