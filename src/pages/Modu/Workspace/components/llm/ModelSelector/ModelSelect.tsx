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

import ProviderSettingDrawer from '@/pages/Modu/Workspace/Setting/Providers/components/ProviderSettingDrawer';
import { ProviderStatus } from '@/services/llm/provider';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Flex,
  Input,
  List,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ModelItem from '../ModelItem';
import ModelPopoverWrapper, {
  ModelPopoverWrapperRefProperty,
} from './ModelPopoverWrapper';

/**
 * 模型选择
 */
const ModelSelect: React.FC<{
  workspaceUid: string;
  providerWithModels: LLM.ProviderWithModelsSchema[];
  providerName?: string;
  modelName?: string;
  loading?: boolean;
  onSelect?: (provider: string, model: string) => void;
  onProviderConfigAdd?: (providerConfig: LLM.ProviderConfig) => void; // 当添加 Provider Schema 时
}> = ({
  workspaceUid,
  providerWithModels,
  providerName,
  modelName,
  loading,
  onSelect,
  onProviderConfigAdd
}) => {
    // 选中的模型信息
    const [selectedProviderWithModel, setSelectedProviderWithModel] =
      useState<LLM.ProviderWithModelsSchema>();
    const [selectedModelSchema, setSelectedModelSchema] =
      useState<LLM.ModelSchema>();

    // 待添加Provider信息
    const [providerSettingDrawerOpen, setProviderSettingDrawerOpen] =
      useState(false);
    const [selectedSettingProviderSchema, setSelectedSettingProviderSchema] =
      useState<LLM.ProviderSchema>();

    const [searchKey, setSearchKey] = useState<string>();

    useEffect(() => {
      const defaultProviderWithModel = _.find(
        providerWithModels,
        (pm) => pm.provider.provider === providerName,
      );
      setSelectedProviderWithModel(defaultProviderWithModel);

      const defaultModelSchema = _.find(
        defaultProviderWithModel?.models,
        (m) => m.model === modelName,
      );
      setSelectedModelSchema(defaultModelSchema);
    }, [providerWithModels, providerName, modelName]);

    const modelPopoverRef = useRef<ModelPopoverWrapperRefProperty>();

    /**
     * 防抖处理
     */
    const debouncedSearch = useCallback(
      _.debounce((searchKey) => {
        setSearchKey(searchKey);
      }, 200),
      [],
    );

    return (
      <>
        <Flex justify="space-between" align="center">
          <Typography.Text strong>模型</Typography.Text>
          <ModelPopoverWrapper
            ref={modelPopoverRef}
            provider={selectedProviderWithModel?.provider}
            model={selectedModelSchema}
            providerStatus={selectedProviderWithModel?.status}
            popover={
              <>
                <div
                  style={{ minWidth: 320, maxHeight: 560, overflowY: 'scroll' }}
                >
                  <Skeleton active loading={loading}>
                    {/** 模型搜索框 */}
                    <Input
                      prefix={<SearchOutlined />}
                      variant="filled"
                      size="small"
                      placeholder="搜索模型"
                      allowClear
                      onChange={(e) => {
                        const { value } = e.target;
                        debouncedSearch(value);
                      }}
                    />

                    {/** 模型列表 */}
                    {_.map(
                      _.filter(
                        providerWithModels,
                        (providerWithModel) =>
                          !_.isEmpty(providerWithModel.models),
                      ),
                      (providerWithModel) => {
                        return (
                          <div key={providerWithModel.provider.provider}>
                            <Divider orientation="left" plain>
                              {providerWithModel.provider.name}
                            </Divider>
                            <List
                              size="small"
                              bordered={false}
                              itemLayout="horizontal"
                              dataSource={_.filter(
                                providerWithModel.models,
                                // 关键词过滤
                                (model) => {
                                  return (
                                    _.isEmpty(searchKey) ||
                                    _.includes(
                                      _.toLower(model.model),
                                      _.toLower(searchKey),
                                    ) ||
                                    _.includes(
                                      _.toLower(model.model),
                                      _.toLower(searchKey),
                                    )
                                  );
                                },
                              )}
                              rowKey={(model) => model.model}
                              renderItem={(model) => (
                                <List.Item
                                  style={providerName === providerWithModel.provider.provider && modelName === model.model ? {borderBlockEnd: '1.5px solid #475569'} : {border: 'none'}}
                                  className={`relative group my-1 ${(providerName === providerWithModel.provider.provider && modelName === model.model)
                                      ? 'border-solid rounded-lg border-slate-600'
                                      : 'border-none border-0'
                                    } ${model.deprecated ||
                                      providerWithModel.status !==
                                      ProviderStatus.ACTIVE
                                      ? 'cursor-not-allowed'
                                      : 'hover:bg-gray-100 cursor-pointer'
                                    }`}
                                >
                                  <ModelItem
                                    providerSchema={providerWithModel.provider}
                                    modelSchema={model}
                                    disable={
                                      model.deprecated ||
                                      providerWithModel.status !==
                                      ProviderStatus.ACTIVE
                                    }
                                    onClick={() => {
                                      if (
                                        model.deprecated ||
                                        providerWithModel.status !==
                                        ProviderStatus.ACTIVE
                                      ) {
                                        return;
                                      }

                                      onSelect?.(
                                        providerWithModel.provider.provider,
                                        model.model,
                                      );
                                      modelPopoverRef.current?.closePopover();
                                    }}
                                  />

                                  {/** Provider未添加时展示 */}
                                  {!model.deprecated &&
                                    providerWithModel.status !==
                                    ProviderStatus.ACTIVE && (
                                      <Tooltip
                                        title={`${providerWithModel.provider.name} 未配置添加`}
                                        placement="right"
                                      >
                                        <Flex
                                          justify="flex-end"
                                          align="center"
                                          className="w-full absolute right-0 hidden group-hover:flex"
                                        >
                                          <Button
                                            size="small"
                                            type="primary"
                                            onClick={() => {
                                              setSelectedSettingProviderSchema(
                                                providerWithModel.provider,
                                              );
                                              setProviderSettingDrawerOpen(true);
                                            }}
                                          >
                                            添加
                                          </Button>
                                        </Flex>
                                      </Tooltip>
                                    )}
                                </List.Item>
                              )}
                            />
                          </div>
                        );
                      },
                    )}
                  </Skeleton>
                </div>
              </>
            }
          />
        </Flex>

        {/** Provider设置抽屉 */}
        <ProviderSettingDrawer
          workspaceUid={workspaceUid}
          providerSchema={selectedSettingProviderSchema}
          open={providerSettingDrawerOpen}
          onClose={(providerConfig) => {
            setProviderSettingDrawerOpen(false);
            if (providerConfig) {
              onProviderConfigAdd?.(providerConfig);
            }
          }}
        />
      </>
    );
  };

export default ModelSelect;
