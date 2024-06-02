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
import { llmProviderService } from '@/services';
import { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import {
  Button,
  Card,
  Flex,
  Layout,
  Modal,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import * as icons from '../icons';
import ProviderModelList from './ProviderModelList';
import ProviderSettingDrawer from './ProviderSettingDrawer';
import StatusLight from '@/components/status/StatusLight';

const ProviderCard: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  configuredProviderSchemas: LLM.ProviderSchema[]; // 已配置的
  unConfiguredProviderSchemas: LLM.ProviderSchema[]; // 未配置的
  configured?: boolean; // 是否已配置的
  onProviderConfigAdd?: (providerConfig: LLM.ProviderConfig) => void; // 当添加 Provider Schema 时
  onProviderConfigRemove?: (providerName: string) => void; // 当移除 Provider Schema 时
}> = ({
  workspace,
  configuredProviderSchemas,
  unConfiguredProviderSchemas,
  configured,
  onProviderConfigAdd,
  onProviderConfigRemove,
}) => {
  const intl = useIntl();

  const [providerSettingDrawerOpen, setProviderSettingDrawerOpen] =
    useState<boolean>(false);
  const [selectedSettingProviderSchema, setSelectedSettingProviderSchema] =
    useState<LLM.ProviderSchema>();

  const [providerDeleteConfirmOpen, setProviderDeleteConfirmOpen] =
    useState<boolean>(false);
  const [selectedDeleteProviderSchema, setSelectedDeleteProviderSchema] =
    useState<LLM.ProviderSchema>();
  const [deleteConfirmLoading, setDeleteConfirmLoading] =
    useState<boolean>(false);

  return (
    <>
      <ProCard
        direction="row"
        wrap
        ghost
        gutter={[8, 16]}
        title={
          configured ? (
            '模型列表'
          ) : (
            <Typography.Text type="secondary">
              +添加更多模型供应商
            </Typography.Text>
          )
        }
        extra={
          (_.isEmpty(configuredProviderSchemas) || configured) && (
            <Button
              size="small"
              icon={<SettingOutlined />}
              className="text-gray-500 font-bold"
            >
              系统模型设置
            </Button>
          )
        }
      >
        {_.map(
          configured ? configuredProviderSchemas : unConfiguredProviderSchemas,
          (providerSchema) => {
            const icon = icons.getProviderIconBySchema(providerSchema);
            return (
              <ProCard
                key={providerSchema.provider}
                bordered
                hoverable
                style={configured ? { minHeight: 128 } : { height: 200 }}
                colSpan={
                  configured
                    ? 24
                    : {
                        xs: 24,
                        sm: 12,
                        md: 12,
                        lg: 8,
                        xl: 8,
                        xxl: 6,
                      }
                }
                bodyStyle={{
                  backgroundColor: icons.lightenColor(icon.color, 85),
                }}
                actions={
                  !configured && [
                    <Button
                      key="setting"
                      type="text"
                      block
                      icon={<SettingOutlined />}
                      onClick={() => {
                        setSelectedSettingProviderSchema(providerSchema);
                        setProviderSettingDrawerOpen(true);
                      }}
                    >
                      添加
                    </Button>,
                    <Button
                      key="add-model"
                      type="text"
                      block
                      icon={<PlusOutlined />}
                      disabled
                    >
                      添加模型
                    </Button>,
                  ]
                }
              >
                {/** 供应商信息 */}
                <Flex justify="space-between" align="flex-start">
                  <Layout
                    className="overflow-scroll"
                    style={{
                      ...(configured ? { height: 100 } : { height: 124 }),
                      position: 'relative',
                    }}
                  >
                    <header> {icon.combine()} </header>
                    <div className="grow py-4">
                      <Typography.Text>
                        {getLocaleContent(
                          providerSchema.discription,
                          intl.locale,
                          providerSchema.name,
                        )}
                      </Typography.Text>
                    </div>
                    <footer style={{ position: 'relative', bottom: 0 }}>
                      <Space wrap align="start" size={2}>
                        {_.map(
                          providerSchema.supportedModelTypes,
                          (modelType) => {
                            return (
                              <Tag
                                key={modelType}
                                className="text-xs text-gray-500"
                              >
                                {modelType}
                              </Tag>
                            );
                          },
                        )}
                      </Space>
                    </footer>
                  </Layout>

                  {configured && (
                    <Card
                      bodyStyle={{
                        backgroundColor: icons.lightenColor(icon.color, 90),
                        padding: 12,
                        height: '100%',
                      }}
                      style={{ height: 100, width: 200, position: 'relative' }}
                    >
                      <Flex
                        vertical
                        justify="space-between"
                        align="flex-stat"
                        className="h-full"
                      >
                        <Flex justify="space-between" align="center">
                          <Space>
                            <Typography.Text type="secondary">
                              凭证
                            </Typography.Text>
                            <Button
                              key="deletion"
                              type="text"
                              size="small"
                              danger
                              block
                              icon={
                                <DeleteOutlined className="text-orange-400" />
                              }
                              onClick={() => {
                                setSelectedDeleteProviderSchema(providerSchema);
                                setProviderDeleteConfirmOpen(true);
                              }}
                            />
                          </Space>
                          <StatusLight />
                        </Flex>
                        <Button
                          key="setting"
                          type="primary"
                          size="small"
                          block
                          icon={<SettingOutlined />}
                          onClick={() => {
                            setSelectedSettingProviderSchema(providerSchema);
                            setProviderSettingDrawerOpen(true);
                          }}
                        >
                          设置
                        </Button>
                      </Flex>
                    </Card>
                  )}
                </Flex>

                {/** 模型列表 */}
                {configured && (
                  <ProviderModelList
                    workspace={workspace}
                    providerSchema={providerSchema}
                  />
                )}
              </ProCard>
            );
          },
        )}
      </ProCard>

      {/** Provider设置抽屉 */}
      <ProviderSettingDrawer
        workspace={workspace}
        providerSchema={selectedSettingProviderSchema}
        open={providerSettingDrawerOpen}
        onClose={(providerConfig) => {
          setProviderSettingDrawerOpen(false);
          if (providerConfig) {
            onProviderConfigAdd?.(providerConfig);
          }
        }}
      />

      {/** 删除Provider确认弹窗 */}
      <Modal
        title={
          <>
            <Space>
              <ExclamationCircleFilled />
              <Typography.Text>
                确认删除 {selectedDeleteProviderSchema?.name || '提供商'} 配置？
              </Typography.Text>
            </Space>
          </>
        }
        open={providerDeleteConfirmOpen}
        okType="danger"
        onOk={() => {
          setDeleteConfirmLoading(true);
          llmProviderService
            .removeProviderConfig(
              workspace.uid,
              selectedDeleteProviderSchema!.provider,
            )
            .then((resp) => {
              if (resp.content === true) {
                message.warning(
                  `配置已删除，请关注 ${selectedDeleteProviderSchema?.name} 的模型使用场景`,
                );
                onProviderConfigRemove?.(
                  selectedDeleteProviderSchema!.provider,
                );
              } else {
                message.error(
                  `配置 ${selectedDeleteProviderSchema?.name} 删除异常 ${resp.content}`,
                );
              }
            })
            .finally(() => {
              setDeleteConfirmLoading(false);
              setProviderDeleteConfirmOpen(false);
            });
        }}
        onCancel={() => {
          setDeleteConfirmLoading(false);
          setProviderDeleteConfirmOpen(false);
        }}
        confirmLoading={deleteConfirmLoading}
      >
        <Typography.Text type="danger">{`删除配置将不能使用 ${
          selectedDeleteProviderSchema?.name || '供应商'
        } 相关的所有模型`}</Typography.Text>
      </Modal>
    </>
  );
};

export default ProviderCard;
