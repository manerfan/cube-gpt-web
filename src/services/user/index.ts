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
import { request } from '@umijs/max';
import type { USER } from './typings';

/**
 * 获取当前登录人信息
 * @returns User.UserEntity
 */
export async function me(
  options?: Record<string, any>,
): Promise<Response.SingleResponse<USER.UserEntity>> {
  return request<Response.SingleResponse<USER.UserEntity>>(`/api/user/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 更新用户信息
 */
export async function update(
  userBaseInfo: USER.UserBaseInfo,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<USER.UserEntity>> {
  return request<Response.SingleResponse<USER.UserEntity>>(`/api/user/me`, {
    method: 'PUT',
    data: userBaseInfo,
    ...(options || {}),
  });
}
