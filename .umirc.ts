import { defineConfig } from 'umi';

export default defineConfig({
  outputPath: 'deploy/dist',
  favicon: '/deploy/favicon.ico',
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: {
    type: 'hash'
  },
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/a', component: '@/pages/a' },
    { path: '/b', component: '@/pages/b' },
  ],
  fastRefresh: {},
  dynamicImport: {},
});
