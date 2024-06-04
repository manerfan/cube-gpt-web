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

import { FetchFrom, ModelFeature, ModelType } from '@/services/llm/model';
import { ProviderStatus } from '@/services/llm/provider';
import type { Display } from '@/services/typings';
import '@interface/typings';
import React from 'react';

declare namespace LLM {
  type ProviderSchema = {
    /**
     * 标识
     */
    provider: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 描述
     */
    discription?: Display.I18nOption;

    /**
     * 图标
     */
    icon?: Display.IconOption;

    /**
     * 帮助
     */
    help?: Display.HelpOption;

    /**
     * 凭证
     */
    credentialSchemas?: Display.FormSchema[];

    /**
     * 支持的模型类型
     */
    supportedModelTypes: ModelType[];
  };

  type ProviderIcon = {
    icon: (size?: number) => React.ReactNode;
    text: (size?: number) => React.ReactNode;
    combine: (size?: number) => React.ReactNode;
    avatar: (size?: number) => React.ReactNode;
    color: string;
  };

  /**
   * Provider配置
   */
  type ProviderConfig = {
    uid?: string;
    workspaceUid: string;
    providerName: string;
    providerCredential: Record<string, string | number>;
  };

  type ModelSchema = {
    /**
     * 模型
     */
    model: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 类型
     */
    type: ModelType;

    /**
     * 模型来源
     */
    fetch_from: FetchFrom;

    /**
     * 描述
     */
    discription?: Display.I18nOption;

    /**
     * 特性
     */
    features: ModelFeature[];

    /**
     * 属性
     */
    properties: { [key: string]: any };

    /**
     * 参数
     */
    parameters: Display.FormSchema[];

    /**
     * 是否已过期不再可用
     */
    deprecated: boolean;
  };

  type ProviderWithModelsSchema = {
    /**
     * provider
     */
    provider: ProviderSchema;

    /**
     * models
     */
    models: ModelSchema[];

    /**
     * 状态
     */
    status: ProviderStatus;
  };
}
