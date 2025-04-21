/**
 * LinkedIn Full Width Extension - Shared Configuration
 * 
 * This file contains shared configuration values used across the extension.
 * Centralizing these values makes maintenance easier and reduces duplication.
 */

// The target website URL (without trailing slash)
export const targetWebsite = 'https://www.linkedin.com';

// The website URL pattern used for matching in content scripts and permissions
export const targetWebsitePattern = `${targetWebsite}/*`;

// Extension states
export enum State {
  XL = 'XL', // Full width mode
  M = 'M',   // Default LinkedIn width
}

// Extension name and description
export const extensionName = 'LinkedIn Full Width';
export const extensionDescription = 'Makes LinkedIn pages display in full width mode';
