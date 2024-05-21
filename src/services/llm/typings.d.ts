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

import { ModelType } from '@/services/llm';
import type { Display } from '@/services/typings';
import '@interface/typings';
import React from 'react';

declare namespace LLM {
  type ProviderSchema = {
    /**
     * 标识
     */
    key: string;

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
    icon: React.ReactNode;
    text: React.ReactNode;
    combine: React.ReactNode;
    avatar: React.ReactNode;
    color: string;
  };
}
