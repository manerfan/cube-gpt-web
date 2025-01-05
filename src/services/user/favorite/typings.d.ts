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

import '@interface/typings';

import type { BOT } from '@/services/bot/typings';

declare namespace USER_FAVORITE {
  type BotFavoriteListQry = {
    /**
     * 关键词
     */
    keyword?: string;

    /**
     * 从该uid后查询
     */
    after_uid_limit?: string;
  };

  type BotFavoriteEntity = {
    /**
     * 收藏uid
     */
    favorite_uid: string;

    /**
     * 收藏时间
     */
    favorite_at: Date;
  } & BOT.BotEntity;
}
