import { App } from 'astro/app';

export function createExports(manifest: any) {
  const app = new App(manifest);
  return {
    default: {
      async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
        return app.render(request, {
          locals: {
            runtime: { env, ctx },
          },
        });
      },
    },
  };
}

export default createExports;
