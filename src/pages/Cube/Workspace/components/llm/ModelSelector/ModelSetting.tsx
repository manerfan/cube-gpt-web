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

import { DownOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Dropdown, Empty, Flex, Space, Typography } from 'antd';
import { Brain, Goal, Scale, SlidersHorizontal } from 'lucide-react';

import { getLocaleContent } from '@/locales';
import type { LLM } from '@/services/llm/typings';
import { useIntl } from '@umijs/max';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import ModelSettingItem from './ModelSettingItem';

const preSettingItems: MenuProps['items'] = [
  {
    label: (
      <Space>
        <Brain size={14} color="#6e7481" className="block" />
        <Typography.Text type="secondary" className="text-sm">
          创意
        </Typography.Text>
      </Space>
    ),
    key: 'creative',
  },
  {
    label: (
      <Space>
        <Scale size={14} color="#6e7481" className="block" />
        <Typography.Text type="secondary" className="text-sm">
          平衡
        </Typography.Text>
      </Space>
    ),
    key: 'balanced',
  },
  {
    label: (
      <Space>
        <Goal size={14} color="#6e7481" className="block" />
        <Typography.Text type="secondary" className="text-sm">
          精确
        </Typography.Text>
      </Space>
    ),
    key: 'precise',
  },
];

/**
 * 模型设置
 */
const ModelSetting: React.FC<{
  modelSchema?: LLM.ModelSchema;
  modelParameters?: Record<string, any>;
  onChange?: (parameters: Record<string, any>) => void;
}> = ({ modelSchema, modelParameters, onChange }) => {
  const intl = useIntl();

  const [parameters, setParameters] = useState<{ [key: string]: any }>(
    modelParameters || {},
  );

  useEffect(() => {
    if (!!modelParameters) {
      setParameters(modelParameters);
    }
  }, [modelSchema, modelParameters]);

  return (
    <>
      <Flex justify="space-between" align="center" className="mb-6">
        <Space>
          <Typography.Text strong>参数</Typography.Text>
          {!!modelSchema?.help && (
            <Typography.Link href={modelSchema.help.url} target="_blank">
              <LinkOutlined />{' '}
              {getLocaleContent(
                modelSchema.help.title,
                intl.locale,
                '帮助文档',
              )}
            </Typography.Link>
          )}
        </Space>

        {modelSchema && (
          <Dropdown
            menu={{ items: preSettingItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button size="small">
              <Space>
                <SlidersHorizontal
                  size={12}
                  color="#6e7481"
                  className="block"
                />
                <Typography.Text className="text-sm">加载预设</Typography.Text>
                <Typography.Text type="secondary" strong className="text-xs">
                  <DownOutlined />
                </Typography.Text>
              </Space>
            </Button>
          </Dropdown>
        )}
      </Flex>

      {modelSchema ? (
        <Flex vertical gap={16}>
          {_.map(modelSchema.parameters, (parameter) => {
            return (
              <ModelSettingItem
                key={parameter.name}
                itemSchema={parameter}
                itemValue={parameters?.[parameter.name]}
                onChange={(value) => {
                  const newParameters = _.cloneDeep(parameters);

                  if (value === undefined || value === null) {
                    if (_.hasIn(newParameters, parameter.name)) {
                      delete newParameters[parameter.name];
                    }
                  } else {
                    newParameters[parameter.name] = value;
                  }

                  setParameters(newParameters);
                  onChange?.(newParameters);
                }}
              />
            );
          })}
        </Flex>
      ) : (
        <Empty description="请选择模型" />
      )}
    </>
  );
};

export default ModelSetting;
