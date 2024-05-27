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

import { getPathAndModule, workspaceService } from '@/services';
import { WorkspaceType } from '@/services/workspace';
import { WORKSPACE } from '@/services/workspace/typings';
import { SettingOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { history, useIntl, useLocation, useParams } from '@umijs/max';
import { Avatar, Button, Space, TabsProps, Typography } from 'antd';
import {
  Bot,
  Box,
  LibraryBig,
  MessageSquareCode,
  Workflow,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import TabHeader from './components/TabHeader';

const isPublicSpace = (space?: WORKSPACE.WorkspaceEntity) => {
  return space?.type === WorkspaceType.PUBLIC;
};

const Workspace: React.FC = () => {
  const intl = useIntl();

  const location = useLocation();
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
      key: 'bots',
      label: (
        <>
          <Space align='center' size={0}>
            <Bot size={22} className="ant-tabs-tab-btn-icon" />
            {intl.formatMessage({ id: 'cube.space.tab.bots' })}
          </Space>
        </>
      ),
      children: 'Content of Tab Pane Bots',
    },
    {
      key: 'plugins',
      label: (
        <>
          <Space align='center' size={0}>
            <Box size={22} className="ant-tabs-tab-btn-icon" />
            {intl.formatMessage({ id: 'cube.space.tab.plugins' })}
          </Space>
        </>
      ),
      children: 'Content of Tab Pane Plugins',
    },
    {
      key: 'workflows',
      label: (
        <>
          <Space align='center' size={0}>
            <Workflow size={22} className="ant-tabs-tab-btn-icon" />
            {intl.formatMessage({ id: 'cube.space.tab.workflows' })}
          </Space>
        </>
      ),
      children: 'Content of Tab Pane Workflows',
    },
    {
      key: 'knowledges',
      label: (
        <>
          <Space align='center' size={0}>
            <LibraryBig size={22} className="ant-tabs-tab-btn-icon" />
            {intl.formatMessage({ id: 'cube.space.tab.knowledge' })}
          </Space>
        </>
      ),
      children: 'Content of Tab Pane Knowledges',
    },
    {
      key: 'cards',
      label: (
        <>
          <Space align='center' size={0}>
            <MessageSquareCode size={22} className="ant-tabs-tab-btn-icon" />
            {intl.formatMessage({ id: 'cube.space.tab.cards' })}
          </Space>
        </>
      ),
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
          {isPublicSpace(workspace)
            ? workspace?.name
            : intl.formatMessage({ id: 'cube.menu.personal' })}
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
