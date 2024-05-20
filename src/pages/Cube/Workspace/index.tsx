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

import { SettingOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { history, useIntl, useLocation } from '@umijs/max';
import { Avatar, Button, Space, TabsProps, Typography } from 'antd';
import TabHeader from './components/TabHeader';
import { getPathAndModule } from '@/services';

const Workspace: React.FC = () => {
  const intl = useIntl();

  const location = useLocation();

  const store = useCreateStore();
  const control: FluentEmojiProps = useControls(
    {
      emoji: '😃',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
    },
    { store },
  );

  // tab内容
  const items: TabsProps['items'] = [
    {
      key: 'bots',
      label: intl.formatMessage({ id: 'cube.space.tab.bots' }),
      children: 'Content of Tab Pane Bots',
    },
    {
      key: 'plugins',
      label: intl.formatMessage({ id: 'cube.space.tab.plugins' }),
      children: 'Content of Tab Pane Plugins',
    },
    {
      key: 'workflows',
      label: intl.formatMessage({ id: 'cube.space.tab.workflows' }),
      children: 'Content of Tab Pane Workflows',
    },
    {
      key: 'knowledges',
      label: intl.formatMessage({ id: 'cube.space.tab.knowledge' }),
      children: 'Content of Tab Pane Knowledges',
    },
    {
      key: 'cards',
      label: intl.formatMessage({ id: 'cube.space.tab.cards' }),
      children: 'Content of Tab Pane Cards',
    },
  ];

  // tab左右两侧内容
  const tabBarExtraContent = {
    left: (
      <Space style={{ marginLeft: '1rem' }}>
        <Avatar>
          <FluentEmoji type={'anim'} {...control} className="-mt-6" />
        </Avatar>
        <Typography.Text className="hidden md:inline text-gray-500 font-bold">
          Personal
        </Typography.Text>
      </Space>
    ),
    right: (
      <Space style={{ marginRight: '1rem' }}>
        <Button
          type="primary"
          icon={<SettingOutlined />}
          className="text-gray-500 font-bold"
          onClick={() => {
            const [path] = getPathAndModule(location.pathname);
            history.push(`${path}/setting/providers`);
          }}
        >
          {intl.formatMessage({ id: 'cube.space.tab.setting' })}
        </Button>
      </Space>
    ),
  };

  return (
    <>
      <TabHeader
        tabBarRender
        items={items}
        tabBarExtraContent={tabBarExtraContent}
      />
    </>
  );
};

export default Workspace;
