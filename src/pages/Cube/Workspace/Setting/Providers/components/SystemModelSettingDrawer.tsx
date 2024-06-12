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
import type { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import {
  LeftOutlined,
  LockFilled,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Flex, Form, Space, Tooltip, Typography } from 'antd';

import * as modelService from '@/services/llm/model';
import { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';

const SystemModelSettingDrawer: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  open: boolean;
  onClose?: () => void;
}> = ({ workspace, open, onClose }) => {
  const intl = useIntl();

  const getDrawerWidth = () => {
    return window.innerWidth < 576 ? '100%' : 520;
  };

  // TEXT_GENERATION
  const [
    providerWithTextGenerationModels,
    setProviderWithTextGenerationModels,
  ] = useState<LLM.ProviderWithModelsSchema[]>([]);
  const [
    providerWithTextGenerationModelLoading,
    setProviderWithTextGenerationModelLoading,
  ] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setProviderWithTextGenerationModelLoading(true);
    modelService
      .allModelsOnType(workspace.uid, modelService.ModelType.TEXT_GENERATION)
      .then((res) => {
        setProviderWithTextGenerationModels(res.content);
      })
      .finally(() => setProviderWithTextGenerationModelLoading(false));
  }, [workspace, open]);

  const [modelSetting, setModelSetting] = useState<{
    provider: string;
    model: string;
    parameters: Record<string, any>;
  }>();
  const [saving, setSaving] = useState<boolean>(false);
  const saveSettings = async () => {
    setSaving(true);

    // 参数校验
    const modelParameters = modelService.modelParameterCheck(
      providerWithTextGenerationModels,
      modelSetting,
      intl.locale,
    );
    if (!modelParameters) {
      setSaving(false);
      return;
    }

    // 提交模型参数
    console.log(modelParameters);
    setSaving(false);
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
            <ModelSelector
              providerWithModels={providerWithTextGenerationModels}
              defaultProvider="openai"
              defaultModel="gpt-4o"
              loading={providerWithTextGenerationModelLoading}
              onSelect={(provider, model, parameters) => {
                setModelSetting({ provider, model, parameters });
              }}
            />
          </Form.Item>
          <Form.Item key="btn">
            <Space>
              <Button type="primary" loading={saving} onClick={saveSettings}>
                保存
              </Button>
              <Button loading={saving} onClick={() => onClose?.()}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SystemModelSettingDrawer;
