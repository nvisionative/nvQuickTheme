# helpers.js

Small, stateless utility functions used across all build scripts. No side effects — every function takes input and returns output or logs to the console.

---

## Directory

### `ensureDir(dir)`

Creates a directory if it does not already exist. Creates all intermediate parent directories as needed. Safe to call on a directory that already exists — it does nothing in that case.

| Param | Type | Description |
|---|---|---|
| `dir` | `string` | Path to the directory to create |

```js
ensureDir('./dist/css');
ensureDir('./dist/images/icons'); // creates dist/, dist/images/, dist/images/icons/
```

---

## Path

### `getFileName(filePath)`

Extracts the filename from a full path. Works with both forward slashes (Unix) and backslashes (Windows).

| Param | Type | Description |
|---|---|---|
| `filePath` | `string` | Full or relative file path |

**Returns:** `string` — filename with extension

```js
getFileName('./src/fonts/OpenSans.woff2') // → 'OpenSans.woff2'
getFileName('C:\\dist\\css\\style.css')   // → 'style.css'
```

---

### `getDirectoryPath(filePath)`

Returns the directory portion of a file path by stripping the filename.

| Param | Type | Description |
|---|---|---|
| `filePath` | `string` | Full or relative file path |

**Returns:** `string` — directory path without filename

```js
getDirectoryPath('./dist/images/icons/logo.svg') // → './dist/images/icons'
```

---

## File Extension

### `hasExtension(fileName, extension)`

Case-insensitive check for whether a file has a given extension. The leading dot is optional.

| Param | Type | Description |
|---|---|---|
| `fileName` | `string` | Filename or path |
| `extension` | `string` | Extension to check, with or without leading dot |

**Returns:** `boolean`

```js
hasExtension('style.css', '.css') // → true
hasExtension('style.CSS', 'css')  // → true
hasExtension('image.jpg', '.png') // → false
```

---

### `getExtension(fileName)`

Returns the file extension including the leading dot. Only the final extension is returned.

| Param | Type | Description |
|---|---|---|
| `fileName` | `string` | Filename or path |

**Returns:** `string` — extension with dot, or `''` if none found

```js
getExtension('style.min.css')     // → '.css'
getExtension('font.woff2')        // → '.woff2'
```

---

## Logging

All log functions prefix output with an emoji for quick visual scanning in the terminal.

### `logSuccess(message)`

Logs a success message prefixed with ✅.

```js
logSuccess('3 font files copied!') // → ✅ 3 font files copied!
```

---

### `logError(message, error?)`

Logs an error message prefixed with ❌. If an `Error` object is provided, its `.message` is appended.

| Param | Type | Description |
|---|---|---|
| `message` | `string` | Error description |
| `error` | `Error` | *(optional)* Error object |

```js
logError('Build failed')
logError('Copy failed', err) // → ❌ Copy failed: ENOENT: no such file...
```

---

### `logInfo(message)`

Logs an informational message prefixed with 🔧.

```js
logInfo('Starting build...') // → 🔧 Starting build...
```

---

### `logWarning(message)`

Logs a warning message prefixed with ⚠️.

```js
logWarning('No images found, skipping...') // → ⚠️ No images found, skipping...
```

---

## Array

### `formatFileCount(files, label)`

Returns a human-readable count string. Handles singular vs plural automatically.

| Param | Type | Description |
|---|---|---|
| `files` | `string[]` | Array of file paths |
| `label` | `string` | Noun describing the files |

**Returns:** `string`

```js
formatFileCount(['a.woff2', 'b.woff2'], 'font') // → '2 font files'
formatFileCount(['logo.png'], 'image')           // → '1 image file'
```

---

## Object

### `isEmpty(value)`

Returns `true` if the value is null, undefined, an empty string, an empty array, or an empty object.

| Param | Type | Description |
|---|---|---|
| `value` | `*` | Any value |

**Returns:** `boolean`

```js
isEmpty(null)      // → true
isEmpty([])        // → true
isEmpty({})        // → true
isEmpty('hello')   // → false
isEmpty([1, 2])    // → false
```
