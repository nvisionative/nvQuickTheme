# nvQuickTheme Build System

A Node.js build environment for DNN themes. Compiles SCSS, bundles and minifies JavaScript, copies third-party assets, and packages everything into a DNN-installable zip.

## Commands

| Command | Description |
|---|---|
| `npm run build` | One-time production build |
| `npm run watch` | Rebuild automatically on file changes (no browser) |
| `npm run serve` | Rebuild + Browser-Sync proxy with live reload |
| `npm run package` | Build and create the DNN install package |
| `npm run clean` | Delete `dist/`, `temp/`, and `build/` |

## Project Configuration

All project metadata lives in `project-details.json`:

```json
{
  "project":     "MyTheme",
  "version":     "1.0.0",
  "author":      "Your Name",
  "company":     "Your Company",
  "url":         "yoursite.com",
  "email":       "you@yoursite.com",
  "description": "A custom DNN theme"
}
```

This is the single source of truth — the manifest, package filename, and container output path are all derived from it.

## Dev Server Configuration

`serve.config.js` controls the development server:

```js
export default {
  dnnUrl:      'https://mysite.loc', // Your local DNN site URL (http or https)
  port:        3000,                 // Port Browser-Sync listens on
  watchPaths:  ['dist/**/*', ...],   // Paths BS monitors (unused for reload triggering)
  sourcePaths: ['src/**/*'],         // Paths Vite watches for rebuilds
  debounce:    300,
};
```

The scheme (`http`/`https`) is derived automatically from `dnnUrl` and applied to the local Browser-Sync URL.

## Scripts

| File | Purpose |
|---|---|
| [`build.js`](build.md) | Runs a one-time Vite production build |
| [`watch.js`](watch.md) | Runs Vite in watch mode |
| [`serve.js`](serve.md) | Starts Browser-Sync + Vite watcher for live development |
| [`package.js`](package.md) | Builds and creates the DNN install zip |
| [`clean.js`](clean.md) | Removes generated directories |
| [`postbuild.js`](postbuild.md) | Vite plugin that runs asset copy tasks after each build |
| [`utils.js`](utils.md) | All build utility and packaging functions |
| [`helpers.js`](helpers.md) | Small reusable utility functions |

## Output Structure

After a build, `dist/` contains:

```
dist/
  css/
    style.min.css        ← Compiled SCSS
    all.min.css          ← FontAwesome
  js/
    custom.min.js        ← Bundled JS entry point
    bootstrap.bundle.min.js
  fonts/                 ← Custom fonts from src/fonts/
  webfonts/              ← FontAwesome webfonts
  images/                ← Processed images from src/images/
```

After `npm run package`, `build/` contains the final install zip:

```
build/
  MyTheme_1.0.0_install.zip
    ├── manifest.dnn
    ├── themeLicense.txt
    ├── themeReleaseNotes.txt
    ├── default.png
    ├── thumbnail_default.png
    ├── dist.zip           ← dist/ folder
    ├── cont.zip           ← containers/ folder (flat)
    └── else.zip           ← menus/, partials/, root .ascx files
```
