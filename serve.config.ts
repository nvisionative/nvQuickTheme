interface ServeConfig {
  /** The local DNN site URL to proxy. */
  dnnUrl: string;
  /** Port for the Browser-Sync dev server. */
  port: number;
  /** Glob patterns Browser-Sync watches for browser reload. */
  watchPaths: string[];
  /** Glob patterns chokidar watches to trigger a Vite rebuild. */
  sourcePaths: string[];
  /** Debounce delay in milliseconds before rebuilding after a file change. */
  debounce: number;
}

const config: ServeConfig = {
  dnnUrl: 'http://mysite.loc',
  port: 3000,
  watchPaths: ['dist/**/*', 'containers/**/*', '*.ascx'],
  sourcePaths: ['src/**/*'],
  debounce: 300,
};

export default config;
