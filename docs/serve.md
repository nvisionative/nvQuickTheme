# serve.js

Starts the development server. Runs Browser-Sync as a proxy in front of your local DNN site and uses Vite's built-in watch mode to trigger rebuilds and browser reloads on source file changes.

**Command:** `npm run serve`

---

## How It Works

1. Browser-Sync starts and proxies `dnnUrl` from `serve.config.js`
2. BS injects its client script into every proxied page response, establishing a WebSocket reload channel
3. Vite starts in watch mode, monitoring `sourcePaths` from `serve.config.js`
4. When a source file changes, Vite rebuilds automatically
5. On `BUNDLE_END`, `bs.reload()` is called — all connected browsers refresh

Browser-Sync is fully initialised before Vite starts, ensuring the reload socket exists before the first build completes.

---

## Configuration

All options are set in `serve.config.js`:

| Option | Description |
|---|---|
| `dnnUrl` | Full URL of your local DNN site, including scheme (`http://` or `https://`) |
| `port` | Port Browser-Sync listens on locally |
| `sourcePaths` | Glob patterns Vite watches for changes |

The local Browser-Sync URL uses the same scheme as `dnnUrl` — if your DNN site is `https://mysite.loc`, the dev server opens at `https://localhost:3000`.

`proxyOptions: { rejectUnauthorized: false }` is set on the proxy so self-signed certificates on local DNN installs are accepted without error.

---

## Functions

### `startBrowserSync()` *(private)*

Initialises Browser-Sync and returns a Promise that resolves once BS is fully ready. The init callback is used rather than resolving immediately so that `startViteWatcher()` only runs after the proxy is confirmed live.

**Returns:** `Promise<void>`

---

### `startViteWatcher()` *(private)*

Starts Vite in watch mode using the project's `vite.config.js`. Listens to the Rollup watcher event stream and maps events to actions:

| Event code | Action |
|---|---|
| `START` | Logs "Rebuilding..." |
| `BUNDLE_END` | Logs build duration, calls `bs.reload()`, releases bundle from memory |
| `ERROR` | Logs the error |

`configFile` is resolved relative to the project root (one level above `scripts/`) so the correct Vite config is always found regardless of working directory.

**Returns:** `Promise<RollupWatcher>`
