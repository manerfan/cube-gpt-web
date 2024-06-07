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

import type { LLM } from '@/services/llm/typings';

import { Divider } from 'antd';
import _ from 'lodash';
import ModelSelect from './ModelSelect';
import ModelSelectorWrapper from './ModelSelectorWrapper';
import ModelSetting from './ModelSetting';

/**
 * 模型选择及模型设置
 */
const ModelSelector: React.FC<{
  providerWithModels: LLM.ProviderWithModelsSchema[];
  defaultProvider?: string;
  defaultModel?: string;
}> = ({ providerWithModels, defaultProvider, defaultModel }) => {
  const defaultProviderWithModel = _.find(
    providerWithModels,
    (pm) => pm.provider.provider === defaultProvider,
  );
  const defaultProviderSchema = defaultProviderWithModel?.provider;
  const defaultModelSchema = _.find(
    defaultProviderWithModel?.models,
    (m) => m.model === defaultModel,
  );

  return (
    <>
      <ModelSelectorWrapper
        provider={defaultProviderSchema}
        model={defaultModelSchema}
        providerStatus={defaultProviderWithModel?.status}
        block
        popover={
          <div style={{ minWidth: 450, maxHeight: 560, overflowY: 'scroll' }} className="p-2">
            {/** 模型选择 */}
            <ModelSelect
              providerWithModels={providerWithModels}
              defaultProvider={defaultProvider}
              defaultModel={defaultModel}
            />

            <Divider />

            {/** 模型参数设置 */}
            <ModelSetting modelSchema={defaultModelSchema} />
          </div>
        }
      />
    </>
  );
};

export default ModelSelector;
