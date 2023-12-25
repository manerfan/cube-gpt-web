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

import type { Response } from '@/services/typings';
import type { AUTH } from './typings';
import { request } from '@umijs/max';

/**
 * 登录认证
 * @param auth 认证信息
 * @returns true / false
 */
export async function login(
  auth: AUTH.LoginCmd,
  options?: Record<string, any>,
) {
  return request<Response.SingleResponse<AUTH.AuthEntity>>(`/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: Object.keys(auth)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(auth[key])}`,
      )
      .join('&'),
    ...(options || {}),
  });
}
