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

import BackgroundBanderole from '@/components/background/BackgroundBanderole';
import Footer from '@/components/footer/Footer';
import HeaderSimple from '@/components/header/HeaderSimple';
import LogoInfo from '@/components/logo/LogoInfo';
import { ThemeProvider } from '@lobehub/ui';

import { Card, Col, Row, Space, Typography } from 'antd';

const HomePage: React.FC = () => {
  return (
    <ThemeProvider>
      <BackgroundBanderole />

      <main
        className="flex relative flex-col h-full min-h-screen items-center justify-between p-5 sm:px-10 md:px-15 lg:px-24"
        style={{ gridTemplateRows: 'auto 1fr auto' }}
      >
        <HeaderSimple />

        <LogoInfo className="mt-24 lg:mt-32 " />

        <div className="mt-20 mb-16 md:mb-20 max-w-5xl w-full">
          <Row justify="space-between" gutter={[8, 8]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Card
                bordered={false}
                className="backdrop-blur-md bg-white/30"
                styles={{ header: { borderBottom: 'none' } }}
                title={
                  <>
                    <Typography.Text strong className="text-2xl">
                      M
                    </Typography.Text>
                    <Typography.Text>odular</Typography.Text>
                  </>
                }
              >
                <Space direction="vertical">
                  <Typography.Text>模块化</Typography.Text>
                  <Typography.Text>xxxx xxxx</Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Card
                bordered={false}
                className="backdrop-blur-md bg-white/30"
                styles={{ header: { borderBottom: 'none' } }}
                title={
                  <>
                    <Typography.Text strong className="text-2xl">
                      O
                    </Typography.Text>
                    <Typography.Text>pen</Typography.Text>
                  </>
                }
              >
                <Space direction="vertical">
                  <Typography.Text>开放</Typography.Text>
                  <Typography.Text>xxxx xxxx</Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Card
                bordered={false}
                className="backdrop-blur-md bg-white/30"
                styles={{ header: { borderBottom: 'none' } }}
                title={
                  <>
                    <Typography.Text strong className="text-2xl">
                      D
                    </Typography.Text>
                    <Typography.Text>iverse</Typography.Text>
                  </>
                }
              >
                <Space direction="vertical">
                  <Typography.Text>多样化</Typography.Text>
                  <Typography.Text>xxxx xxxx</Typography.Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6}>
              <Card
                bordered={false}
                className="backdrop-blur-md bg-white/30"
                styles={{ header: { borderBottom: 'none' } }}
                title={
                  <>
                    <Typography.Text strong className="text-2xl">
                      U
                    </Typography.Text>
                    <Typography.Text>ser-Centric</Typography.Text>
                  </>
                }
              >
                <Space direction="vertical">
                  <Typography.Text>以用户为中心</Typography.Text>
                  <Typography.Text>xxxx xxxx</Typography.Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>

        <Footer className="py-4 grow-0 shrink-0 mb-36 lg:mb-2" />
      </main>
    </ThemeProvider>
  );
};

export default HomePage;
