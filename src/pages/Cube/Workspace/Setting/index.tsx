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

import { workspaceService } from '@/services';
import { WorkspaceType } from '@/services/workspace';
import { WORKSPACE } from '@/services/workspace/typings';
import { EditOutlined, LeftOutlined, MoreOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { history, useIntl, useParams } from '@umijs/max';
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  Space,
  TabsProps,
  Typography,
} from 'antd';
import { BrainCircuit, Contact } from 'lucide-react';
import { useEffect, useState } from 'react';
import TabHeader from '../components/TabHeader';
import Providers from './Providers';

const isPublicSpace = (space?: WORKSPACE.WorkspaceEntity) => {
  return space?.type === WorkspaceType.PUBLIC;
};

const Setting: React.FC = () => {
  const intl = useIntl();

  const param = useParams();

  const [workspace, setWorkspace] = useState<WORKSPACE.WorkspaceEntity>();

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

  useEffect(() => {
    workspaceService.detail(param!.spaceId!).then((res) => {
      const space = res.content;
      setWorkspace(space);
    });
  }, [param.spaceId]);

  // tab内容
  const items: TabsProps['items'] = [
    {
      key: 'members',
      label: (
        <>
          <Contact className="ant-tabs-tab-btn-icon" />
          {intl.formatMessage({ id: 'cube.space.setting.tab.members' })}
        </>
      ),
      children: 'Content of Tab Pane Providers',
      disabled: true,
    },
    {
      key: 'providers',
      label: (
        <>
          <BrainCircuit className="ant-tabs-tab-btn-icon" />
          {intl.formatMessage({ id: 'cube.space.setting.tab.providers' })}
        </>
      ),
      children: <Providers />,
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
          {isPublicSpace(workspace)
            ? workspace?.name
            : intl.formatMessage({ id: 'cube.menu.personal' })}
        </Typography.Text>
        {!isPublicSpace(workspace) && <Button type='text' icon={<EditOutlined />} className="hidden md:inline text-gray-500" />}
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
