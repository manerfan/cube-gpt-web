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

import { getLocaleContent } from '@/locales';
import type { Response } from '@/services/typings';
import { request } from '@umijs/max';
import { message } from 'antd';
import _ from 'lodash';
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

/**
 * 获取 工作空间 系统默认模型配置
 * @param workspaceUid 工作空间UID
 * @param options
 * @returns Record<ModelType, LLM.ModelConfig>
 */
export async function getSystemModelConfig(
  workspaceUid: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<Record<ModelType, LLM.ModelConfig>>> {
  return request<Response.SingleResponse<Record<ModelType, LLM.ModelConfig>>>(
    `/api/workspace/${workspaceUid}/model/system/config`,
    {
      method: 'GET',
      params: {},
      ...(options || {}),
    },
  );
}

/**
 * 添加 工作空间 系统默认模型配置
 * @param workspaceUid 工作空间UID
 * @returns Record<ModelType, LLM.ModelConfig>
 */
export async function addSystemConfig(
  workspaceUid: string,
  modelConfig: Record<ModelType, LLM.ModelConfig>,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<Record<ModelType, LLM.ModelConfig>>> {
  return request<Response.SingleResponse<Record<ModelType, LLM.ModelConfig>>>(
    `/api/workspace/${workspaceUid}/model/system/config`,
    {
      method: 'POST',
      data: modelConfig,
      ...(options || {}),
    },
  );
}

export function modelParameterCheck(
  providerWithModels: LLM.ProviderWithModelsSchema[],
  modelSetting?: {
    providerName: string;
    modelName: string;
    modelParameters: Record<string, any>;
  },
  locale?: string,
):
  | {
      providerName: string;
      modelName: string;
      modelParameters: Record<string, any>;
    }
  | null
  | undefined {
  // 参数校验
  if (
    _.isEmpty(modelSetting) ||
    _.isEmpty(modelSetting.providerName) ||
    _.isEmpty(modelSetting.modelName)
  ) {
    message.error('请选择模型');
    return null;
  }

  // 设置的Provider
  const settingProviderWithModelSchema = _.findLast(
    providerWithModels,
    (providerWithModel) =>
      providerWithModel.provider.provider === modelSetting?.providerName,
  );
  if (_.isEmpty(settingProviderWithModelSchema)) {
    message.error('请选择合适的模型');
    return null;
  }

  // 设置的Model
  const settingModelSchema = _.findLast(
    settingProviderWithModelSchema.models,
    (model) => model.model === modelSetting?.modelName,
  );
  if (_.isEmpty(settingModelSchema)) {
    message.error('请选择合适的模型');
    return null;
  }

  // 只取有效的参数
  const modelParameters = _.pick(
    modelSetting.modelParameters,
    _.map(settingModelSchema.parameters, (parameter) => parameter.name),
  );

  // 校验必须参数
  const requiredParameters = _.filter(
    settingModelSchema.parameters,
    (parameter) => parameter.rules?.required || false,
  );
  for (const parameter of requiredParameters) {
    if (!_.hasIn(modelParameters, parameter.name)) {
      const parameterName = getLocaleContent(
        parameter.title,
        locale,
        parameter.name,
      );
      message.error(
        `请设置参数 [${parameterName}] (${modelSetting.providerName}:${modelSetting.modelName})`,
      );
      return null;
    }
  }

  // 校验数字范围
  const digitParameters = _.filter(
    settingModelSchema.parameters,
    (parameter) => parameter.valueType === 'digit',
  );
  for (const parameter of digitParameters) {
    if (
      (!!parameter.fieldProps?.min &&
        modelParameters[parameter.name] < parameter.fieldProps.min) ||
      (!!parameter.fieldProps?.max &&
        modelParameters[parameter.name] > parameter.fieldProps.max)
    ) {
      const parameterName = getLocaleContent(
        parameter.title,
        locale,
        parameter.name,
      );
      message.error(
        `参数 [${parameterName}] (${modelSetting.providerName}:${modelSetting.modelName}) 不在有效范围内`,
      );
      return null;
    }
  }

  return {
    providerName: modelSetting.providerName,
    modelName: modelSetting.modelName,
    modelParameters: modelParameters,
  };
}
