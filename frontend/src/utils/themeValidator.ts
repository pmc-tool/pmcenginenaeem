// Theme Validation Utility
// Feature: 006-themes-and-deploy
// Uses ajv for JSON Schema validation and jszip for .zip extraction

import Ajv, { JSONSchemaType } from 'ajv';
import JSZip from 'jszip';
import type { ThemeManifest } from '../types';

const MAX_FILE_SIZE = 52428800; // 50 MB in bytes

// JSON Schema for theme manifest validation
const manifestSchema: JSONSchemaType<ThemeManifest> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    version: {
      type: 'string',
      pattern: '^[0-9]+\\.[0-9]+\\.[0-9]+$', // semver: X.Y.Z
    },
    framework: {
      type: 'string',
      enum: ['next.js', 'gatsby', 'laravel', 'wordpress', 'static'],
    },
    description: {
      type: 'string',
      maxLength: 500,
      nullable: true,
    },
    author: {
      type: 'string',
      nullable: true,
    },
    license: {
      type: 'string',
      nullable: true,
    },
    dependencies: {
      type: 'object',
      properties: {
        node: {
          type: 'string',
          nullable: true,
        },
        npm_packages: {
          type: 'object',
          nullable: true,
          required: [],
          additionalProperties: { type: 'string' },
        },
      },
      nullable: true,
      required: [],
    },
    config: {
      type: 'object',
      properties: {
        env_vars: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
        build_command: {
          type: 'string',
          nullable: true,
        },
        output_dir: {
          type: 'string',
          nullable: true,
        },
      },
      nullable: true,
      required: [],
    },
  },
  required: ['name', 'version', 'framework'],
  additionalProperties: true,
};

// Initialize Ajv validator
const ajv = new Ajv();
const validateManifest = ajv.compile(manifestSchema);

/**
 * Validation result for theme file
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  manifest?: ThemeManifest;
}

/**
 * Validate uploaded theme file
 *
 * Steps:
 * 1. Check file size (<= 50 MB)
 * 2. Check file type (.zip)
 * 3. Extract and parse manifest.json
 * 4. Validate manifest against JSON Schema
 *
 * @param file - Theme .zip file from upload
 * @returns Validation result with manifest data if successful
 */
export async function validateThemeFile(file: File): Promise<ValidationResult> {
  // 1. Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'This file is too large. Max size is 50 MB.',
    };
  }

  // 2. Check file type
  if (!file.name.endsWith('.zip') && file.type !== 'application/zip') {
    return {
      valid: false,
      error: "This doesn't look like a PMC Engine theme zip file. Please upload the theme zip from your developer.",
    };
  }

  try {
    // 3. Extract and parse manifest.json using jszip
    const zip = await JSZip.loadAsync(file);

    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) {
      return {
        valid: false,
        error: "We couldn't read this theme as PMC Engineready. Ask your developer to export a PMC Enginecompatible theme, or learn more.",
      };
    }

    const manifestText = await manifestFile.async('text');
    const manifest = JSON.parse(manifestText) as ThemeManifest;

    // 4. Validate manifest against schema
    if (!validateManifest(manifest)) {
      const errors = validateManifest.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join(', ');

      return {
        valid: false,
        error: `Invalid theme manifest: ${errors || 'Unknown validation error'}`,
      };
    }

    return {
      valid: true,
      manifest,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to parse theme file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate file size before attempting full validation
 * Quick check for early feedback
 *
 * @param file - File to check
 * @returns True if file size is valid
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE;
}

/**
 * Validate file type before attempting full validation
 * Quick check for early feedback
 *
 * @param file - File to check
 * @returns True if file type is .zip
 */
export function isValidFileType(file: File): boolean {
  return file.name.endsWith('.zip') || file.type === 'application/zip';
}
