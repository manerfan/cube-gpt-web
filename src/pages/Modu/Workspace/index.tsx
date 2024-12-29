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
import { SmileOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { useIntl, useParams } from '@umijs/max';
import { Avatar, Result, Space, TabsProps, Typography } from 'antd';
import { BookCopy, Bot, BrainCircuit, } from 'lucide-react';
import { useEffect, useState } from 'react';
import TabHeader from '@/components/common/TabHeader';
import Providers from './Setting/Providers';
import Studio from './Studio';

const isPublicSpace = (space?: WORKSPACE.WorkspaceEntity) => {
  return space?.type === WorkspaceType.PUBLIC;
};

const Workspace: React.FC = () => {
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
      key: 'studio',
      label: (
        <>
          <Space align="center" size={0}>
            <Bot size={22} className="ant-tabs-tab-btn-icon" />
            工作室
          </Space>
        </>
      ),
      children: <Studio workspaceUid={param!.spaceId!} />,
    },
    {
      key: 'resource',
      label: (
        <>
          <Space align="center" size={0}>
            <BookCopy size={22} className="ant-tabs-tab-btn-icon" />
            资源库
          </Space>
        </>
      ),
      children: <Result
        icon={<SmileOutlined />}
        title="资源库正在建设中，敬请期待..."
      />,
    }, {
      key: 'provider',
      label: (
        <>
          <Space align="center" size={0}>
            <BrainCircuit size={22} className="ant-tabs-tab-btn-icon" />
            模型管理
          </Space>
        </>
      ),
      children: <Providers workspaceUid={param!.spaceId!} />,
    },


    // {
    //   key: 'plugins',
    //   label: (
    //     <>
    //       <Space align="center" size={0}>
    //         <Box size={22} className="ant-tabs-tab-btn-icon" />
    //         {intl.formatMessage({ id: 'modu.space.tab.plugins' })}
    //       </Space>
    //     </>
    //   ),
    //   children: 'Content of Tab Pane Plugins',
    // },
    // {
    //   key: 'workflows',
    //   label: (
    //     <>
    //       <Space align="center" size={0}>
    //         <Workflow size={22} className="ant-tabs-tab-btn-icon" />
    //         {intl.formatMessage({ id: 'modu.space.tab.workflows' })}
    //       </Space>
    //     </>
    //   ),
    //   children: 'Content of Tab Pane Workflows',
    // },
    // {
    //   key: 'knowledges',
    //   label: (
    //     <>
    //       <Space align="center" size={0}>
    //         <LibraryBig size={22} className="ant-tabs-tab-btn-icon" />
    //         {intl.formatMessage({ id: 'modu.space.tab.knowledge' })}
    //       </Space>
    //     </>
    //   ),
    //   children: 'Content of Tab Pane Knowledges',
    // },
    // {
    //   key: 'cards',
    //   label: (
    //     <>
    //       <Space align="center" size={0}>
    //         <MessageSquareCode size={22} className="ant-tabs-tab-btn-icon" />
    //         {intl.formatMessage({ id: 'modu.space.tab.cards' })}
    //       </Space>
    //     </>
    //   ),
    //   children: 'Content of Tab Pane Cards',
    // },
  ];

  // tab左右两侧内容
  const tabBarExtraContent = {
    left: (
      <Space style={{ marginLeft: '1rem' }}>
        <Avatar icon={<FluentEmoji type={'anim'} {...control} />} />
        <Typography.Text className="hidden md:inline text-gray-500 font-bold">
          {isPublicSpace(workspace)
            ? workspace?.name
            : intl.formatMessage({ id: 'modu.menu.personal' })}
        </Typography.Text>
      </Space>
    ),
    // right: (
    //   <Space style={{ marginRight: '1rem' }}>
    //     <Button
    //       type="primary"
    //       icon={<SettingOutlined />}
    //       className="text-gray-500 font-bold border-colorful"
    //       onClick={() => {
    //         const [path] = getPathAndModule(location.pathname);
    //         history.push(`${path}/setting/providers`);
    //       }}
    //     >
    //       {intl.formatMessage({ id: 'modu.space.tab.setting' })}
    //     </Button>
    //   </Space>
    // ),
  };

  return (
    <>
      <TabHeader
        centered
        sticky
        locationUpdate
        tabBarRender
        items={items}
        defaultActiveKey={param.spaceModule || 'studio'}
        tabBarExtraContent={tabBarExtraContent}
      />
    </>
  );
};

export default Workspace;
