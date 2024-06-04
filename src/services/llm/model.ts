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

export enum ModelType {
  /**
   * 文本生成
   */
  TEXT_GENERATION = 'TEXT_GENERATION',

  /**
   * 图像生成
   */
  IMAGE_GENERATION = 'IMAGE_GENERATION',

  /**
   * 视觉识别
   */
  VISION = 'VISION',

  /**
   * 嵌入
   */
  EMBEDDING = 'EMBEDDING',

  /**
   * 文本转语音
   */
  TEXT_TO_SPEECH = 'TEXT_TO_SPEECH',

  /**
   * 语音转文本
   */
  SPEECH_TO_TEXT = 'SPEECH_TO_TEXT',
}

export enum FetchFrom {
  /**
   * 系统预设
   */
  PREDEFINED = 'PREDEFINED',

  /**
   * 用户自定义
   */
  CUSTOMIZABLE = 'CUSTOMIZABLE',
}

export enum ModelFeature {
  /**
   * 视觉识别
   */
  VISION = 'VISION',
}

/**
 * 获取空间下某一Provider的所有模型
 * @param workspaceUid 工作空间Uid
 * @param providerName Provider Name
 * @returns LLM.ProviderSchema
 */
export async function allModelsOnProvider(
  workspaceUid: string,
  providerName: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<{ [key: string]: LLM.ModelSchema[] }>> {
  return request<Response.SingleResponse<{ [key: string]: LLM.ModelSchema[] }>>(
    `/api/workspace/${workspaceUid}/provider/${providerName}/model`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}

/**
 * 获取空间下某类型的所有模型
 * @param workspaceUid 工作空间Uid
 * @param modelType 模型类型
 * @returns LLM.ProviderWithModelsSchema
 */
export async function allModelsOnType(
  workspaceUid: string,
  modelType: ModelType,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<LLM.ProviderWithModelsSchema>> {
  return request<Response.MultiResponse<LLM.ProviderWithModelsSchema>>(
    `/api/workspace/${workspaceUid}/model/type/${modelType}`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}
