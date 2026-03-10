import type { TestConfig } from '../types';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTestConfig(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Config must be an object'] };
  }

  const config = data as Record<string, unknown>;

  if (typeof config.title !== 'string' || !config.title) {
    errors.push('Missing or invalid "title"');
  }

  if (typeof config.duration !== 'number' || config.duration < 60) {
    errors.push('Missing or invalid "duration" (must be number >= 60)');
  }

  if (!config.branding || typeof config.branding !== 'object') {
    errors.push('Missing "branding" object');
  } else {
    const branding = config.branding as Record<string, unknown>;
    if (typeof branding.title !== 'string') errors.push('Missing branding.title');
    if (typeof branding.primaryColor !== 'string') errors.push('Missing branding.primaryColor');
  }

  if (!config.cta || typeof config.cta !== 'object') {
    errors.push('Missing "cta" object');
  } else {
    const cta = config.cta as Record<string, unknown>;
    if (typeof cta.heading !== 'string') errors.push('Missing cta.heading');
    if (typeof cta.buttonText !== 'string') errors.push('Missing cta.buttonText');
    if (typeof cta.buttonUrl !== 'string') errors.push('Missing cta.buttonUrl');
  }

  if (!Array.isArray(config.passages) || config.passages.length === 0) {
    errors.push('Missing or empty "passages" array');
  } else {
    (config.passages as Record<string, unknown>[]).forEach((passage, i) => {
      if (typeof passage.id !== 'string') errors.push(`passages[${i}]: missing id`);
      if (typeof passage.title !== 'string') errors.push(`passages[${i}]: missing title`);
      if (typeof passage.content !== 'string') errors.push(`passages[${i}]: missing content`);
      if (!Array.isArray(passage.questionGroups) || passage.questionGroups.length === 0) {
        errors.push(`passages[${i}]: missing or empty questionGroups`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

export function asTestConfig(data: unknown): TestConfig {
  return data as TestConfig;
}
