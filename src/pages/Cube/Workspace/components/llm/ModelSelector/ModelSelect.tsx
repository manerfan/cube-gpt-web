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

import { Flex, Typography } from 'antd';
import _ from 'lodash';
import ModelSelectorWrapper from './ModelSelectorWrapper';

/**
 * 模型选择
 */
const ModelSelect: React.FC<{
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
      <Flex justify="space-between" align="center">
        <Typography.Text strong>模型</Typography.Text>
        <ModelSelectorWrapper
          provider={defaultProviderSchema}
          model={defaultModelSchema}
          providerStatus={defaultProviderWithModel?.status}
          popover={<>哈哈哈</>}
        />
      </Flex>
    </>
  );
};

export default ModelSelect;
