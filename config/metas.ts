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

type Metas = Array<
  | {
      charset?: string | undefined;
      content?: string | undefined;
      'http-equiv'?: string | undefined;
      name?: string | undefined;
    }
  | { [x: string]: any }
>;

const metas: Metas = [
  {
    charset: 'utf-8',
  },
  // {
  //   "http-equiv": "Content-Security-Policy",
  //   content: "default-src 'self'; style-src 'self' 'unsafe-inline';",
  // },
  {
    name: 'description',
    content: 'Speak FREELY with Me! 想你所想 及你所及!',
  },
  {
    name: 'application-name',
    content: 'Cube Chat',
  },
  {
    name: 'author',
    content: 'Maner·Fan',
  },
  {
    name: 'keywords',
    content: 'gpt, chatgpt, aigc',
  },
  {
    name: 'viewport',
    content:
      'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0',
  },
];

export default metas;
