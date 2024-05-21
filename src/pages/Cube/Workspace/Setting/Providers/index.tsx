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

import { WORKSPACE } from '@/services/workspace/typings';
import { SettingOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import { Button, Layout, Space, Tag, Typography } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import * as icons from './icons';

const Providers: React.FC<{ workspace?: WORKSPACE.WorkspaceEntity }> = ({
  workspace,
}) => {
  const { initialState } = useModel('@@initialState');
  const intl = useIntl();

  useEffect(() => {}, [workspace]);

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
              style={{ height: 180 }}
              colSpan={{
                xs: 24,
                sm: 12,
                md: 12,
                lg: 8,
                xl: 8,
                xxl: 6,
              }}
              bodyStyle={{ backgroundColor: icons.lightenColor(icon.color, 85) }}
            >
              <Layout className="h-full max-h-full overflow-scroll">
                <header>{icon.combine}</header>
                <div className="grow py-4">
                  <Typography.Text>
                    {provider.discription?.[intl.locale] ||
                      provider.discription?.default ||
                      provider.name}
                  </Typography.Text>
                </div>
                <footer>
                  <Space wrap align="start" size={2}>
                    {_.map(provider.supportedModelTypes, (modelType) => {
                      return (
                        <Tag key={modelType} className="text-xs text-gray-500">{modelType}</Tag>
                      );
                    })}
                  </Space>
                </footer>
              </Layout>
            </ProCard>
          );
        })}
      </ProCard>
    </>
  );
};

export default Providers;
