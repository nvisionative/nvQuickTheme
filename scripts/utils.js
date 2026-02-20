import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, statSync, createWriteStream, rmSync } from 'fs';
import { globSync } from 'glob';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import archiver from 'archiver';
import { ensureDir, getFileName, getDirectoryPath, logSuccess, logError, logInfo, formatFileCount } from './helpers.js';

const details = JSON.parse(readFileSync('./project-details.json', 'utf-8'));
const { project, version, author, company, url, email, description } = details;

export { project, version, author, company, url, email, description };

export function copyFonts() {
  ensureDir('./dist/fonts');

  const fonts = globSync('./src/fonts/*');
  fonts.forEach(file => {
    cpSync(file, `./dist/fonts/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(fonts, 'font')} copied!`);
}

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

export function copyBootstrapJs() {
  ensureDir('./dist/js');

  const bsFiles = globSync('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.*');
  bsFiles.forEach(file => {
    cpSync(file, `./dist/js/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(bsFiles, 'Bootstrap 5 JS')} copied!`);
}

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

export function copyContainers() {
  const containersDir = `../../Containers/${project}`;
  ensureDir(containersDir);

  const containers = globSync('./containers/*');
  containers.forEach(file => {
    cpSync(file, `${containersDir}/${getFileName(file)}`);
  });
  logSuccess(`${formatFileCount(containers, 'container')} copied!`);
}

export function updateManifest(outputPath = './manifest.dnn') {
  const templateXml = readFileSync('./build-resources/manifest.template.dnn', 'utf-8');

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
  const pkg = doc.dotnetnuke.packages.package;

  pkg['@_name']      = `${company}.${project}`;
  pkg['@_version']   = version;
  pkg.friendlyName   = project;
  pkg.description    = description;

  const owner        = pkg.owner;
  owner.name         = author;
  owner.organization = company;
  owner.url          = url;
  owner.email        = email;

  pkg.components.component.forEach(component => {
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

  writeFileSync(outputPath, `<?xml version="1.0" encoding="utf-8" ?>\n` + builder.build(doc), 'utf-8');
  logSuccess(`manifest.dnn generated from build-resources/manifest.template.dnn`);
}

function createZip(src, dest) {
  return new Promise((resolve, reject) => {
    const output  = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    if (typeof src === 'string') {
      globSync(src).forEach(file => {
        if (statSync(file).isFile()) {
          archive.file(file, { name: file.replace(/^\.\//, '') });
        }
      });
    } else {
      src.forEach(file => archive.file(file, { name: getFileName(file) }));
    }

    archive.finalize();
  });
}

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

function buildElseZip(dest) {
  return new Promise((resolve, reject) => {
    const output  = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);

    if (existsSync('./menus'))    archive.directory('./menus',    'menus');
    if (existsSync('./partials')) archive.directory('./partials', 'partials');

    globSync('./*.{ascx,xml,html,htm}').forEach(file => {
      archive.file(file, { name: getFileName(file) });
    });

    if (existsSync('./koi.json')) archive.file('./koi.json', { name: 'koi.json' });

    archive.finalize();
  });
}

export function createPackage() {
  logInfo('Creating DNN theme package...');

  const tempDir  = './temp';
  const buildDir = './build';

  if (existsSync(tempDir)) rmSync(tempDir, { recursive: true });
  mkdirSync(tempDir, { recursive: true });
  ensureDir(buildDir);

  updateManifest(`${tempDir}/manifest.dnn`);

  return Promise.all([
    createZip('./dist/**/*',       `${tempDir}/dist.zip`),
    buildContZip(`${tempDir}/cont.zip`),
    buildElseZip(`${tempDir}/else.zip`),
  ]).then(() => {
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
