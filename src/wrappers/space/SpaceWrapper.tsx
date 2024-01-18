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

import BackgroundFaintly from '@/components/background/BackgroundFaintly';
import styles from './styles.module.scss';

import LanguageChanger from '@/components/language-changer/LanguageChanger';
import IdeaSlogan from '@/components/logo/IdeaSlogan';
import { ProLayout } from '@ant-design/pro-components';
import {
  FluentEmoji,
  FluentEmojiProps,
  ThemeProvider,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { Outlet } from '@umijs/max';
import { Avatar, Button, Layout, Popover, Space, Typography } from 'antd';
import { useState } from 'react';

const EntryWrapper: React.FC = () => {
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

  return (
    <ThemeProvider>
      <BackgroundFaintly />
      <ProLayout
        logo="/logo.png"
        title=". CUBE CHAT"
        className={`${styles.layout}`}
        collapsed={collapsed}
        onCollapse={(collapsed) => {
          setCollapsed(collapsed);
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <>
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
                          Maner·Fan
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
            src: '/bg/top_bg.png',
            top: 0,
            left: 0,
            width: '720px',
          },
          {
            src: '/bg/cloud-blur.png',
            bottom: -68,
            right: -45,
            height: '320px',
          },
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

export default EntryWrapper;
