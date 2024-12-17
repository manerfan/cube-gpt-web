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
import { useEffect, useState } from 'react';
import * as modelService from '@/services/llm/model';
import { ModelType } from '@/services/llm/model';
import ModelSelector from '.';
import { ProviderStatus } from '@/services/llm/provider';
import _ from 'lodash';

/**
 * 模型选择及模型设置
 */
const ModelSelectorWithType: React.FC<{
    workspaceUid: string;
    modelType: ModelType;
    providerName?: string;
    modelName?: string;
    modelParameters?: Record<string, any>;
    onSelect?: (
        providerName: string,
        modelName: string,
        modelParameters: Record<string, any>,
    ) => void;
    onProviderWithModelsLoaded?: (providerWithModels: LLM.ProviderWithModelsSchema[]) => void;
    onProviderConfigAdd?: (providerConfig: LLM.ProviderConfig) => void; // 当添加 Provider Schema 时
}> = ({
    workspaceUid,
    modelType,
    providerName,
    modelName,
    modelParameters,
    onSelect,
    onProviderWithModelsLoaded,
    onProviderConfigAdd,
}) => {
        const [
            providerWithModels,
            setProviderWithModels,
        ] = useState<LLM.ProviderWithModelsSchema[]>([]);
        const [
            providerWithModelLoading,
            setProviderWithModelLoading,
        ] = useState<boolean>(false);

        useEffect(() => {
            if (!open) {
                return;
            }

            // model schemas
            setProviderWithModelLoading(true);
            modelService
                .allModelsOnType(workspaceUid, ModelType.TEXT_GENERATION)
                .then((res) => {
                    setProviderWithModels(res.content);
                })
                .finally(() => setProviderWithModelLoading(false));
        }, [workspaceUid, modelType]);

        useEffect(() => {
            onProviderWithModelsLoaded?.(providerWithModels);
        }, [providerWithModels]);

        const handleProviderConfig = (providerConfig: LLM.ProviderConfig) => {
            const newProviderWithModels = _.cloneDeep(providerWithModels);
            _.forEach(newProviderWithModels, (providerWithModel) => {
                if (providerWithModel.provider.provider === providerConfig.providerName) {
                    providerWithModel.status = ProviderStatus.ACTIVE;
                }
            });
            setProviderWithModels(newProviderWithModels);
        };

        return <ModelSelector
            workspaceUid={workspaceUid}
            providerWithModels={providerWithModels}
            providerName={providerName}
            modelName={modelName}
            modelParameters={modelParameters}
            loading={providerWithModelLoading}
            onSelect={onSelect}
            onProviderConfigAdd={(providerConfig) => {
                // 保证下拉列表中的Provider正常
                if (!!providerConfig) {
                    handleProviderConfig(providerConfig);
                }

                // 保证父级Provider列表可以更新
                onProviderConfigAdd?.(providerConfig);
            }}
        />
    };

export default ModelSelectorWithType;

