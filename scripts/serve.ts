/**
 * DNN Theme Development Server
 *
 * Starts a Browser-Sync proxy server that:
 * 1. Proxies your local DNN site
 * 2. Watches source files and rebuilds automatically
 * 3. Auto-refreshes the browser when files change
 */

import browserSync, { type Options as BrowserSyncOptions } from 'browser-sync';
import chokidar from 'chokidar';
import { build } from 'vite';
import { logInfo, logSuccess, logError } from './helpers.js';
import config from '../serve.config.js';

const bs = browserSync.create();

// ============================================================================
// BROWSER-SYNC
// ============================================================================

/** Start the Browser-Sync proxy server. */
function startBrowserSync(): void {
  const options: BrowserSyncOptions = {
    proxy: config.dnnUrl,
    port: config.port,
    open: true,
    // @ts-expect-error — @types/browser-sync does not type notify.styles correctly
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
        borderRadius: '5px 0 0 0',
      },
    },
    logPrefix: 'DNN Theme',
    files: config.watchPaths,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    middleware: [
      (_req, _res, next) => {
        // Add any custom middleware here, e.g. CORS headers:
        // res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      },
    ],
  };

  bs.init(options);

  console.log('');
  logSuccess('Browser-Sync started!');
  logInfo(`Local:    http://localhost:${config.port}`);
  logInfo(`Proxying: ${config.dnnUrl}`);

  const networkIp = bs.getOption('urls')?.get('external') as string | undefined;
  if (networkIp) {
    logInfo(`Network:  ${networkIp}`);
  }

  console.log('');
}

// ============================================================================
// FILE WATCHER
// ============================================================================

/** Watch source files and trigger a debounced Vite rebuild on changes. */
function watchSourceFiles(): void {
  const watcher = chokidar.watch(config.sourcePaths, {
    ignored: /(^|[/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  let buildTimeout: ReturnType<typeof setTimeout> | undefined;
  let isBuilding = false;

  const debouncedBuild = async (filePath: string): Promise<void> => {
    clearTimeout(buildTimeout);

    buildTimeout = setTimeout(async () => {
      if (isBuilding) return;

      const shortPath = filePath.replace(process.cwd(), '.');
      logInfo(`Changed: ${shortPath}`);

      isBuilding = true;
      const startTime = Date.now();

      try {
        await build();
        const duration = Date.now() - startTime;
        logSuccess(`Rebuilt in ${duration}ms`);
        console.log('');
      } catch (error) {
        logError('Build failed', error as Error);
        console.log('');
      } finally {
        isBuilding = false;
      }
    }, config.debounce);
  };

  watcher.on('change', debouncedBuild).on('add', debouncedBuild);

  logInfo(`Watching: ${config.sourcePaths.join(', ')}`);
  console.log('');
}

// ============================================================================
// ENTRY POINT
// ============================================================================

console.log('');
logInfo('Starting DNN theme development server...');
console.log('');

try {
  startBrowserSync();
  watchSourceFiles();

  logInfo('Ready! Edit files in src/ and browser will auto-refresh.');
  logInfo('Press Ctrl+C to stop.');
  console.log('');
} catch (error) {
  console.log('');
  logError('Failed to start development server', error as Error);
  console.log('');
  console.log('💡 Troubleshooting:');
  console.log(`  - Is your DNN site running at ${config.dnnUrl}?`);
  console.log(`  - Is port ${config.port} already in use?`);
  console.log(`  - Check serve.config.ts for correct settings`);
  console.log('');
  process.exit(1);
}
