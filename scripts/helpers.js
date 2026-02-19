/**
 * Helper Functions for DNN Theme Build System
 * 
 * This file contains small, reusable utility functions used throughout
 * the build scripts. These functions handle common operations like
 * directory creation, path manipulation, and file operations.
 */

import { existsSync, mkdirSync } from 'fs';

// ============================================================================
// DIRECTORY HELPERS
// ============================================================================

/**
 * Ensure a directory exists, create it if it doesn't
 * Creates parent directories as needed (recursive)
 * 
 * @param {string} dir - Directory path to ensure exists
 * @returns {void}
 * 
 * @example
 * ensureDir('./dist/css');
 * ensureDir('./dist/images/icons');  // Creates all parent folders
 */
export function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============================================================================
// PATH HELPERS
// ============================================================================

/**
 * Extract filename from a file path
 * Works on both Windows (backslash) and Unix (forward slash) paths
 * 
 * @param {string} filePath - Full file path
 * @returns {string} Just the filename with extension
 * 
 * @example
 * getFileName('./src/fonts/MyFont.woff2')  // → 'MyFont.woff2'
 * getFileName('C:\\Users\\files\\logo.png')  // → 'logo.png'
 * getFileName('/home/user/image.jpg')      // → 'image.jpg'
 */
export function getFileName(filePath) {
  return filePath.replace(/^.*[\/\\]/, '');
}

/**
 * Get the directory path from a file path
 * Removes the filename, leaving just the directory
 * 
 * @param {string} filePath - Full file path
 * @returns {string} Directory path without filename
 * 
 * @example
 * getDirectoryPath('./dist/images/icons/heart.svg')  // → './dist/images/icons'
 * getDirectoryPath('C:\\dist\\css\\main.css')        // → 'C:\\dist\\css'
 */
export function getDirectoryPath(filePath) {
  return filePath.substring(0, filePath.lastIndexOf('/'));
}

// ============================================================================
// FILE EXTENSION HELPERS
// ============================================================================

/**
 * Check if a file has a specific extension
 * Case-insensitive comparison
 * 
 * @param {string} fileName - Filename or path
 * @param {string} extension - Extension to check (with or without dot)
 * @returns {boolean} True if file has the extension
 * 
 * @example
 * hasExtension('styles.css', '.css')   // → true
 * hasExtension('styles.css', 'css')    // → true
 * hasExtension('styles.CSS', '.css')   // → true
 * hasExtension('image.jpg', '.png')    // → false
 */
export function hasExtension(fileName, extension) {
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return fileName.toLowerCase().endsWith(ext.toLowerCase());
}

/**
 * Get the file extension from a filename
 * 
 * @param {string} fileName - Filename or path
 * @returns {string} Extension with dot (e.g., '.css')
 * 
 * @example
 * getExtension('styles.css')      // → '.css'
 * getExtension('image.min.js')    // → '.js'
 * getExtension('./dist/file.woff2')  // → '.woff2'
 */
export function getExtension(fileName) {
  const match = fileName.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

// ============================================================================
// LOGGING HELPERS
// ============================================================================

/**
 * Log a success message with emoji
 * 
 * @param {string} message - Message to log
 * @returns {void}
 * 
 * @example
 * logSuccess('Files copied!');  // → ✅ Files copied!
 */
export function logSuccess(message) {
  console.log(`✅ ${message}`);
}

/**
 * Log an error message with emoji
 * 
 * @param {string} message - Message to log
 * @param {Error} [error] - Optional error object
 * @returns {void}
 * 
 * @example
 * logError('Build failed!');
 * logError('Copy failed', error);
 */
export function logError(message, error) {
  if (error) {
    console.error(`❌ ${message}:`, error.message);
  } else {
    console.error(`❌ ${message}`);
  }
}

/**
 * Log an info message with emoji
 * 
 * @param {string} message - Message to log
 * @returns {void}
 * 
 * @example
 * logInfo('Starting build...');  // → 🔧 Starting build...
 */
export function logInfo(message) {
  console.log(`🔧 ${message}`);
}

/**
 * Log a warning message with emoji
 * 
 * @param {string} message - Message to log
 * @returns {void}
 * 
 * @example
 * logWarning('File not found, skipping...');  // → ⚠️ File not found, skipping...
 */
export function logWarning(message) {
  console.warn(`⚠️ ${message}`);
}

// ============================================================================
// ARRAY HELPERS
// ============================================================================

/**
 * Count files and return a formatted message
 * 
 * @param {string[]} files - Array of file paths
 * @param {string} label - Description of files (e.g., 'font', 'image')
 * @returns {string} Formatted count message
 * 
 * @example
 * formatFileCount(['a.woff', 'b.woff'], 'font')  // → '2 font files'
 * formatFileCount(['logo.png'], 'image')         // → '1 image file'
 */
export function formatFileCount(files, label) {
  const count = files.length;
  return `${count} ${label} file${count === 1 ? '' : 's'}`;
}

// ============================================================================
// OBJECT HELPERS
// ============================================================================

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 * 
 * @example
 * isEmpty(null)        // → true
 * isEmpty(undefined)   // → true
 * isEmpty('')          // → true
 * isEmpty([])          // → true
 * isEmpty({})          // → true
 * isEmpty('hello')     // → false
 * isEmpty([1, 2])      // → false
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
