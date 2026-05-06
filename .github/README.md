# nvQuickTheme

A modern DNN (DotNetNuke) theme development framework built on **Bootstrap 5**, **Vite**, and **SCSS**. nvQuickTheme provides a fast, opinionated starting point for building professional DNN skins with a streamlined build pipeline.

---

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- A running local DNN installation (v9.0.0 or higher)
- npm v9 or higher

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nvisionative/nvQuickTheme.git
cd nvQuickTheme
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your project

Edit `project-details.json` with your project's information:

```json
{
  "project": "MyTheme",
  "version": "1.0.0",
  "author": "Your Name",
  "company": "Your Company",
  "url": "www.yoursite.com",
  "email": "you@yoursite.com",
  "description": "A custom DNN theme"
}
```

### 4. Configure your local DNN site

Edit `serve.config.js` to point to your local DNN installation:

```js
export default {
  dnnUrl: 'http://yoursite.loc', // ← change this to your local DNN URL
  port: 3000,
  watchPaths: ['dist/**/*', 'containers/**/*', '*.ascx'],
  sourcePaths: ['src/**/*'],
  debounce: 300,
};
```

---

## Project Structure

```
nvQuickTheme/
├── containers/          # DNN container files
├── dist/                # Compiled output (generated, do not edit)
├── partials/            # DNN skin partials (.ascx)
│   ├── _header.ascx
│   ├── _footer.ascx
│   ├── _includes.ascx
│   └── _registers.ascx
├── scripts/             # Build system scripts
│   ├── build.js
│   ├── clean.js
│   ├── helpers.js
│   ├── package.js
│   ├── postbuild.js
│   ├── serve.js
│   ├── utils.js
│   └── watch.js
├── src/
│   ├── fonts/           # Custom web fonts
│   ├── images/          # Theme images
│   ├── js/              # JavaScript source files
│   │   └── custom.js    # Main JS entry point
│   └── scss/            # SCSS source files
│       ├── style.scss   # Main SCSS entry point
│       ├── variables/   # Colors, fonts, type settings
│       ├── mixins/      # SCSS mixins
│       ├── components/  # Component styles (nav, buttons, etc.)
│       └── sections/    # Section styles (header, footer)
├── default.ascx         # Main DNN skin layout
├── manifest.template.dnn
├── project-details.json
├── serve.config.js
└── vite.config.js
```

---

## npm Scripts

| Command | Description |
|---|---|
| `npm run watch` | Watch for file changes and rebuild automatically |
| `npm run serve` | Start Browser-Sync dev server with live reload |
| `npm run build` | Build theme for production |
| `npm run clean` | Remove all build output directories |
| `npm run package` | Build and create a DNN install package |

---

## Development Workflow

### Option A — Watch mode (build only)

If you're deploying files directly to a DNN installation on your local filesystem:

```bash
npm run watch
```

Vite will watch your `src/` files and rebuild to `dist/` on every change. You'll need to refresh your browser manually.

### Option B — Dev server with live reload

For a full live-reload experience via Browser-Sync:

```bash
npm run serve
```

This proxies your local DNN site (configured in `serve.config.js`) and automatically refreshes the browser whenever built files change. Your DNN site must be running before starting the server.

---

## Building for Production

```bash
npm run build
```

This compiles and minifies all SCSS and JS, copies fonts, FontAwesome assets, Bootstrap JS, and images to `dist/`, and generates `manifest.dnn` from `manifest.template.dnn`.

---

## Creating a DNN Install Package

```bash
npm run package
```

This runs a full production build and then packages everything into a DNN-installable zip file at:

```
build/MyTheme_1.0.0_install.zip
```

The package includes the compiled `dist/` assets, containers, skin partials, and the generated manifest — ready to install via the DNN Extensions module.

---

## Customization

### Colors

Edit `src/scss/variables/_colors.scss` to define your color palette. Colors are exposed as CSS custom properties and available throughout SCSS via the `color()` function:

```scss
$colors: (
  "main-shade": #ec3d46,
  "main-accent": #462a2b,
  // ...
);
```

```scss
// Usage in SCSS
background-color: colors.color('main-shade');
```

### Typography

Edit `src/scss/variables/_type.scss` for base font size, line height, and font stack settings. Custom font files belong in `src/fonts/` and should be declared in `src/scss/variables/_fonts.scss`.

### Bootstrap Overrides

Bootstrap variables (colors, breakpoints, spacing, etc.) can be overridden in `src/scss/variables/_bs-overrides.scss` before Bootstrap is compiled in.

### JavaScript

The main JS entry point is `src/js/custom.js`. Additional scripts can be added as entry points in `vite.config.js` under `rollupOptions.input`.

### Layout / Panes

The main skin layout is `default.ascx`. DNN content panes (`BannerPane`, `ContentPane`, `FluidPane`) are defined here. Add or rearrange panes to match your design.

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| Bootstrap | ^5.3.8 | CSS framework |
| FontAwesome Free | ^7.0.1 | Icon library |
| Vite | ^5.0.0 | Build tool |
| Sass | ^1.69.5 | SCSS compiler |
| Browser-Sync | ^3.0.4 | Dev server / live reload |
| Chokidar | ^5.0.0 | File watching |
| Archiver | ^6.0.1 | DNN package creation |

---

## License

GPL-3.0 — see `themeLicense.txt` for details.

---

## Credits

Designed and developed by [TK Sheppard](https://github.com/tksheppard) & [David Poindexter](https://github.com/david-poindexter) at [nvisionative](https://www.nvisionative.com).

Project site: [nvquicktheme.com](https://www.nvquicktheme.com)
