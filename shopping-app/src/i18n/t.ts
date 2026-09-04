import he from '../locales/he.json';

const locales = { he };

type LocaleCode = keyof typeof locales;

const currentLocale: LocaleCode = 'he';

function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj);
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const value = getByPath(locales[currentLocale], key);
  if (typeof value !== 'string') return key;
  if (!vars) return value;
  return value.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars[name] ?? ''));
}
