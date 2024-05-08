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

import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { ReactNode } from 'react';
import styles from './styles.content.module.scss';

const CubeContentWrapper: React.FC<{
  children: ReactNode;
  header: ReactNode;
  menu?: ReactNode;
}> = ({ children, header, menu }) => {
  return (
    <Layout className="min-h-screen z-10">
      {!!menu && <Sider collapsible>{menu}</Sider>}
      <Layout className={`min-h-screen ${styles['layout-content']}`}>
        <Layout.Header className="flex items-center absolute h-16">{header}</Layout.Header>

        <Layout.Content className='pt-16'>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default CubeContentWrapper;
