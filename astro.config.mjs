import { fileURLToPath } from 'node:url';
import { defineConfig, passthroughImageService } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

/**
 * Universal Astro + Cloudflare Workers adapter configuration.
 * - Uses @astrojs/cloudflare when CLOUDFLARE_DEPLOY=true (Cloudflare Pages / Workers).
 * - Uses a Worker-compatible SSR adapter (`workerEntrypoint.ts`) for standard builds
 *   without requiring an external `workerd` daemon.
 */
function createUniversalCloudflareAdapter() {
  if (process.env.CLOUDFLARE_DEPLOY === 'true') {
    return cloudflare({
      imageService: 'passthrough',
    });
  }

  return {
    name: '@astrojs/cloudflare-universal',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          image: {
            service: passthroughImageService(),
          },
          session: false,
        });
      },
      'astro:config:done': ({ setAdapter, buildOutput }) => {
        setAdapter({
          name: '@astrojs/cloudflare-universal',
          serverEntrypoint: fileURLToPath(
            new URL('./src/lib/server/workerEntrypoint.ts', import.meta.url)
          ),
          exports: ['default'],
          entrypointResolution: 'explicit',
          adapterFeatures: {
            buildOutput,
            middlewareMode: 'classic',
            preserveBuildClientDir: true,
            preserveBuildServerDir: true,
          },
          supportedAstroFeatures: {
            serverOutput: 'stable',
            hybridOutput: 'stable',
            staticOutput: 'stable',
            sharpImageService: {
              support: 'limited',
              message: 'Using passthrough image service for Cloudflare Workers compatibility.',
              suppress: 'all',
            },
            envGetSecret: 'stable',
          },
        });
      },
    },
  };
}

export default defineConfig({
  output: 'server',
  adapter: createUniversalCloudflareAdapter(),
  session: false,
  security: {
    checkOrigin: false,
  },
  i18n: {
    defaultLocale: 'es-ar',
    locales: ['es-ar', 'en-us'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  server: {
    port: 3333,
    host: '0.0.0.0',
  },
  vite: {
    server: {
      allowedHosts: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  },
});
