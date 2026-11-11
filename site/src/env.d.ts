/// <reference types="astro/client" />
declare module "js-yaml" {
  export function load(input: string): unknown;
  export function dump(input: unknown): string;
}
