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
import type { LLM } from './typings';

export enum ProviderStatus {
  /**
   * 已激活可用
   */
  ACTIVE = 'ACTIVE',

  /**
   * 未配置不可用
   */
  UN_CONFIGURED = 'UN_CONFIGURED',
}

/**
 * 获取所有支持的模型
 * @returns LLM.ProviderSchema
 */
export async function providers(
  options?: Record<string, any>,
): Promise<Response.MultiResponse<LLM.ProviderSchema>> {
  return request<Response.MultiResponse<LLM.ProviderSchema>>(
    `/api/system/llm/providers`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}

/**
 * 新增Provider配置
 * @param workspaceUid  空间UID
 * @param providerName Provider Key
 */
export async function addProviderConfig(
  workspaceUid: string,
  providerName: string,
  providerConfig: any,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<LLM.ProviderConfig>> {
  return request<Response.SingleResponse<LLM.ProviderConfig>>(
    `/api/workspace/${workspaceUid}/provider/${providerName}/config`,
    {
      method: 'POST',
      data: providerConfig,
      ...(options || {}),
    },
  );
}

/**
 * 删除Provider配置
 * @param workspaceUid  空间UID
 * @param providerName Provider Key
 */
export async function removeProviderConfig(
  workspaceUid: string,
  providerName: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<boolean | string>> {
  return request<Response.SingleResponse<boolean | string>>(
    `/api/workspace/${workspaceUid}/provider/${providerName}/config`,
    {
      method: 'DELETE',
      ...(options || {}),
    },
  );
}

/**
 * Provider配置详情
 * @param workspaceUid  空间UID
 * @param providerName Provider Key
 */
export async function providerConfigDetail(
  workspaceUid: string,
  providerName: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<LLM.ProviderConfig>> {
  return request<Response.SingleResponse<LLM.ProviderConfig>>(
    `/api/workspace/${workspaceUid}/provider/${providerName}/config`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}

/**
 * 所有已配置的Provider
 * @param workspaceUid  空间UID
 */
export async function allConfiguredProviderConfigs(
  workspaceUid: string,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<LLM.ProviderConfig>> {
  return request<Response.MultiResponse<LLM.ProviderConfig>>(
    `/api/workspace/${workspaceUid}/provider/all/config`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}
