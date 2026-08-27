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
 * Ensure a directory exists, create it if it doesn't.
 * Creates parent directories as needed (recursive).
 *
 * @param dir - Directory path to ensure exists
 *
 * @example
 * ensureDir('./dist/css');
 * ensureDir('./dist/images/icons');  // Creates all parent folders
 */
export function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// ============================================================================
// PATH HELPERS
// ============================================================================

/**
 * Extract filename from a file path.
 * Works on both Windows (backslash) and Unix (forward slash) paths.
 *
 * @param filePath - Full file path
 * @returns Just the filename with extension
 *
 * @example
 * getFileName('./src/fonts/MyFont.woff2')    // → 'MyFont.woff2'
 * getFileName('C:\\Users\\files\\logo.png')  // → 'logo.png'
 * getFileName('/home/user/image.jpg')        // → 'image.jpg'
 */
export function getFileName(filePath: string): string {
  return filePath.replace(/^.*[/\\]/, '');
}

/**
 * Get the directory path from a file path.
 * Removes the filename, leaving just the directory.
 *
 * @param filePath - Full file path
 * @returns Directory path without filename
 *
 * @example
 * getDirectoryPath('./dist/images/icons/heart.svg')  // → './dist/images/icons'
 * getDirectoryPath('C:\\dist\\css\\main.css')        // → 'C:\\dist\\css'
 */
export function getDirectoryPath(filePath: string): string {
  return filePath.substring(0, filePath.lastIndexOf('/'));
}

// ============================================================================
// FILE EXTENSION HELPERS
// ============================================================================

/**
 * Check if a file has a specific extension.
 * Case-insensitive comparison.
 *
 * @param fileName - Filename or path
 * @param extension - Extension to check (with or without dot)
 * @returns True if file has the extension
 *
 * @example
 * hasExtension('styles.css', '.css')  // → true
 * hasExtension('styles.css', 'css')   // → true
 * hasExtension('styles.CSS', '.css')  // → true
 * hasExtension('image.jpg', '.png')   // → false
 */
export function hasExtension(fileName: string, extension: string): boolean {
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  return fileName.toLowerCase().endsWith(ext.toLowerCase());
}

/**
 * Get the file extension from a filename.
 *
 * @param fileName - Filename or path
 * @returns Extension with dot (e.g. '.css'), or empty string if none
 *
 * @example
 * getExtension('styles.css')         // → '.css'
 * getExtension('image.min.js')       // → '.js'
 * getExtension('./dist/file.woff2')  // → '.woff2'
 */
export function getExtension(fileName: string): string {
  const match = fileName.match(/\.[^.]+$/);
  return match ? match[0] : '';
}

// ============================================================================
// LOGGING HELPERS
// ============================================================================

/**
 * Log a success message with emoji.
 *
 * @param message - Message to log
 *
 * @example
 * logSuccess('Files copied!');  // → ✅ Files copied!
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Log an error message with emoji.
 *
 * @param message - Message to log
 * @param error - Optional error object
 *
 * @example
 * logError('Build failed!');
 * logError('Copy failed', error);
 */
export function logError(message: string, error?: Error): void {
  if (error) {
    console.error(`❌ ${message}:`, error.message);
  } else {
    console.error(`❌ ${message}`);
  }
}

/**
 * Log an info message with emoji.
 *
 * @param message - Message to log
 *
 * @example
 * logInfo('Starting build...');  // → 🔧 Starting build...
 */
export function logInfo(message: string): void {
  console.log(`🔧 ${message}`);
}

/**
 * Log a warning message with emoji.
 *
 * @param message - Message to log
 *
 * @example
 * logWarning('File not found, skipping...');  // → ⚠️ File not found, skipping...
 */
export function logWarning(message: string): void {
  console.warn(`⚠️ ${message}`);
}

// ============================================================================
// ARRAY HELPERS
// ============================================================================

/**
 * Count files and return a formatted message.
 *
 * @param files - Array of file paths
 * @param label - Description of files (e.g. 'font', 'image')
 * @returns Formatted count message
 *
 * @example
 * formatFileCount(['a.woff', 'b.woff'], 'font')  // → '2 font files'
 * formatFileCount(['logo.png'], 'image')          // → '1 image file'
 */
export function formatFileCount(files: string[], label: string): string {
  const count = files.length;
  return `${count} ${label} file${count === 1 ? '' : 's'}`;
}

// ============================================================================
// OBJECT HELPERS
// ============================================================================

/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object).
 *
 * @param value - Value to check
 * @returns True if empty
 *
 * @example
 * isEmpty(null)       // → true
 * isEmpty(undefined)  // → true
 * isEmpty('')         // → true
 * isEmpty([])         // → true
 * isEmpty({})         // → true
 * isEmpty('hello')    // → false
 * isEmpty([1, 2])     // → false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
