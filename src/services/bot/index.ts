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

import { PUBLISH } from '@/services/publish/typings';
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
      data: { ...addCmd, workspace_uid: workspaceUid, creator_uid: '' },
      ...(options || {}),
    },
  );
}

/**
 * 修改智能体
 */
export async function update(
  workspaceUid: string,
  botUid: string,
  addCmd: BOT.BotAddCmd,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<BOT.BotEntity>> {
  return request<Response.SingleResponse<BOT.BotEntity>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}`,
    {
      method: 'PUT',
      data: { ...addCmd, workspace_uid: workspaceUid, creator_uid: '' },
      ...(options || {}),
    },
  );
}

/**
 * 查询智能体详情
 */
export async function detail(
  workspaceUid: string,
  botUid: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<BOT.BotEntity>> {
  return request<Response.SingleResponse<BOT.BotEntity>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}`,
    {
      method: 'GET',
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
      params: { ...listQry, max_count: maxCount },
      ...(options || {}),
    },
  );
}

/**
 * 保存配置
 */
export async function configSave(
  workspaceUid: string,
  botUid: string,
  botMode: BotMode,
  botConfig: Record<string, any>,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<string>> {
  return request<Response.SingleResponse<string>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}/config/save`,
    {
      method: 'PUT',
      data: { bot_mode: botMode, bot_config: botConfig },
      ...(options || {}),
    },
  );
}

/**
 * 发布配置
 */
export async function configPublish(
  workspaceUid: string,
  botUid: string,
  botMode: BotMode,
  botConfig: Record<string, any>,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<string>> {
  return request<Response.SingleResponse<string>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}/config/publish`,
    {
      method: 'PUT',
      data: { bot_mode: botMode, bot_config: botConfig },
      ...(options || {}),
    },
  );
}

/**
 * 查询配置列表
 */
export async function listConfigDraft(
  workspaceUid: string,
  botUid: string,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<PUBLISH.PublishConfigEntity>> {
  return request<Response.MultiResponse<PUBLISH.PublishConfigEntity>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}/config/drafts`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/**
 * 查询配置详情
 */
export async function getConfigDraft(
  workspaceUid: string,
  botUid: string,
  publishUid?: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<PUBLISH.PublishConfigEntity>> {
  return request<Response.SingleResponse<PUBLISH.PublishConfigEntity>>(
    `/api/workspace/${workspaceUid}/bot/${botUid}/config/draft`,
    {
      method: 'GET',
      params: { publish_uid: publishUid },
      ...(options || {}),
    },
  );
}
