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

import _ from 'lodash';

// import BackgroundFaintly from '@/components/background/BackgroundFaintly';
import styles from './styles.module.scss';

import LanguageChanger from '@/components/language-changer/LanguageChanger';
import IdeaSlogan from '@/components/logo/IdeaSlogan';
import { workspaceService } from '@/services';
import { WorkspaceType } from '@/services/workspace';
import {
  FileTextOutlined,
  GithubOutlined,
  MailOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import {
  FluentEmoji,
  FluentEmojiProps,
  ThemeProvider,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { Outlet, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Layout,
  Menu,
  Popover,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { Bot, Box, Home, Speech, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
type MenuItem = Required<MenuProps>['items'][number];

const CubeWrapper: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const store = useCreateStore();
  const control: FluentEmojiProps = useControls(
    {
      emoji: '👨‍🦱',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
    },
    { store },
  );

  const [collapsed, setCollapsed] = useState(true);
  const [menuItems, setMenuItems] = useState<{ [key: string]: MenuItem[] }>({});

  useEffect(() => {
    // 查询空间列表
    workspaceService.list().then((resp) => {
      const workspaces = resp.content;

      // 私有空间
      const privateSpace = _.head(
        _.filter(
          workspaces,
          (workspace) => workspace.type === WorkspaceType.PRIVATE,
        ),
      );
      console.log(privateSpace);

      // 公共空间
      const publicSpaces =
        _.filter(
          workspaces,
          (workspace) => workspace.type === WorkspaceType.PUBLIC,
        ) || [];
      console.log(publicSpaces);

      setMenuItems({
        default: [
          { key: 'menu-chat', icon: <Home />, label: 'Chat' },
          { key: 'menu-personal', icon: <User />, label: 'Personal' },
        ],
        explore: [
          { key: 'menu-bot-store', icon: <Bot />, label: 'Bot Store' },
          { key: 'menu-plugin-store', icon: <Box />, label: 'Plugin Store' },
        ],
        teams: [
          { key: 'menu-team-1', icon: <Users />, label: 'Team 1' },
          { key: 'menu-team-2', icon: <Speech />, label: 'Team 2' },
        ],
      });
    });
  }, [initialState?.userMe]);

  return (
    <ThemeProvider>
      {/* <BackgroundFaintly /> */}
      <ProLayout
        logo="/logo.png"
        title=". CUBE CHAT"
        className={`${styles.layout}`}
        collapsed={collapsed}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
        route={[]}
        menuHeaderRender={(logo, title) => {
          if (collapsed) return logo;
          return (
            <>
              {logo}
              <span className={`${styles.title} text-animation`}>{title}</span>
            </>
          );
        }}
        siderMenuType="group"
        menuExtraRender={() => {
          return (
            <>
              <Space direction="vertical">
                {!collapsed && (
                  <Button block type="primary">
                    <PlusOutlined /> Create Bot
                  </Button>
                )}
                <Menu mode="inline" items={menuItems.default} />
              </Space>

              <Divider />

              <Space direction="vertical">
                {!collapsed && (
                  <Flex justify="space-between" align="center">
                    <Typography.Text type="secondary">Explore</Typography.Text>
                  </Flex>
                )}
                <Menu mode="inline" items={menuItems.explore} />
              </Space>

              <Divider />

              <Space direction="vertical">
                {!collapsed && (
                  <>
                    <Flex justify="space-between" align="center">
                      <Typography.Text type="secondary">Teams</Typography.Text>
                      <Tooltip title="Create Team" color="#E6E6E6">
                        <Button
                          className="text-gray-400"
                          type="text"
                          size="small"
                          icon={<PlusOutlined />}
                        />
                      </Tooltip>
                    </Flex>
                  </>
                )}
                <Menu mode="inline" items={menuItems.teams} />
              </Space>
            </>
          );
        }}
        menuFooterRender={() => {
          if (collapsed) return undefined;
          return (
            <>
              <Divider style={{ margin: '1rem auto' }} />
              <Flex justify="space-between" align="center">
                <Tooltip title="Document" color="#E6E6E6">
                  <Button className="text-gray-500" type="text">
                    <FileTextOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="Github" color="#E6E6E6">
                  <Button className="text-gray-500" type="text">
                    <Typography.Link
                      href="https://github.com/CubewiseBit/cube-chat-server"
                      target="_blank"
                      style={{ color: 'inherit' }}
                    >
                      <GithubOutlined />
                    </Typography.Link>
                  </Button>
                </Tooltip>
                <Tooltip title="Feedback" color="#E6E6E6">
                  <Button className="text-gray-500" type="text">
                    <Typography.Link
                      href="mailto:manerfan@163.com"
                      target="_blank"
                      style={{ color: 'inherit' }}
                    >
                      <MailOutlined />
                    </Typography.Link>
                  </Button>
                </Tooltip>
              </Flex>

              <Space className="ml-5">
                <Typography.Text className="text-gray-700">
                  © 2024
                </Typography.Text>
                <Typography.Text
                  strong
                  className="underline decoration-4 decoration-sky-200"
                >
                  . CUBE CHAT
                </Typography.Text>
                <LanguageChanger size="small" />
              </Space>
              <IdeaSlogan className="ml-5 block underline decoration-4 decoration-sky-200" />
            </>
          );
        }}
        avatarProps={{
          size: 'small',
          render: () => {
            return (
              <>
                <Popover trigger="click" title={<></>}>
                  <Button type="text" style={{ height: 50 }}>
                    <Space>
                      <Avatar>
                        <FluentEmoji
                          type={'anim'}
                          {...control}
                          className="-mt-6"
                        />
                      </Avatar>
                      {!collapsed && (
                        <Typography.Text className="hidden md:inline">
                          {initialState?.userMe?.name}
                        </Typography.Text>
                      )}
                    </Space>
                  </Button>
                </Popover>
              </>
            );
          },
        }}
        bgLayoutImgList={[
          {
            src: '/bg/grid-bl.png',
            bottom: 0,
            left: 0,
            width: '420px',
          },
        ]}
      >
        <Layout className={`w-screen min-h-screen flex flex-col`}>
          <Outlet />
        </Layout>
      </ProLayout>
    </ThemeProvider>
  );
};

export default CubeWrapper;
