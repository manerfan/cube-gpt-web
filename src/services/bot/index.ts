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
import { BOT } from './typings';

export enum BotMode {
  /**
   * 单智能体
   */
  SINGLE_AGENT = 'SINGLE_AGENT',

  /**
   * 多智能体
   */
  MULTI_AGENTS = 'MULTI_AGENTS',
}

/**
 * 新增智能体
 */
export async function add(
  workspaceUid: string,
  addCmd: BOT.BotAddCmd,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<BOT.BotEntity>> {
  return request<Response.SingleResponse<BOT.BotEntity>>(
    `/api/workspace/${workspaceUid}/bot`,
    {
      method: 'POST',
      data: { ...addCmd, workspaceUid, creatorUid: '' },
      ...(options || {}),
    },
  );
}

/**
 * 查询智能体列表
 */
export async function find(
  workspaceUid: string,
  listQry: BOT.BotListQry,
  maxCount: number = 20,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<BOT.BotEntity>> {
  return request<Response.MultiResponse<BOT.BotEntity>>(
    `/api/workspace/${workspaceUid}/bot`,
    {
      method: 'GET',
      params: {...listQry, maxCount},
      ...(options || {}),
    },
  );
}
