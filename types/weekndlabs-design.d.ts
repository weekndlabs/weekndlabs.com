/**
 * @weekndlabs/design ships no type declarations, so a TypeScript consumer
 * cannot import the Tailwind preset without one. This site is the package's
 * first TypeScript consumer, which is why nobody hit it before.
 *
 * Delete this file once the package ships its own. Tracked at
 * weekndlabs/design#33.
 */
declare module '@weekndlabs/design/tailwind' {
  import type { Config } from 'tailwindcss';
  const preset: Partial<Config>;
  export default preset;
}

declare module '@weekndlabs/design' {
  export const THEMES: string[];
  export const ROLES: string[];
  export const TERMINAL: string[];
  export const TEXT_ROLES: string[];
  export const themes: Record<string, Record<string, string>>;
  export const terminal: Record<string, string>;
  export const containers: Record<string, string>;
}
