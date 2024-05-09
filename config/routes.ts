/**
 * Copyright 2024 Maner·Fan
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

type Routes = Array<
  | {
      component?: string | undefined;
      layout?: false | undefined;
      path?: string | undefined;
      redirect?: string | undefined;
      routes?: Routes;
      wrappers?: Array<string> | undefined;
    }
  | { [x: string]: any }
>;

// 空间路由
const spaceRoutes: Routes = [
  {
    path: '',
    redirect: '/space/:id/bot',
  },
];

const routes: Routes = [
  // 首页
  {
    path: '/',
    component: './Home',
  },
  // 初始化
  {
    path: '/setup',
    component: './Setup',
    wrappers: ['@/wrappers/entry/EntryWrapper'],
  },
  // 登录
  {
    path: '/login',
    component: './Login',
    wrappers: ['@/wrappers/entry/EntryWrapper'],
  },
  {
    path: '/cube',
    wrappers: ['@/wrappers/cube/CubeWrapper'],
    routes: [
      {
        path: '',
        component: './Cube',
        wrappers: ['@/wrappers/cube/CubeContentWrapper'],
      },
      // 聊天
      {
        path: 'chat',
        component: './Cube/Chat',
        wrappers: ['@/wrappers/cube/CubeContentWrapper'],
      },
      // 空间
      {
        path: 'space/:id',
        wrappers: ['@/wrappers/cube/CubeContentWrapper'],
        routes: spaceRoutes,
      },
    ],
  },
  // 404
  { 
    path: '/*', 
    redirect: '/', 
  },
];

export default routes;
