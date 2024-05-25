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
import * as llmService from '@/services/llm';
import { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Button, Flex, Layout, Space, Tag, Typography } from 'antd';
import _ from 'lodash';
import { PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import ProviderSettingDrawer from './components/ProviderSettingDrawer';
import * as icons from './icons';

const Providers: React.FC<{ workspace: WORKSPACE.WorkspaceEntity }> = ({
  workspace,
}) => {
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();

  const [providerSettingDrawerOpen, setProviderSettingDrawerOpen] =
    useState<boolean>(false);
  const [providerSchema, setProviderSchema] = useState<LLM.ProviderSchema>();

  const [configuredProviderKeys, setConfiguredProviderKeys] =
    useState<string[]>();

  useEffect(() => {
    console.log(workspace);
    // 所有已配置的Provider Keys
    if (workspace && workspace.uid) {
      llmService.allConfiguredProviderKeys(workspace.uid).then((res) => {
        setConfiguredProviderKeys(res.content);
      });
    }
  }, [workspace]);

  return (
    <>
      <ProCard
        direction="row"
        wrap
        ghost
        gutter={[8, 16]}
        title="模型列表"
        extra={
          <Button
            size="small"
            icon={<SettingOutlined />}
            className="text-gray-500 font-bold"
          >
            系统模型设置
          </Button>
        }
      >
        {_.map(initialState?.providers || [], (provider) => {
          const icon = icons.getProviderIconBySchema(provider);
          return (
            <ProCard
              key={provider.key}
              bordered
              hoverable
              style={{ height: 200 }}
              colSpan={{
                xs: 24,
                sm: 12,
                md: 12,
                lg: 8,
                xl: 8,
                xxl: 6,
              }}
              bodyStyle={{
                backgroundColor: icons.lightenColor(icon.color, 85),
              }}
              actions={[
                <Button
                  key="setting"
                  type="text"
                  block
                  icon={<SettingOutlined />}
                  onClick={() => {
                    setProviderSchema(provider);
                    setProviderSettingDrawerOpen(true);
                  }}
                >
                  设置
                </Button>,
                <Button
                  key="setting"
                  type="text"
                  block
                  icon={<PlusOutlined />}
                  disabled
                >
                  添加模型
                </Button>,
              ]}
            >
              <Layout
                className="overflow-scroll"
                style={{ height: 124, position: 'relative' }}
              >
                <header>
                  <Flex gap="middle" align="center" justify="space-between">
                    {icon.combine}
                    {_.includes(configuredProviderKeys, provider.key) && (
                      <PackageCheck size={16} color="#369eff" />
                    )}
                  </Flex>
                </header>
                <div className="grow py-4">
                  <Typography.Text>
                    {getLocaleContent(
                      provider.discription,
                      intl.locale,
                      provider.name,
                    )}
                  </Typography.Text>
                </div>
                <footer style={{ position: 'relative', bottom: 0 }}>
                  <Space wrap align="start" size={2}>
                    {_.map(provider.supportedModelTypes, (modelType) => {
                      return (
                        <Tag key={modelType} className="text-xs text-gray-500">
                          {modelType}
                        </Tag>
                      );
                    })}
                  </Space>
                </footer>
              </Layout>
            </ProCard>
          );
        })}
      </ProCard>

      <ProviderSettingDrawer
        workspace={workspace}
        providerSchema={providerSchema}
        open={providerSettingDrawerOpen}
        onClose={() => setProviderSettingDrawerOpen(false)}
      />
    </>
  );
};

export default Providers;
