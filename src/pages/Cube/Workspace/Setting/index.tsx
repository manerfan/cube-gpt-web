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

import { LeftOutlined, MoreOutlined, SettingOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { history, useIntl } from '@umijs/max';
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Space,
  TabsProps,
  Tag,
  Typography,
} from 'antd';
import TabHeader from '../components/TabHeader';

const Setting: React.FC = () => {
  const intl = useIntl();

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
      key: 'members',
      label: intl.formatMessage({ id: 'cube.space.setting.tab.members' }),
      children: 'Content of Tab Pane Providers',
      disabled: true,
    },
    {
      key: 'providers',
      label: intl.formatMessage({ id: 'cube.space.setting.tab.providers' }),
      children: 'Content of Tab Pane Providers',
    },
  ];

  const moreItems: MenuProps['items'] = [
    {
      label: (
        <Typography.Text>
          {intl.formatMessage({
            id: 'cube.space.setting.tab.more.transferOwner',
          })}
        </Typography.Text>
      ),
      key: 'transferOwner',
      disabled: true,
    },
    {
      label: (
        <Typography.Text type="danger">
          {intl.formatMessage({ id: 'cube.space.setting.tab.more.deleteTeam' })}
        </Typography.Text>
      ),
      key: 'deleteTeam',
      disabled: true,
    },
  ];

  // tab左右两侧内容
  const tabBarExtraContent = {
    left: (
      <Space style={{ marginLeft: '1rem' }}>
        <Button
          type="text"
          icon={<LeftOutlined />}
          className="text-gray-500 font-bold"
          onClick={() => history.back()}
        />
        <Avatar>
          <FluentEmoji type={'anim'} {...control} className="-mt-6" />
        </Avatar>
        <Typography.Text className="hidden md:inline text-gray-500 font-bold">
          Personal
        </Typography.Text>
        <Tag icon={<SettingOutlined />} color="#bee3ff">
          {intl.formatMessage({ id: 'cube.space.tab.setting' })}
        </Tag>
      </Space>
    ),
    right: (
      <Space style={{ marginRight: '1rem' }}>
        <Dropdown menu={{ items: moreItems }} trigger={['click']}>
          <Button
            shape="circle"
            icon={<MoreOutlined />}
            size="small"
            className="text-gray-500 font-bold"
          />
        </Dropdown>
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

export default Setting;
