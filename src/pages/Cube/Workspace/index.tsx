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
import { useParams } from '@umijs/max';
import { Avatar, Button, Space, Tabs, TabsProps, Typography } from 'antd';
import StickyBox from 'react-sticky-box';

const items: TabsProps['items'] = [
  {
    key: 'bots',
    label: 'Bots',
    children: 'Content of Tab Pane 1',
  },
  {
    key: 'plugins',
    label: 'Plugins',
    children: 'Content of Tab Pane 2',
  },
  {
    key: 'workflows',
    label: 'Workflows',
    children: 'Content of Tab Pane 3',
  },
  {
    key: 'knowledges',
    label: 'Knowledge',
    children: 'Content of Tab Pane 3',
  },
  {
    key: 'cards',
    label: 'Cards',
    children: 'Content of Tab Pane 3',
  },
];

const onChange = (key: string) => {
  console.log(key);
};

const Store: React.FC = () => {
  const params = useParams();

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

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox style={{ zIndex: 1 }}>
      <DefaultTabBar
        {...props}
        style={{
          background: 'rgb(245, 245, 245, .2)',
          backdropFilter: 'blur(5px)',
          padding: '.6rem 0',
        }}
      />
    </StickyBox>
  );
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        centered
        size="large"
        renderTabBar={renderTabBar}
        tabBarExtraContent={{
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
                className="text-gray-500 font-bold	"
              >
                Setting
              </Button>
            </Space>
          ),
        }}
        items={items}
        onChange={onChange}
      />
      <span>{params.spaceId}</span>
      <span>{params.spaceModule}</span>
    </>
  );
};

export default Store;
