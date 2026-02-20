import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, statSync, createWriteStream, rmSync } from 'fs';
import { globSync } from 'glob';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import archiver from 'archiver';
import { ensureDir, getFileName, getDirectoryPath, logSuccess, logError, logInfo, formatFileCount } from './helpers.js';

// ============================================================================
// PROJECT DETAILS
// ============================================================================

const details = JSON.parse(readFileSync('./project-details.json', 'utf-8'));
const { project, version, author, company, url, email, description } = details;

export { project, version, author, company, url, email, description };

// ============================================================================
// ASSET COPY FUNCTIONS
// ============================================================================

// Copy custom fonts
export function copyFonts() {
  ensureDir('./dist/fonts');

  const fonts = globSync('./src/fonts/*');
  fonts.forEach(file => {
    cpSync(file, `./dist/fonts/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(fonts, 'font')} copied!`);
}

// Copy FontAwesome assets
export function copyFontAwesome() {
  ensureDir('./dist/webfonts');
  ensureDir('./dist/css');

  const faFonts = globSync('./node_modules/@fortawesome/fontawesome-free/webfonts/{fa-brands-400.*,fa-solid-900.*,fa-regular-400.*}');
  faFonts.forEach(file => {
    cpSync(file, `./dist/webfonts/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(faFonts, 'FontAwesome 7 font')} copied!`);

  const faCss = globSync('./node_modules/@fortawesome/fontawesome-free/css/all.min.css');
  faCss.forEach(file => {
    cpSync(file, `./dist/css/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(faCss, 'FontAwesome 7 CSS')} copied!`);
}

// Copy Bootstrap JS
export function copyBootstrapJs() {
  ensureDir('./dist/js');

  const bsFiles = globSync('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.*');
  bsFiles.forEach(file => {
    cpSync(file, `./dist/js/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(bsFiles, 'Bootstrap 5 JS')} copied!`);
}

// Process images
export function processImages() {
  ensureDir('./dist/images');

  const images = globSync('./src/images/**/*.{jpg,jpeg,png,gif,svg,webp}');
  images.forEach(file => {
    const relativePath = file.replace('./src/images/', '');
    const destPath = `./dist/images/${relativePath}`;
    ensureDir(getDirectoryPath(destPath));
    cpSync(file, destPath);
  });
  logSuccess(`${formatFileCount(images, 'image')} copied!`);
}

// Copy DNN containers
export function copyContainers() {
  const containersDir = `../../Containers/${project}`;
  ensureDir(containersDir);

  const containers = globSync('./containers/*');
  containers.forEach(file => {
    cpSync(file, `${containersDir}/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(containers, 'container')} copied!`);
}

// ============================================================================
// MANIFEST GENERATION
// ============================================================================

/**
 * Generate manifest.dnn from the XML template in build-resources/.
 *
 * Instead of regex string replacement, we parse the template as proper XML,
 * inject project-details values into the correct nodes, then serialize back.
 * The template no longer needs {{PLACEHOLDER}} tokens — they have been removed.
 */
export function updateManifest(outputPath = './manifest.dnn') {
  const templatePath = './build-resources/manifest.template.dnn';
  const templateXml  = readFileSync(templatePath, 'utf-8');

  // Parser: keep attributes, handle self-closing tags, preserve comments
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
    parseAttributeValue: false,
    cdataPropName: '__cdata',
    commentPropName: '__comment',
    isArray: (name) => ['component', 'resourceFile', 'skinFile', 'node', 'mimeMap', 'remove'].includes(name),
  });

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
    indentBy: '  ',
    suppressEmptyNode: false,
    cdataPropName: '__cdata',
    commentPropName: '__comment',
  });

  const doc = parser.parse(templateXml);

  // Navigate to the <package> node and inject values
  const pkg = doc.dotnetnuke.packages.package;

  pkg['@_name']    = `${company}.${project}`;
  pkg['@_version'] = version;
  pkg.friendlyName = project;
  pkg.description  = description;

  const owner      = pkg.owner;
  owner.name       = author;
  owner.organization = company;
  owner.url        = url;
  owner.email      = email;

  // Inject {{PROJECT}} into basePath and skinName fields throughout <components>
  // We walk every component and fix up any remaining path references.
  const components = pkg.components.component;
  components.forEach(component => {
    if (component.skinFiles) {
      component.skinFiles.basePath = `Portals\\_default\\Skins\\${project}\\`;
      component.skinFiles.skinName = project;
    }
    if (component.resourceFiles) {
      component.resourceFiles.basePath = component.resourceFiles.basePath.includes('Containers')
        ? `Portals\\_default\\Containers\\${project}\\`
        : `Portals\\_default\\Skins\\${project}\\`;
    }
  });

  const outputXml = `<?xml version="1.0" encoding="utf-8" ?>\n` + builder.build(doc);
  writeFileSync(outputPath, outputXml, 'utf-8');

  logSuccess(`manifest.dnn generated from build-resources/manifest.template.dnn`);
}

// ============================================================================
// DNN PACKAGING FUNCTIONS
// ============================================================================

/**
 * Create a zip archive from a glob pattern or array of file paths.
 */
function createZip(src, dest) {
  return new Promise((resolve, reject) => {
    const output  = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    if (typeof src === 'string') {
      // Glob pattern — preserve the full relative path (e.g. dist/css/style.min.css)
      // so the zip structure matches what DNN expects based on the skin's includes.
      globSync(src).forEach(file => {
        if (statSync(file).isFile()) {
          archive.file(file, { name: file.replace(/^\.\//, '') });
        }
      });
    } else {
      // Explicit file list — use bare filenames as zip entry names
      src.forEach(file => archive.file(file, { name: getFileName(file) }));
    }

    archive.finalize();
  });
}

/**
 * Build cont.zip with container files flat at the zip root (no containers/ parent folder).
 * archive.directory(src, false) adds the directory's contents directly, not the folder itself.
 */
function buildContZip(dest) {
  return new Promise((resolve, reject) => {
    const output  = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    if (existsSync('./containers')) {
      archive.directory('./containers', false);
    }

    archive.finalize();
  });
}

/**
 * Build else.zip, preserving the original folder structure.
 *
 * - menus/desktop/** and menus/mobile/** → menus/desktop/, menus/mobile/ inside zip
 * - partials/*                           → partials/ inside zip
 * - root-level .ascx, .xml, .html, etc. → zip root
 */
function buildElseZip(dest) {
  return new Promise((resolve, reject) => {
    const output  = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    // Directories — added with their folder name so structure is preserved
    if (existsSync('./menus')) {
      archive.directory('./menus', 'menus');
    }
    if (existsSync('./partials')) {
      archive.directory('./partials', 'partials');
    }

    // Root-level skin files (default.ascx, etc.) — added flat to zip root
    globSync('./*.{ascx,xml,html,htm}').forEach(file => {
      archive.file(file, { name: getFileName(file) });
    });

    // koi.json if present
    if (existsSync('./koi.json')) {
      archive.file('./koi.json', { name: 'koi.json' });
    }

    archive.finalize();
  });
}

/**
 * Build the final DNN install package.
 *
 * Asset zips (dist, containers, else) are assembled in temp/, then bundled
 * together with the generated manifest and build-resources support files into
 * the final install zip under build/.
 *
 * build-resources/ files (manifest.dnn, *.png, themeLicense.txt,
 * themeReleaseNotes.txt) are included automatically.
 */
export function createPackage() {
  logInfo('Creating DNN theme package...');

  const tempDir  = './temp';
  const buildDir = './build';

  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true });
  mkdirSync(tempDir, { recursive: true });
  ensureDir(buildDir);

  // Generate manifest directly into temp/ — it never needs to land in the project root
  updateManifest(`${tempDir}/manifest.dnn`);

  return Promise.all([
    createZip('./dist/**/*', `${tempDir}/dist.zip`),
    buildContZip(`${tempDir}/cont.zip`),
    buildElseZip(`${tempDir}/else.zip`),
  ]).then(() => {
    // Collect temp zips + generated manifest + build-resources support files
    // + root-level preview images (default.png, thumbnail_default.png)
    const packageFiles = [
      ...globSync('./temp/*.zip'),
      `${tempDir}/manifest.dnn`,
      ...globSync('./build-resources/*.{png,jpg,txt}'),
      ...globSync('./*.{png,jpg}'),
    ];

    return createZip(packageFiles, `${buildDir}/${project}_${version}_install.zip`);
  }).then(() => {
    rmSync(tempDir, { recursive: true });
    logSuccess(`Package created: ${buildDir}/${project}_${version}_install.zip`);
  }).catch(err => {
    logError('Packaging failed', err);
    throw err;
  });
}
