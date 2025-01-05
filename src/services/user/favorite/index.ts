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
import { USER_FAVORITE } from './typings';

/**
 * 查询 智能体收藏列表
 */
export async function findFavoriteBots(
  listQry: USER_FAVORITE.BotFavoriteListQry,
  maxCount: number = 20,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<USER_FAVORITE.BotFavoriteEntity>> {
  return request<Response.MultiResponse<USER_FAVORITE.BotFavoriteEntity>>(
    `/api/user/favorite/bots`,
    {
      method: 'GET',
      params: { ...listQry, max_count: maxCount },
      ...(options || {}),
    },
  );
}
