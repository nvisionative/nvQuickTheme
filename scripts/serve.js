/**
 * DNN Theme Development Server
 * 
 * Starts Browser-Sync proxy server that:
 * 1. Proxies your local DNN site
 * 2. Watches source files and rebuilds automatically
 * 3. Auto-refreshes browser when files change
 */

import browserSync from 'browser-sync';
import chokidar from 'chokidar';
import { build } from 'vite';
import { logInfo, logSuccess, logError } from './helpers.js';
import config from '../serve.config.js';

const bs = browserSync.create();

/**
 * Start Browser-Sync proxy server
 */
function startBrowserSync() {
  bs.init({
    proxy: config.dnnUrl,
    port: config.port,
    open: true,              // Auto-open browser
    notify: {
      styles: {
        top: 'auto',
        bottom: '0',
        borderRadius: '5px 0 0 0',
      }
    },
    logPrefix: 'DNN Theme',
    
    // Files to watch for browser reload
    files: config.watchPaths,
    
    // Don't sync interactions (optional - improves performance)
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    
    // Add middleware if needed for custom behavior
    middleware: [
      function(req, res, next) {
        // Example: Add CORS headers if needed
        // res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    ],
  });
  
  console.log('');
  logSuccess('Browser-Sync started!');
  logInfo(`Local:    http://localhost:${config.port}`);
  logInfo(`Proxying: ${config.dnnUrl}`);
  
  // Get network IP for testing on other devices
  const networkIp = bs.getOption('urls').get('external');
  if (networkIp) {
    logInfo(`Network:  ${networkIp}`);
  }
  
  console.log('');
}

/**
 * Watch source files and trigger rebuild
 */
function watchSourceFiles() {
  const watcher = chokidar.watch(config.sourcePaths, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,     // Don't trigger on initial scan
  });
  
  let buildTimeout;
  let isBuilding = false;
  
  /**
   * Debounced build function
   */
  const debouncedBuild = async (path) => {
    clearTimeout(buildTimeout);
    
    buildTimeout = setTimeout(async () => {
      if (isBuilding) return;
      
      const shortPath = path.replace(process.cwd(), '.');
      logInfo(`Changed: ${shortPath}`);
      
      isBuilding = true;
      const startTime = Date.now();
      
      try {
        await build();
        const duration = Date.now() - startTime;
        logSuccess(`Rebuilt in ${duration}ms`);
        console.log('');
      } catch (error) {
        logError('Build failed', error);
        console.log('');
      } finally {
        isBuilding = false;
      }
    }, config.debounce);
  };
  
  // Watch for file changes
  watcher
    .on('change', debouncedBuild)
    .on('add', debouncedBuild);
  
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
  watchSourceFiles();
  
  logInfo('Ready! Edit files in src/ and browser will auto-refresh.');
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