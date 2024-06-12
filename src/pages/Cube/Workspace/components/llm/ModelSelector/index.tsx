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
import { useEffect, useState } from 'react';
import ModelPopoverWrapper from './ModelPopoverWrapper';
import ModelSelect from './ModelSelect';
import ModelSetting from './ModelSetting';

/**
 * 模型选择及模型设置
 */
const ModelSelector: React.FC<{
  providerWithModels: LLM.ProviderWithModelsSchema[];
  defaultProvider?: string;
  defaultModel?: string;
  loading?: boolean;
  onSelect?: (provider: string, model: string, parameters: Record<string, any>) => void;
}> = ({ providerWithModels, defaultProvider, defaultModel, loading, onSelect }) => {
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [selectedModel, setSelectedModel] = useState(defaultModel);

  const [selectedProviderWithModel, setSelectedProviderWithModel] =
    useState<LLM.ProviderWithModelsSchema>();
  const [selectedModelSchema, setSelectedModelSchema] =
    useState<LLM.ModelSchema>();

  const [selectedModelParameters, setSelectedModelParameters] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    const defaultProviderWithModel = _.find(
      providerWithModels,
      (pm) => pm.provider.provider === selectedProvider,
    );
    setSelectedProviderWithModel(defaultProviderWithModel);

    const defaultModelSchema = _.find(
      defaultProviderWithModel?.models,
      (m) => m.model === selectedModel,
    );
    setSelectedModelSchema(defaultModelSchema);
  }, [providerWithModels, selectedProvider, selectedModel]);

  return (
    <>
      <ModelPopoverWrapper
        provider={selectedProviderWithModel?.provider}
        model={selectedModelSchema}
        providerStatus={selectedProviderWithModel?.status}
        block
        popover={
          <div
            style={{ minWidth: 450, maxHeight: 560, overflowY: 'scroll' }}
            className="p-2"
          >
            {/** 模型选择 */}
            <ModelSelect
              providerWithModels={providerWithModels}
              defaultProvider={selectedProvider}
              defaultModel={selectedModel}
              loading={loading}
              onSelect={(provider, model) => {
                setSelectedProvider(provider);
                setSelectedModel(model);

                onSelect?.(provider, model, selectedModelParameters);
              }}
            />

            <Divider />

            {/** 模型参数设置 */}
            <ModelSetting
              modelSchema={selectedModelSchema}
              onChange={(parameters) => {
                setSelectedModelParameters(parameters);
                onSelect?.(selectedProvider!, selectedModel!, parameters);
              }}
            />
          </div>
        }
      />
    </>
  );
};

export default ModelSelector;
