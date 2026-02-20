import { existsSync, mkdirSync } from 'fs';

export function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function getFileName(filePath) {
  return filePath.replace(/^.*[\/\\]/, '');
}

export function getDirectoryPath(filePath) {
  return filePath.substring(0, filePath.lastIndexOf('/'));
}

export function hasExtension(fileName, extension) {
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return fileName.toLowerCase().endsWith(ext.toLowerCase());
}

export function getExtension(fileName) {
  const match = fileName.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

export function logSuccess(message) {
  console.log(`✅ ${message}`);
}

export function logError(message, error) {
  if (error) {
    console.error(`❌ ${message}:`, error.message);
  } else {
    console.error(`❌ ${message}`);
  }
}

export function logInfo(message) {
  console.log(`🔧 ${message}`);
}

export function logWarning(message) {
  console.warn(`⚠️ ${message}`);
}

export function formatFileCount(files, label) {
  const count = files.length;
  return `${count} ${label} file${count === 1 ? '' : 's'}`;
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
