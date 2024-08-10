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
  workspaceUid: string;
  providerWithModels: LLM.ProviderWithModelsSchema[];
  providerName?: string;
  modelName?: string;
  modelParameters?: Record<string, any>;
  loading?: boolean;
  onSelect?: (
    providerName: string,
    modelName: string,
    modelParameters: Record<string, any>,
  ) => void;
  onProviderConfigAdd?: (providerConfig: LLM.ProviderConfig) => void; // 当添加 Provider Schema 时
}> = ({
  workspaceUid,
  providerWithModels,
  providerName,
  modelName,
  modelParameters,
  loading,
  onSelect,
  onProviderConfigAdd,
}) => {
  const [selectedProviderWithModel, setSelectedProviderWithModel] =
    useState<LLM.ProviderWithModelsSchema>();
  const [selectedModelSchema, setSelectedModelSchema] =
    useState<LLM.ModelSchema>();

  const [selectedProviderName, setSelectedProviderName] =
    useState(providerName);
  const [selectedModelName, setSelectedModelName] = useState(modelName);
  const [selectedModelParameters, setSelectedModelParameters] = useState<{
    [key: string]: any;
  }>(modelParameters || {});

  useEffect(() => {
    if (!!providerName) {
      setSelectedProviderName(providerName);
    }
    if (!!modelName) {
      setSelectedModelName(modelName);
    }
    if (!!modelParameters) {
      setSelectedModelParameters(modelParameters);
    }

    const defaultProviderWithModel = _.find(
      providerWithModels,
      (pm) => pm.provider.provider === (providerName || selectedProviderName),
    );
    setSelectedProviderWithModel(defaultProviderWithModel);

    const defaultModelSchema = _.find(
      defaultProviderWithModel?.models,
      (m) => m.model === (modelName || selectedModelName),
    );
    setSelectedModelSchema(defaultModelSchema);
  }, [
    providerWithModels,
    providerName,
    modelName,
    modelParameters,
    selectedProviderName,
    selectedModelName,
    selectedModelParameters,
  ]);

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
              workspaceUid={workspaceUid}
              providerWithModels={providerWithModels}
              providerName={selectedProviderName}
              modelName={selectedModelName}
              loading={loading}
              onSelect={(providerName, modelName) => {
                setSelectedProviderName(providerName);
                setSelectedModelName(modelName);
                onSelect?.(providerName, modelName, selectedModelParameters);
              }}
              onProviderConfigAdd={(providerConfig) => {
                onProviderConfigAdd?.(providerConfig);
              }}
            />

            <Divider />

            {/** 模型参数设置 */}
            <ModelSetting
              modelSchema={selectedModelSchema}
              modelParameters={selectedModelParameters}
              onChange={(modelParameters) => {
                setSelectedModelParameters(modelParameters);
                onSelect?.(
                  selectedProviderName!,
                  selectedModelName!,
                  modelParameters,
                );
              }}
            />
          </div>
        }
      />
    </>
  );
};

export default ModelSelector;
