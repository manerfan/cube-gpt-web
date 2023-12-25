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

import { Link, Outlet, useIntl } from '@umijs/max';

import HeaderSimple from '@/components/header/HeaderSimple';
import { Card, Col, Image, Layout, Row } from 'antd';

import LogoBlock from '@/components/logo/LogoBlock';
import styles from './styles.module.scss';
import BackgroundBanderole from '@/components/background/BackgroundBanderole';

const EntryWrapper: React.FC = () => {
  const intl = useIntl();

  return (
    <Layout className={`w-screen min-h-screen ${styles.layout}`}>
      <HeaderSimple className="m-auto mt-4" />
      
      <BackgroundBanderole />
    
      <Layout.Content className="place-items-center grid mt-16 mb-32 lg:my-0">
        <Row wrap={true} gutter={24} justify="center" className="w-full">
          <Col
            span={22}
            xs={22}
            sm={22}
            md={20}
            lg={10}
            xl={8}
            className="mb-32 -mt-20 lg:mb-0 lg:mt-0"
          >
            <LogoBlock />
          </Col>
          <Col span={22} xs={22} sm={22} md={20} lg={10} xl={8}>
            <Card
              title={
                <h1 className="block mt-16 mb-2 text-lg break-words">
                  {intl.formatMessage({ id: 'chat.slogon' })}
                </h1>
              }
              hoverable
              className="relative w-full"
              style={{ backgroundColor: 'rgb(255,255,255,0.5)' }}
            >
              <Link
                to="/"
                className="absolute place-items-center grid w-20 h-20 -top-10 bg-sky-100 border border-dashed border-sky-300 rounded-full transition-transform hover:shadow-lg hover:shadow-blue-200"
              >
                <Image
                  src="/logo.png"
                  alt="CubeBit Logo"
                  width={50}
                  height={50}
                  preview={false}
                />
              </Link>

              <Outlet />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default EntryWrapper;
