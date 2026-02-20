# utils.js

Core build utilities. Handles all asset copying, manifest generation, zip creation, and final DNN package assembly. Functions are called by `postbuild.js` during every build, and by `package.js` at release time.

Project metadata is loaded once at module load from `project-details.json` and exported for use in other scripts.

---

## Exports

### Project Details

The following values are read from `project-details.json` and re-exported:

| Export | Description |
|---|---|
| `project` | Theme name, used in paths and the package filename |
| `version` | Semver string, used in the package filename |
| `author` | Author name, written into the manifest |
| `company` | Company name, used as the manifest package name prefix |
| `url` | Author URL, written into the manifest |
| `email` | Author email, written into the manifest |
| `description` | Theme description, written into the manifest |

---

## Asset Copy Functions

These run after every Vite build via `postbuild.js`.

### `copyFonts()`

Copies all files from `src/fonts/` to `dist/fonts/`. Creates the destination directory if needed.

```
src/fonts/OpenSans-Regular.woff2  →  dist/fonts/OpenSans-Regular.woff2
```

---

### `copyFontAwesome()`

Copies FontAwesome webfonts and CSS from `node_modules` to `dist/`.

| Source | Destination |
|---|---|
| `node_modules/@fortawesome/.../webfonts/fa-brands-400.*` | `dist/webfonts/` |
| `node_modules/@fortawesome/.../webfonts/fa-solid-900.*` | `dist/webfonts/` |
| `node_modules/@fortawesome/.../webfonts/fa-regular-400.*` | `dist/webfonts/` |
| `node_modules/@fortawesome/.../css/all.min.css` | `dist/css/` |

---

### `copyBootstrapJs()`

Copies the Bootstrap bundle (JS + map) from `node_modules` to `dist/js/`.

```
node_modules/bootstrap/dist/js/bootstrap.bundle.min.js   →  dist/js/
node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map  →  dist/js/
```

---

### `processImages()`

Copies all images from `src/images/` to `dist/images/`, preserving subdirectory structure. Supported formats: `jpg`, `jpeg`, `png`, `gif`, `svg`, `webp`.

```
src/images/hero/banner.jpg  →  dist/images/hero/banner.jpg
```

---

### `copyContainers()`

Copies container files from `containers/` to the DNN containers directory two levels up from the project root. The destination folder is named after the project.

```
containers/MyContainer.ascx  →  ../../Containers/MyTheme/MyContainer.ascx
```

This path assumes the theme project lives inside `Portals/_default/Skins/MyTheme/` within the DNN installation.

---

## Manifest Generation

### `updateManifest(outputPath?)`

Parses `build-resources/manifest.template.dnn` as XML, injects all project details from `project-details.json`, and writes the completed manifest to `outputPath`.

| Param | Type | Default | Description |
|---|---|---|---|
| `outputPath` | `string` | `'./manifest.dnn'` | Where to write the generated manifest |

The following fields are injected:

| Manifest field | Source |
|---|---|
| `package[name]` attribute | `company.project` |
| `package[version]` attribute | `version` |
| `friendlyName` | `project` |
| `description` | `description` |
| `owner > name` | `author` |
| `owner > organization` | `company` |
| `owner > url` | `url` |
| `owner > email` | `email` |
| All `skinFiles > basePath` | `Portals\_default\Skins\{project}\` |
| All `skinFiles > skinName` | `project` |
| Skin `resourceFiles > basePath` | `Portals\_default\Skins\{project}\` |
| Container `resourceFiles > basePath` | `Portals\_default\Containers\{project}\` |

During `npm run package`, this is called with `temp/manifest.dnn` as the output path so the manifest never touches the project root.

---

## Packaging Functions

These are internal to `utils.js` and called only by `createPackage()`.

### `createZip(src, dest)` *(private)*

Creates a zip file from either a glob pattern or an explicit array of file paths.

- **Glob pattern** — all matched files are added with their full relative path preserved (e.g. `dist/css/style.min.css` stays as `dist/css/style.min.css` inside the zip).
- **File array** — each file is added using its bare filename at the zip root.

| Param | Type | Description |
|---|---|---|
| `src` | `string \| string[]` | Glob pattern or array of file paths |
| `dest` | `string` | Output zip path |

**Returns:** `Promise<void>`

---

### `buildContZip(dest)` *(private)*

Creates `cont.zip` from the `containers/` directory. Files are added flat at the zip root (no `containers/` parent folder) because DNN extracts this zip directly into the containers destination.

| Param | Type | Description |
|---|---|---|
| `dest` | `string` | Output zip path |

**Returns:** `Promise<void>`

---

### `buildElseZip(dest)` *(private)*

Creates `else.zip` from the skin's non-dist files, preserving folder structure:

| Source | Zip path |
|---|---|
| `menus/**/*` | `menus/...` |
| `partials/*` | `partials/...` |
| `*.ascx`, `*.xml`, `*.html`, `*.htm` | zip root |
| `koi.json` (if present) | zip root |

| Param | Type | Description |
|---|---|---|
| `dest` | `string` | Output zip path |

**Returns:** `Promise<void>`

---

### `createPackage()`

Orchestrates the full DNN install package build. Steps in order:

1. Cleans and recreates `temp/`
2. Generates `manifest.dnn` into `temp/`
3. In parallel: creates `dist.zip`, `cont.zip`, and `else.zip` in `temp/`
4. Assembles the final install zip in `build/` from all temp zips, the manifest, `build-resources/` support files, and root-level preview images
5. Cleans up `temp/`

**Output:** `build/{project}_{version}_install.zip`

The final zip contains:

| File | Source |
|---|---|
| `manifest.dnn` | Generated by `updateManifest()` |
| `themeLicense.txt` | `build-resources/` |
| `themeReleaseNotes.txt` | `build-resources/` |
| `default.png` | Project root |
| `thumbnail_default.png` | Project root |
| `dist.zip` | Built assets |
| `cont.zip` | Container files |
| `else.zip` | Menus, partials, skin files |
