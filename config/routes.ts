/**
 * Copyright 2023 Maner·Fan
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

const routes: Routes = [
  {
    path: '/',
    component: './Home',
  },
  {
    path: '/home',
    component: './Home',
  },
  {
    path: '/install',
    component: './Install',
    wrappers: ['@/wrappers/entry/EntryWrapper'],
  },
  {
    path: '/login',
    component: './Login',
    wrappers: ['@/wrappers/entry/EntryWrapper'],
  },
];

export default routes;
