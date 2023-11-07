import { Link, Outlet, useIntl } from 'umi';

import HeaderSimple from '@/components/header/HeaderSimple';
import { Card, Col, Image, Layout, Row } from 'antd';

import LogoBlock from '@/components/logo/LogoBlock';
import styles from './styles.module.scss';
import BackgroundBaanderole from '@/components/background/BackgroundBanderole';

const EntryWrapper: React.FC = () => {
  const intl = useIntl();

  return (
    <Layout className={`w-screen min-h-screen ${styles.layout}`}>
      <HeaderSimple className="m-auto mt-4" />
      <BackgroundBaanderole />
      <Layout.Content className="place-items-center grid">
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
