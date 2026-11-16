/// <reference types="astro/client" />

declare module 'astro:content' {
  export function defineCollection(config: any): any;
  export function getCollection(name: string): Promise<any[]>;
  export const z: typeof import('astro/zod').z;
}
