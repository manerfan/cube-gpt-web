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
import type { BotMode } from './index';
import type { USER } from '@services/user/typings';

declare namespace BOT {
  type BotAddCmd = {
    /**
     * uid
     */
    uid?: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 头像
     */
    avatar?: string;

    /**
     * 描述
     */
    description?: string;
  };

  type BotListQry = {
    /**
     * 关键词
     */
    keyword?: string;

    /**
     * 模式
     */
    mode?: BotMode;

    /**
     * 是否发布
     */
    is_published?: boolean;

    /**
     * 从该uid后查询
     */
    after_uid_limit?: string;
  };

  type BotEntity = {
    /**
     * uid
     */
    uid: string;

    /**
     * 空间UID
     */
    workspace_uid: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 头像
     */
    avatar?: string;

    /**
     * 描述
     */
    description?: string;

    /**
     * 创建人
     */
    creator_uid: string;

    /**
     * 创建人信息
     */
    creator?: USER.UserEntity;

    /**
     * 模式
     */
    mode: string;

    /**
     * 发布UID
     */
    publish_uid?: string;
  };
}
