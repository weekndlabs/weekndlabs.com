/**
 * Types for lib/products.js.
 *
 * The other modules in lib/ are consumed once each and arrive as `any`, which
 * has been fine. This one feeds both the navbar and the landing page, so the
 * shape is worth stating once here rather than redeclaring it in each.
 */

export type Category =
  | 'Agent infrastructure'
  | 'Model routing'
  | 'Dev workflow'
  | 'Desktop and foundations';

export interface Product {
  name: string;
  category: Category;
  version: string;
  href: string;
  blurb: string;
  description: string;
  tags?: string[];
  focus?: boolean;
  /** Set only when the repo is public and safe to count. */
  repo?: string;
}

export interface ProductGroup {
  category: Category;
  items: Product[];
}

export const CATEGORIES: readonly Category[];
export const CATEGORY_NOTES: Record<Category, string>;
export const PRODUCTS: readonly Product[];
export function byCategory(products?: readonly Product[]): ProductGroup[];
export function starRepos(): string[];
