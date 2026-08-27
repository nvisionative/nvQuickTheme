# postbuild.js

A Vite plugin that runs asset copy tasks automatically after every build — whether triggered by `npm run build`, `npm run watch`, or `npm run serve`.

The plugin hooks into Vite's `closeBundle` lifecycle event, which fires after all output files have been written to `dist/`.

---

## `postBuild()`

Returns a Vite plugin object. Register it in `vite.config.js` under `plugins`.

Tasks run in order on every build:

| Task | Function |
|---|---|
| Copy custom fonts | `copyFonts()` |
| Copy FontAwesome webfonts and CSS | `copyFontAwesome()` |
| Copy Bootstrap JS | `copyBootstrapJs()` |
| Process and copy images | `processImages()` |
| Copy containers to DNN path | `copyContainers()` |

Manifest generation is intentionally excluded — it only runs during `npm run package` via `createPackage()`.

If any task throws, the error is logged and re-thrown to fail the build visibly.

---
---

# build.js

Runs a single one-time Vite production build.

**Command:** `npm run build`

Calls Vite's `build()` with the project's `vite.config.js`. On completion, the `postBuild` plugin runs the asset copy tasks automatically. Exits with code `1` on failure.

---
---

# watch.js

Runs Vite in watch mode for development without a browser proxy.

**Command:** `npm run watch`

Starts Vite with `build.watch` enabled. Vite rebuilds automatically whenever a source file changes. The `postBuild` plugin runs after each rebuild. No browser interaction — use `npm run serve` if you want live reload.

---
---

# clean.js

Deletes all generated output directories.

**Command:** `npm run clean`

Removes the following directories if they exist:

| Directory | Contents |
|---|---|
| `dist/` | Compiled and copied build assets |
| `temp/` | Packaging staging area |
| `build/` | Final DNN install packages |

Safe to run at any time. Does nothing for directories that don't exist.

---
---

# package.js

Runs a full production build and then creates the DNN install package.

**Command:** `npm run package`

Steps in order:

1. Calls Vite's `build()` — compiles assets, runs `postBuild` asset copy tasks
2. Calls `createPackage()` from `utils.js` — generates the manifest, zips all components, and assembles the final install zip

**Output:** `build/{project}_{version}_install.zip`

See [`utils.md`](utils.md) for full detail on what `createPackage()` produces.
