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

import ModelSelector from '@/pages/Cube/Workspace/components/llm/ModelSelector';
import { ProviderStatus } from '@/services/llm/provider';
import type { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import {
  LeftOutlined,
  LockFilled,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Flex, Form, Space, Tooltip, Typography } from 'antd';

const providerWithModels = [
  {
    provider: {
      provider: 'openai',
      name: 'OpenAI',
      description: {
        default: 'OpenAI 提供的模型',
        enUs: 'Models provided by OpenAI',
        zhCn: null,
      },
      icon: null,
      supportedModelTypes: [
        'TEXT_GENERATION',
        'TEXT_EMBEDDING',
        'TEXT_TO_SPEECH',
        'SPEECH_TO_TEXT',
      ],
      help: {
        title: {
          default: '从 OpenAI 获取 API Key',
          enUs: 'Get your API Key from OpenAI',
          zhCn: null,
        },
        url: 'https://platform.openai.com/account/api-keys',
      },
      credentialSchemas: [
        {
          name: 'openai_api_key',
          valueType: 'password',
          valueEnum: null,
          fieldProps: {
            placeholder: {
              default: '在此输入您的 API Key',
              enUs: 'Enter your API Key',
            },
            maxLength: 128,
          },
          title: { default: 'API Key', enUs: null, zhCn: null },
          tooltip: { default: 'OpenAI API Key', enUs: null, zhCn: null },
          rules: {
            required: true,
            min: 32,
            max: 128,
            pattern: null,
            message: null,
          },
        },
        {
          name: 'openai_organization',
          valueType: 'text',
          valueEnum: null,
          fieldProps: {
            placeholder: {
              default: '输入你的组织 ID，可选',
              enUs: 'Enter your organization ID, optional',
            },
            maxLength: 64,
          },
          title: { default: '组织 ID', enUs: 'Organization ID', zhCn: null },
          tooltip: {
            default: '可选，默认为空',
            enUs: 'Optional, leave blank by default',
            zhCn: null,
          },
          rules: {
            required: false,
            min: null,
            max: null,
            pattern: null,
            message: null,
          },
        },
        {
          name: 'openai_api_base',
          valueType: 'text',
          valueEnum: null,
          fieldProps: {
            placeholder: {
              default: '输入你的API请求地址，默认 https://api.openai.com',
              enUs: 'Enter your API request address, default https://api.openai.com',
            },
            maxLength: 256,
          },
          title: {
            default: 'API请求地址',
            enUs: 'API request address',
            zhCn: null,
          },
          tooltip: {
            default: '可选，默认 https://api.openai.com',
            enUs: 'Optional, default https://api.openai.com',
            zhCn: null,
          },
          rules: {
            required: false,
            min: null,
            max: null,
            pattern: null,
            message: null,
          },
        },
      ],
    },
    models: [
      {
        model: 'gpt-4o',
        name: 'gpt-4o',
        type: 'TEXT_GENERATION',
        fetchFrom: 'PREDEFINED',
        description: { default: 'gpt-4o', enUs: 'gpt-4o', zhCn: null },
        features: ['VISION'],
        properties: { mode: 'CHAT', contextSize: 128000 },
        parameters: [
          {
            name: 'temperature',
            valueType: 'digit',
            title: {
              default: "随机度"
            },
            tooltip: {
              default: "控制随机度"
            },
            initialValue: 0.5,
            fieldProps: {
              min: 0,
              max: 1,
              step: 0.1,
              precision: 1
            },
            rules: {
              required: false
            }
          },
          {
            name: 'seed',
            valueType: 'digit',
            title: {
              default: "种子"
            },
            tooltip: {
              default: "控制种子"
            },
            initialValue: 10,
            fieldProps: {
              min: 0,
              precision: 0
            },
            rules: {
              required: false
            }
          },
          {
            name: 'response_format',
            valueType: 'select',
            title: {
              default: "响应格式"
            },
            tooltip: {
              default: "控制响应格式"
            },
            initialValue: 'TEXT',
            valueEnum: [
              {
                value: 'TEXT',
                text: {
                  default: "TEXT"
                }
              },
              {
                value: 'JSON',
                text: {
                  default: "JSON"
                }
              }
            ],
            fieldProps: null,
            rules: {
              required: false
            }
          },
          {
            name: 'stop_workds',
            valueType: 'select',
            title: {
              default: "停止词"
            },
            tooltip: {
              default: "设置停止词"
            },
            initialValue: ['TEXT', 'JSON'],
            fieldProps: {
              mode: 'tags'
            },
            rules: {
              required: false
            }
          },
        ],
        deprecated: false,
      },
    ],
    status: ProviderStatus.ACTIVE,
  },
] as LLM.ProviderWithModelsSchema[];

const SystemModelSettingDrawer: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  open: boolean;
  onClose?: () => void;
}> = ({ workspace, open, onClose }) => {
  const getDrawerWidth = () => {
    return window.innerWidth < 576 ? '100%' : 520;
  };

  return (
    <>
      <Drawer
        title={
          <Space>
            <Button
              type="text"
              icon={<LeftOutlined />}
              className="text-gray-500 font-bold w-5 md:hidden"
              onClick={() => onClose?.()}
            />
            <SettingOutlined />
            系统模型设置
          </Space>
        }
        extra
        placement="right"
        closeIcon={false}
        open={open}
        onClose={() => onClose?.()}
        width={getDrawerWidth()}
        destroyOnClose
        footer={
          <Flex align="center" justify="center">
            <Typography.Text type="secondary">
              <LockFilled /> 您的信息将使用{' '}
              <Typography.Link
                href="https://pycryptodome.readthedocs.io/en/latest/src/cipher/oaep.html"
                target="_blank"
              >
                PKCS1_OAEP
              </Typography.Link>{' '}
              技术进行加密和存储。
            </Typography.Text>
          </Flex>
        }
      >
        <Form layout="vertical">
          <Form.Item
            key="text-generate"
            label={
              <Space>
                <Typography.Text strong>系统推理模型</Typography.Text>
                <Tooltip title="系统默认推理模型">
                  <QuestionCircleOutlined />
                </Tooltip>
              </Space>
            }
          >
            <ModelSelector providerWithModels={providerWithModels} defaultProvider='openai' defaultModel='gpt-4o' />
          </Form.Item>
          <Form.Item key="btn">
            <Space>
              <Button type="primary">保存</Button>
              <Button onClick={() => onClose?.()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SystemModelSettingDrawer;
