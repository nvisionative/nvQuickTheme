# vite.config.js

Vite configuration for the DNN theme build. Handles SCSS compilation, JavaScript bundling and minification, and output file naming. All build logic lives in `scripts/` — this file is configuration only.

---

## Source & Output

| Option | Value | Description |
|---|---|---|
| `root` | `./src` | Vite treats `src/` as the project root, so all source paths are relative to it |
| `base` | `./` | Asset URLs in output are relative, not absolute |
| `build.outDir` | `../dist` | Output resolves to `dist/` relative to the project root |
| `build.emptyOutDir` | `true` | Clears `dist/` before each build |

---

## JavaScript

Configured in `lib` mode with a single entry point.

| Option | Value | Description |
|---|---|---|
| `lib.entry` | `src/js/custom.js` | The single JS entry point |
| `lib.name` | `custom` | Library name |
| `lib.formats` | `['es']` | Output as an ES module |
| `lib.fileName` | `js/custom.min.js` | Fixed output filename |
| `lib.cssFileName` | `css/style.min.css` | Fixed CSS output filename |

**Adding more JS files:** Import them into `custom.js`. Rollup will bundle everything into the single `custom.min.js` output. The SCSS entry must also stay in `custom.js` — removing it stops Vite from processing the stylesheet.

```js
// src/js/custom.js
import '../scss/style.scss'; // must stay — triggers CSS pipeline

import './customMenu.js';
```

---

## CSS / SCSS

| Option | Value | Description |
|---|---|---|
| `css.preprocessorOptions.scss.includePaths` | `['./node_modules']` | Allows SCSS to `@use` packages directly by name without relative paths |
| `build.cssMinify` | `true` | Minifies the CSS output |

SCSS compilation is triggered by the `import '../scss/style.scss'` in `custom.js`. The compiled output is written to `dist/css/style.min.css`.

---

## Output File Naming

| File type | Pattern | Example |
|---|---|---|
| JS entry | `js/[name].min.js` | `dist/js/custom.min.js` |
| CSS | `css/style.min.css` | `dist/css/style.min.css` |
| Other assets | `assets/[name][extname]` | `dist/assets/logo.svg` |

CSS naming is handled in `assetFileNames` — any asset ending in `.css` is routed to `css/` with the `.min.css` suffix regardless of its original name.

---

## Minification

| Option | Value | Description |
|---|---|---|
| `build.minify` | `'terser'` | Uses Terser for JS minification |
| `build.sourcemap` | `true` | Generates `.map` files alongside JS output |
| `build.cssMinify` | `true` | Minifies CSS output |

---

## Plugins

| Plugin | Source | Description |
|---|---|---|
| `postBuild()` | `scripts/postbuild.js` | Runs after every build — copies fonts, FontAwesome, Bootstrap JS, images, and containers to `dist/` |

See [`postbuild.md`](postbuild.md) for full details on what `postBuild()` does.
