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

import { Layout, Menu } from 'antd';

import styles from './styles.module.scss';

import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { ThemeProvider } from '@lobehub/ui';
import { useState } from 'react';

const EntryWrapper: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <Layout className={`w-screen min-h-screen ${styles.layout}`}>
        <Layout.Sider theme='light' trigger={null} collapsible collapsed={collapsed}>
          <span>abc</span>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: 'nav 1',
              },
              {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'nav 2',
              },
              {
                key: '3',
                icon: <UploadOutlined />,
                label: 'nav 3',
              },
            ]}
          />
        </Layout.Sider>
      </Layout>
    </ThemeProvider>
  );
};

export default EntryWrapper;
