import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync, statSync } from 'fs';
import { globSync } from 'glob';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

// Load project details
const details = JSON.parse(readFileSync('./project-details.json', 'utf-8'));
const { project, version, author, company, url, email, description } = details;

export { project, version, author, company, url, email, description };

// Copy custom fonts
export function copyFonts() {
  const fontsDir = './dist/fonts';
  if (!existsSync(fontsDir)) {
    mkdirSync(fontsDir, { recursive: true });
  }
  
  const fonts = globSync('./src/fonts/*');
  fonts.forEach(file => {
    const fileName = file.split('/').pop();
    cpSync(file, `${fontsDir}/${fileName}`);
  });
  console.log(`${fonts.length} font files copied!`);
}

// Copy FontAwesome assets
export function copyFontAwesome() {
  // Copy FA webfonts
  const webfontsDir = './dist/webfonts';
  if (!existsSync(webfontsDir)) {
    mkdirSync(webfontsDir, { recursive: true });
  }
  
  const faFonts = globSync('./node_modules/@fortawesome/fontawesome-free/webfonts/{fa-brands-400.*,fa-solid-900.*,fa-regular-400.*}');
  faFonts.forEach(file => {
    const fileName = file.split('/').pop();
    cpSync(file, `${webfontsDir}/${fileName}`);
  });
  console.log(`${faFonts.length} FontAwesome 7 font files copied!`);
  
  const cssDir = './dist/css';
  if (!existsSync(cssDir)) {
    mkdirSync(cssDir, { recursive: true });
  }
  
  const faCss = [
    './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  ];
  
  faCss.forEach(file => {
    if (existsSync(file)) {
      const fileName = file.split('/').pop();
      cpSync(file, `${cssDir}/${fileName}`);
    }
  });
  console.log(`FontAwesome 7 CSS files copied!`);
}

// Copy Bootstrap JS
export function copyBootstrapJs() {
  const jsDir = './dist/js';
  if (!existsSync(jsDir)) {
    mkdirSync(jsDir, { recursive: true });
  }
  
  const bsFiles = globSync('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.*');
  bsFiles.forEach(file => {
    const fileName = file.split('/').pop();
    cpSync(file, `${jsDir}/${fileName}`);
  });
  console.log(`${bsFiles.length} Bootstrap 5.3.8 JS files copied!`);
}

// Process images
export function processImages() {
  const imagesDir = './dist/images';
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
  }
  
  const images = globSync('./src/images/**/*.{jpg,jpeg,png,gif,svg,webp}');
  images.forEach(file => {
    const relativePath = file.replace('./src/images/', '');
    const destPath = `${imagesDir}/${relativePath}`;
    const destDir = destPath.substring(0, destPath.lastIndexOf('/'));
    
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    cpSync(file, destPath);
  });
  console.log(`${images.length} images copied!`);
}

// Copy DNN containers
export function copyContainers() {
  const containersDir = `../../Containers/${project}`;
  if (!existsSync(containersDir)) {
    mkdirSync(containersDir, { recursive: true });
  }
  
  const containers = globSync('./containers/*');
  containers.forEach(file => {
    const fileName = file.split('/').pop();
    cpSync(file, `${containersDir}/${fileName}`);
  });
  console.log(`${containers.length} container files copied!`);
}

// Update DNN manifest
export function updateManifest() {
  const template = readFileSync('./manifest.template.dnn', 'utf-8');

  const replacements = {
    PACKAGE_NAME: `${company}.${project}`,
    VERSION: version,
    PROJECT: project,
    DESCRIPTION: description,
    AUTHOR: author,
    COMPANY: company,
    URL: url,
    EMAIL: email,
  };

  let output = template;

  for (const [key, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(regex, value);
  }

  writeFileSync('./manifest.dnn', output);

  console.log('DNN manifest generated from template!');
}

// ============================================================================
// DNN PACKAGING FUNCTIONS
// ============================================================================

import archiver from 'archiver';
import { createWriteStream, rmSync } from 'fs';

/**
 * Create a zip file from source files
 */
function createZip(src, dest) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));
    
    archive.pipe(output);
    
    if (typeof src === 'string') {
      const files = globSync(src);
      files.forEach(file => {
        const stats = statSync(file);
        if (stats.isFile()) {
          archive.file(file, { name: file.replace(/^\.\/[^\/]+\//, '') });
        }
      });
    } else {
      src.forEach(file => {
        const fileName = file.replace(/^.*[\/\\]/, '');
        archive.file(file, { name: fileName });
      });
    }
    
    archive.finalize();
  });
}

/**
 * Copy miscellaneous files (menus, partials, etc.) for packaging
 */
function copyElseFiles() {
  const tempDir = './temp';
  const files = globSync('{./menus/**/*,./partials/*,*.{ascx,xml,html,htm},koi.json}');
  
  files.forEach(file => {
    const stats = existsSync(file) ? statSync(file) : null;
    if (!stats) return;
    
    const fileName = file.split('/').pop();
    const destPath = `${tempDir}/${fileName}`;
    
    if (stats.isDirectory()) {
      cpSync(file, destPath, { recursive: true });
    } else {
      cpSync(file, destPath);
    }
  });
  
  return createZip(`${tempDir}/*`, `${tempDir}/else.zip`).then(() => {
    // Clean up individual files, keep only zip
    files.forEach(file => {
      const fileName = file.split('/').pop();
      const tempFile = `${tempDir}/${fileName}`;
      if (existsSync(tempFile)) {
        rmSync(tempFile, { recursive: true });
      }
    });
  });
}

/**
 * Create complete DNN install package
 */
export function createPackage() {
  console.log('Creating DNN theme package...');
  
  const tempDir = './temp';
  const buildDir = './build';
  
  // Clean and create directories
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
  mkdirSync(tempDir, { recursive: true });
  
  if (!existsSync(buildDir)) {
    mkdirSync(buildDir, { recursive: true });
  }
  
  // Create zip files
  return Promise.all([
    createZip('./dist/**/*', `${tempDir}/dist.zip`),
    createZip('./containers/**/*', `${tempDir}/cont.zip`),
    copyElseFiles(),
  ]).then(() => {
    // Create final package
    const files = globSync('./temp/*.zip').concat(globSync('./*.{dnn,png,jpg,txt}'));
    return createZip(files, `${buildDir}/${project}_${version}_install.zip`);
  }).then(() => {
    // Clean temp
    rmSync(tempDir, { recursive: true });
    console.log(`\n✅ Package created: ${buildDir}/${project}_${version}_install.zip\n`);
  });
}

