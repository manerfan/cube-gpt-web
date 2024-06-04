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

import StatusLight from '@/components/status/StatusLight';
import { formatBytes } from '@/services/common';
import * as modelService from '@/services/llm/model';
import { ModelFeature } from '@/services/llm/model';
import type { LLM } from '@/services/llm/typings';
import type { WORKSPACE } from '@/services/workspace/typings';
import { EyeOutlined, PlusCircleFilled } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Button,
  Collapse,
  Divider,
  Flex,
  List,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import * as icons from '@/pages/Cube/Workspace/components/llm/icons';
import { getLocaleContent } from '@/locales';

const ProviderModelList: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  providerSchema: LLM.ProviderSchema;
}> = ({ workspace, providerSchema }) => {
  const intl = useIntl();
  const icon = icons.getProviderIconBySchema(providerSchema);

  const [schemaLoading, setSchemaLoading] = useState(false);
  const [modelSchemas, setModelSchemas] = useState<{
    [key: string]: LLM.ModelSchema[];
  }>();

  return (
    <>
      <Collapse
        className="mt-4"
        style={{
          backgroundColor: icons.lightenColor(icon.color, 90),
        }}
        onChange={(keys) => {
          if (_.includes(keys, 'default') && !modelSchemas) {
            setSchemaLoading(true);
            modelService
              .allModelsOnProvider(workspace.uid, providerSchema.provider)
              .then((resp) => {
                const schemas = resp.content;
                setModelSchemas(schemas || []);
              })
              .finally(() => setSchemaLoading(false));
          }
        }}
        items={[
          {
            key: 'default',
            label: (
              <Flex justify="space-between" align="flex-start">
                <Typography.Text>模型列表</Typography.Text>
                <Button
                  key="add-model"
                  type="default"
                  size="small"
                  icon={<PlusCircleFilled />}
                  disabled
                >
                  添加模型
                </Button>
              </Flex>
            ),
            children: (
              <Skeleton loading={schemaLoading} active paragraph={{ rows: 2 }}>
                {_.isEmpty(modelSchemas) && (
                  <List
                    bordered={false}
                    itemLayout="horizontal"
                    dataSource={[]}
                  />
                )}
                {!_.isEmpty(modelSchemas) &&
                  _.map(modelSchemas, (schemas, type) => {
                    return (
                      <>
                        <Divider orientation="left" plain>
                          <Typography.Text type="secondary">
                            {_.upperCase(_.snakeCase(type))}
                          </Typography.Text>
                        </Divider>
                        <List
                          size="small"
                          bordered={false}
                          itemLayout="horizontal"
                          dataSource={schemas}
                          rowKey={(schema) => schema.model}
                          renderItem={(schema) => (
                            <List.Item style={{ border: 'none' }}>
                              <Space>
                                <div className="relative top-1">
                                  {icon.icon(18)}
                                </div>
                                <Tooltip
                                  title={
                                    <Typography.Text className="text-slate-100 text-xs">
                                      {getLocaleContent(
                                        schema.discription,
                                        intl.locale,
                                        schema.name,
                                      )}
                                    </Typography.Text>
                                  }
                                  color={icons.lightenColor(icon.color, 90)}
                                >
                                  <Typography.Text type="secondary">
                                    {schema.name}
                                  </Typography.Text>
                                </Tooltip>

                                {/** 模式 */}
                                {!!schema.properties.mode && (
                                  <Tag bordered={false} className="m-0">
                                    <Typography.Text
                                      type="secondary"
                                      className="text-xs"
                                    >
                                      {_.upperCase(schema.properties.mode)}
                                    </Typography.Text>
                                  </Tag>
                                )}
                                {/** 上下文 */}
                                {!!schema.properties.contextSize &&
                                  _.isNumber(schema.properties.contextSize) && (
                                    <Tag bordered={false} className="m-0">
                                      <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                      >
                                        {formatBytes(
                                          schema.properties.contextSize,
                                        )}
                                      </Typography.Text>
                                    </Tag>
                                  )}

                                {/** 特性 */}
                                {_.map(
                                  _.filter(
                                    schema.features,
                                    (feature) =>
                                      feature !== ModelFeature.VISION,
                                  ),
                                  (feature) => (
                                    <Tag bordered={false} className="m-0">
                                      <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                      >
                                        {feature}
                                      </Typography.Text>
                                    </Tag>
                                  ),
                                )}
                                {_.includes(
                                  schema.features,
                                  ModelFeature.VISION,
                                ) && (
                                  <Tooltip
                                    title={
                                      <Typography.Text className="text-slate-100 text-xs">
                                        {ModelFeature.VISION}
                                      </Typography.Text>
                                    }
                                    color={icons.lightenColor(icon.color, 90)}
                                  >
                                    <Typography.Text
                                      type="secondary"
                                      className="text-xs"
                                    >
                                      <EyeOutlined />
                                    </Typography.Text>
                                  </Tooltip>
                                )}
                              </Space>
                              <StatusLight
                                type={
                                  schema.deprecated ? 'disabled' : 'enabled'
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </>
                    );
                  })}
              </Skeleton>
            ),
          },
        ]}
        bordered={false}
      />
    </>
  );
};

export default ProviderModelList;
