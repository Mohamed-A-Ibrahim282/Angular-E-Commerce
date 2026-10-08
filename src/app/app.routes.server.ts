import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'category/:id', renderMode: RenderMode.Client },
  { path: 'productDetails/:id', renderMode: RenderMode.Client },
  { path: 'brand-products/:id', renderMode: RenderMode.Client },
  { path: 'checkout/:id', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
