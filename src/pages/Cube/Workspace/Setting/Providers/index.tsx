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

import * as llmService from '@/services/llm';
import { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import { useModel } from '@umijs/max';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import ProviderCard from './components/ProviderCard';

const Providers: React.FC<{ workspace: WORKSPACE.WorkspaceEntity }> = ({
  workspace,
}) => {
  const { initialState } = useModel('@@initialState');

  // 所有已配置的Provider配置
  const [configuredProviderConfigs, setConfiguredProviderConfigs] =
    useState<LLM.ProviderConfig[]>();

  // 所有已配置的ProviderSchema
  const [configuredProviderSchemas, setConfiguredProviderSchemas] = useState<
    LLM.ProviderSchema[]
  >(initialState?.providers || []);

  // 所有未配置的ProviderSchema
  const [unConfiguredProviderSchemas, setUnConfiguredProviderSchemas] =
    useState<LLM.ProviderSchema[]>([]);

  const handleProviderSchemaConfigs = (
    _configuredProviderConfigs: LLM.ProviderConfig[],
  ) => {
    // 已配置的Provider配置
    setConfiguredProviderConfigs(_configuredProviderConfigs);

    // 过滤出已配置的
    const _configuredProviderSchemas = _.filter(
      initialState?.providers || [],
      (provider) =>
        _.includes(
          _.map(_configuredProviderConfigs, (config) => config.providerKey),
          provider.key,
        ),
    );
    setConfiguredProviderSchemas(_configuredProviderSchemas);

    // 过滤出未配置的
    const _unConfiguredProviderSchemas = _.filter(
      initialState?.providers || [],
      (provider) =>
        !_.includes(
          _.map(_configuredProviderConfigs, (config) => config.providerKey),
          provider.key,
        ),
    );
    setUnConfiguredProviderSchemas(_unConfiguredProviderSchemas);
  };

  useEffect(() => {
    // 所有已配置的Provider
    if (workspace && workspace.uid) {
      llmService.allConfiguredProviderConfigs(workspace.uid).then((res) => {
        handleProviderSchemaConfigs(res.content || []);
      });
    }
  }, [workspace]);

  return (
    <>
      {/* 已配置的Provider列表 */}
      {!_.isEmpty(configuredProviderSchemas) && (
        <ProviderCard
          workspace={workspace}
          configuredProviderSchemas={configuredProviderSchemas}
          unConfiguredProviderSchemas={unConfiguredProviderSchemas}
          configured
          onProviderConfigRemove={(providerKey) => {
            // 移除Provider配置后，重新计算已配置/未配置列表
            handleProviderSchemaConfigs(
              _.filter(
                configuredProviderConfigs || [],
                (providerConfig) => providerConfig.providerKey !== providerKey,
              ),
            );
          }}
        />
      )}

      {/* 未配置的Provider列表 */}
      {!_.isEmpty(unConfiguredProviderSchemas) && (
        <ProviderCard
          workspace={workspace}
          configuredProviderSchemas={configuredProviderSchemas}
          unConfiguredProviderSchemas={unConfiguredProviderSchemas}
          onProviderConfigAdd={(providerConfig) => {
            // 添加Provider配置后，重新计算已配置/未配置列表
            const _configuredProviderConfigs = _.filter(
              configuredProviderConfigs || [],
              (config) => config.providerKey !== providerConfig.providerKey,
            );
            _configuredProviderConfigs.push(providerConfig);
            handleProviderSchemaConfigs(_configuredProviderConfigs);
          }}
        />
      )}
    </>
  );
};

export default Providers;
