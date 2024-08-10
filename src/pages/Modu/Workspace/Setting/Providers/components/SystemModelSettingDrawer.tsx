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

import ModelSelector from '@/pages/Modu/Workspace/components/llm/ModelSelector';
import type { LLM } from '@/services/llm/typings';
import {
  LeftOutlined,
  LockFilled,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';

import * as modelService from '@/services/llm/model';
import { ModelType } from '@/services/llm/model';
import { useIntl } from '@umijs/max';
import { useEffect, useState } from 'react';

import { ProviderStatus } from '@/services/llm/provider';
import _ from 'lodash';

type ModelSetting = Record<ModelType, LLM.ModelConfig>;

const SystemModelSettingDrawer: React.FC<{
  workspaceUid: string;
  open: boolean;
  onClose?: () => void;
  onProviderConfigAdd?: (providerConfig: LLM.ProviderConfig) => void; // 当添加 Provider Schema 时
}> = ({ workspaceUid, open, onClose, onProviderConfigAdd }) => {
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

  const providerWithModelMap: Record<
    ModelType,
    LLM.ProviderWithModelsSchema[]
  > = {
    [ModelType.TEXT_GENERATION]: providerWithTextGenerationModels,
  };

  const handleProviderConfig = (
    providerConfig: LLM.ProviderConfig,
    providerWithModels: LLM.ProviderWithModelsSchema[],
    setProviderWithModels: (
      providerWithModels: LLM.ProviderWithModelsSchema[],
    ) => void,
  ) => {
    const newProviderWithModels = _.cloneDeep(providerWithModels);
    _.forEach(newProviderWithModels, (providerWithModel) => {
      if (providerWithModel.provider.provider === providerConfig.providerName) {
        providerWithModel.status = ProviderStatus.ACTIVE;
      }
    });
    setProviderWithModels(newProviderWithModels);
  };

  const [modelSetting, setModelSetting] = useState<ModelSetting>(
    {} as ModelSetting,
  );
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    // TEXT_GENERATION model schemas
    setProviderWithTextGenerationModelLoading(true);
    modelService
      .allModelsOnType(workspaceUid, ModelType.TEXT_GENERATION)
      .then((res) => {
        setProviderWithTextGenerationModels(res.content);
      })
      .finally(() => setProviderWithTextGenerationModelLoading(false));

    // 已保存的系统模型配置
    modelService.getSystemModelConfig(workspaceUid).then((res) => {
      const systemModelConfig = {} as ModelSetting;
      _.forIn(res.content, (modelConfig, modelType) => {
        systemModelConfig[modelType as ModelType] = modelConfig;
      });
      setModelSetting(systemModelConfig);
    });
  }, [workspaceUid, open]);

  const saveSettings = async () => {
    setSaving(true);

    // 参数校验
    const modelConfig = {} as ModelSetting;
    for (const modelType in modelSetting) {
      if (!modelSetting.hasOwnProperty(modelType)) {
        continue;
      }

      const modelConf = modelService.modelParameterCheck(
        providerWithModelMap[modelType as ModelType],
        modelSetting[modelType as ModelType],
        intl.locale,
      );
      if (!modelConf) {
        setSaving(false);
        return;
      }

      // 更新到 modelConfig
      modelConfig[modelType as ModelType] = modelConf;
    }

    // 提交模型参数
    modelService
      .addSystemConfig(workspaceUid, modelConfig)
      .then(() => {
        setModelSetting(modelConfig);
        message.success('保存成功');
        onClose?.();
      })
      .finally(() => setSaving(false));
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
              workspaceUid={workspaceUid}
              providerWithModels={providerWithTextGenerationModels}
              providerName={
                modelSetting[ModelType.TEXT_GENERATION]?.providerName
              }
              modelName={modelSetting[ModelType.TEXT_GENERATION]?.modelName}
              modelParameters={
                modelSetting[ModelType.TEXT_GENERATION]?.modelParameters
              }
              loading={providerWithTextGenerationModelLoading}
              onSelect={(providerName, modelName, modelParameters) => {
                const setting = _.cloneDeep(modelSetting);
                setting[ModelType.TEXT_GENERATION] = {
                  providerName,
                  modelName,
                  modelParameters,
                };
                setModelSetting(setting);
              }}
              onProviderConfigAdd={(providerConfig) => {
                // 保证下拉列表中的Provider正常
                if (!!providerConfig) {
                  handleProviderConfig(
                    providerConfig,
                    providerWithTextGenerationModels,
                    setProviderWithTextGenerationModels,
                  );
                }

                // 保证父级Provider列表可以更新
                onProviderConfigAdd?.(providerConfig);
              }}
            />
          </Form.Item>
          <Form.Item key="btn">
            <Space>
              <Button loading={saving} onClick={() => onClose?.()}>
                取消
              </Button>
              <Button type="primary" loading={saving} onClick={saveSettings}>
                保存
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default SystemModelSettingDrawer;
