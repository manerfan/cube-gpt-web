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

type ProxyOptions = {
  target?: string;
  changeOrigin?: boolean;
  pathRewrite?: { [key: string]: string };
};

type ProxyConfig = {
  [key: string]:
    | {
        [key: string]: ProxyOptions;
      }
    | ProxyOptions[];
};

const proxyConfig: ProxyConfig = {
  dev: {
    '/api/': {
      // 要代理的地址
      target: 'http://localhost:7001',
      // changeOrigin: true,
    },
  },
};

export default proxyConfig;
