import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  cpSync,
  statSync,
  createWriteStream,
  rmSync,
} from 'fs';
import { globSync } from 'glob';
import archiver from 'archiver';

// ============================================================================
// TYPES
// ============================================================================

interface ProjectDetails {
  project: string;
  version: string;
  author: string;
  company: string;
  url: string;
  email: string;
  description: string;
}

// ============================================================================
// PROJECT DETAILS
// ============================================================================

const details: ProjectDetails = JSON.parse(
  readFileSync('./project-details.json', 'utf-8')
);

export const { project, version, author, company, url, email, description } = details;

// ============================================================================
// ASSET COPY FUNCTIONS
// ============================================================================

/** Copy custom fonts from src/fonts into dist/fonts. */
export function copyFonts(): void {
  const fontsDir = './dist/fonts';
  if (!existsSync(fontsDir)) {
    mkdirSync(fontsDir, { recursive: true });
  }

  const fonts = globSync('./src/fonts/*');
  fonts.forEach((file) => {
    const fileName = file.split('/').pop()!;
    cpSync(file, `${fontsDir}/${fileName}`);
  });
  console.log(`${fonts.length} font files copied!`);
}

/** Copy FontAwesome webfonts and CSS into dist. */
export function copyFontAwesome(): void {
  const webfontsDir = './dist/webfonts';
  if (!existsSync(webfontsDir)) {
    mkdirSync(webfontsDir, { recursive: true });
  }

  const faFonts = globSync(
    './node_modules/@fortawesome/fontawesome-free/webfonts/{fa-brands-400.*,fa-solid-900.*,fa-regular-400.*}'
  );
  faFonts.forEach((file) => {
    const fileName = file.split('/').pop()!;
    cpSync(file, `${webfontsDir}/${fileName}`);
  });
  console.log(`${faFonts.length} FontAwesome font files copied!`);

  const cssDir = './dist/css';
  if (!existsSync(cssDir)) {
    mkdirSync(cssDir, { recursive: true });
  }

  const faCss: string[] = [
    './node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  ];

  faCss.forEach((file) => {
    if (existsSync(file)) {
      const fileName = file.split('/').pop()!;
      cpSync(file, `${cssDir}/${fileName}`);
    }
  });
  console.log('FontAwesome CSS files copied!');
}

/** Copy Bootstrap JS bundle into dist/js. */
export function copyBootstrapJs(): void {
  const jsDir = './dist/js';
  if (!existsSync(jsDir)) {
    mkdirSync(jsDir, { recursive: true });
  }

  const bsFiles = globSync('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.*');
  bsFiles.forEach((file) => {
    const fileName = file.split('/').pop()!;
    cpSync(file, `${jsDir}/${fileName}`);
  });
  console.log(`${bsFiles.length} Bootstrap JS files copied!`);
}

/** Copy and flatten images from src/images into dist/images, preserving subdirectories. */
export function processImages(): void {
  const imagesDir = './dist/images';
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
  }

  const images = globSync('./src/images/**/*.{jpg,jpeg,png,gif,svg,webp}');
  images.forEach((file) => {
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

/** Copy DNN container files into the Containers directory alongside the theme. */
export function copyContainers(): void {
  const containersDir = `../../Containers/${project}`;
  if (!existsSync(containersDir)) {
    mkdirSync(containersDir, { recursive: true });
  }

  const containers = globSync('./containers/*');
  containers.forEach((file) => {
    const fileName = file.split('/').pop()!;
    cpSync(file, `${containersDir}/${fileName}`);
  });
  console.log(`${containers.length} container files copied!`);
}

/** Generate manifest.dnn by replacing placeholders in the template file. */
export function updateManifest(): void {
  const template = readFileSync('./manifest.template.dnn', 'utf-8');

  const replacements: Record<string, string> = {
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
// PACKAGING FUNCTIONS
// ============================================================================

type ZipSource = string | string[];

/**
 * Create a zip archive from a glob pattern or an explicit list of file paths.
 *
 * @param src  - A glob string or an array of absolute/relative file paths
 * @param dest - Output path for the resulting zip file
 */
function createZip(src: ZipSource, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(dest);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    if (typeof src === 'string') {
      const files = globSync(src);
      files.forEach((file) => {
        if (statSync(file).isFile()) {
          archive.file(file, { name: file.replace(/^\.\/[^/]+\//, '') });
        }
      });
    } else {
      src.forEach((file) => {
        const fileName = file.replace(/^.*[/\\]/, '');
        archive.file(file, { name: fileName });
      });
    }

    void archive.finalize();
  });
}

/**
 * Copy miscellaneous skin files (menus, partials, ascx, etc.) into a temp
 * directory, then zip them as else.zip.
 */
function copyElseFiles(): Promise<void> {
  const tempDir = './temp';
  const files = globSync('{./menus/**/*,./partials/*,*.{ascx,xml,html,htm},koi.json}');

  files.forEach((file) => {
    if (!existsSync(file)) return;

    const stats = statSync(file);
    const fileName = file.split('/').pop()!;
    const destPath = `${tempDir}/${fileName}`;

    if (stats.isDirectory()) {
      cpSync(file, destPath, { recursive: true });
    } else {
      cpSync(file, destPath);
    }
  });

  return createZip(`${tempDir}/*`, `${tempDir}/else.zip`).then(() => {
    // Remove individual files; keep only the zip
    files.forEach((file) => {
      const fileName = file.split('/').pop()!;
      const tempFile = `${tempDir}/${fileName}`;
      if (existsSync(tempFile)) {
        rmSync(tempFile, { recursive: true });
      }
    });
  });
}

/**
 * Build and assemble the complete DNN install package zip.
 * Expects Vite to have already produced a dist/ folder.
 */
export function createPackage(): Promise<void> {
  console.log('Creating DNN theme package...');

  const tempDir = './temp';
  const buildDir = './build';

  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
  mkdirSync(tempDir, { recursive: true });

  if (!existsSync(buildDir)) {
    mkdirSync(buildDir, { recursive: true });
  }

  return Promise.all([
    createZip('./dist/**/*', `${tempDir}/dist.zip`),
    createZip('./containers/**/*', `${tempDir}/cont.zip`),
    copyElseFiles(),
  ])
    .then(() => {
      const files = globSync('./temp/*.zip').concat(
        globSync('./*.{dnn,png,jpg,txt}')
      );
      return createZip(files, `${buildDir}/${project}_${version}_install.zip`);
    })
    .then(() => {
      rmSync(tempDir, { recursive: true });
      console.log(`\n✅ Package created: ${buildDir}/${project}_${version}_install.zip\n`);
    });
}
