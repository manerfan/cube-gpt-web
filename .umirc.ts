import { defineConfig } from '@umijs/max';

import metas from './config/metas';
import proxy from './config/proxy';
import routes from './config/routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'content',
  },
  clientLoader: {},
  clickToComponent: {},
  deadCode: {},
  npmClient: 'pnpm',
  routes: routes,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  tailwindcss: {},
  metas: metas,
  title: 'MODU 墨读无界 | MODU Beyond Boundaries!',
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
    antd: true,
    baseNavigator: true,
  },
  svgo: false,
  mfsu: {
    strategy: 'normal',
  },
  jsMinifier: 'esbuild',
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
});
