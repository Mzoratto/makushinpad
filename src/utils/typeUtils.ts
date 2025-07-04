/**
 * Type utility functions for safe type conversions
 */

import { DefaultTFuncReturn } from 'react-i18next';

/**
 * Safely converts i18next translation result to string
 */
export function safeTranslation(value: DefaultTFuncReturn): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Safely converts i18next translation result to string with fallback
 */
export function safeTranslationWithFallback(value: DefaultTFuncReturn, fallback: string): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
}
