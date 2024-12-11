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

import LanguageChanger from '@/components/language-changer/LanguageChanger';
import { GithubOutlined, WechatOutlined } from '@ant-design/icons';
import {
  Col,
  Divider,
  Flex,
  Image,
  Popover,
  Row,
  Space,
  Typography,
} from 'antd';
import { CSSProperties } from 'react';

const Footer: React.FC<{
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ className, style }) => {
  const licenseInfo = (
    <Flex gap="large" justify="center" align="start" vertical>
      <Flex gap="middle" justify="center" align="start" vertical>
        <Space align="end">
          <Image
            src="/logo.png"
            alt="ModuBit Logo"
            width={32}
            height={32}
            preview={false}
          />
          <Typography.Text
            strong
            className="underline decoration-4 decoration-sky-200"
          >
            . MODU 墨读
          </Typography.Text>
        </Space>
        <Typography.Paragraph className="text-gray-500">
          xxx yyy zzz xxx yyy zzz xxx yyy zzz
          <br />
          xxx yyy zzz xxx yyy zzz xxx yyy zzz
        </Typography.Paragraph>
      </Flex>
      <Flex gap="middle" justify="center" align="start" vertical>
        <Space align="start" size="large">
          <Typography.Link
            href="https://github.com/manerfan"
            target="blank"
            style={{ color: '#000' }}
          >
            <GithubOutlined />
          </Typography.Link>
          <Popover
            title={
              <Image
                src="/wechat.png"
                alt="Maner_Fan"
                width={200}
                height={200}
                preview={false}
              />
            }
          >
            <Typography.Link style={{ color: '#000' }}>
              <WechatOutlined />
            </Typography.Link>
          </Popover>
          <Divider type="vertical" />
          <LanguageChanger size="small" />
        </Space>
        <Typography.Text className="text-gray-500">
          © 2024 . MODU Maner·Fan
        </Typography.Text>
      </Flex>
    </Flex>
  );

  const productInfo = (
    <Flex gap="small" justify="center" align="start" vertical>
      <Typography.Title level={5}>产品</Typography.Title>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        xxx
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        yyy
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        zzz
      </Typography.Link>
    </Flex>
  );

  const resourceInfo = (
    <Flex gap="small" justify="center" align="start" vertical>
      <Typography.Title level={5}>资源</Typography.Title>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        xxx
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        yyy
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        zzz
      </Typography.Link>
    </Flex>
  );

  const teamInfo = (
    <Flex gap="small" justify="center" align="start" vertical>
      <Typography.Title level={5}>团队</Typography.Title>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        xxx
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        yyy
      </Typography.Link>
      <Typography.Link
        href="https://github.com/manerfan"
        target="blank"
        style={{ color: '#000' }}
      >
        zzz
      </Typography.Link>
    </Flex>
  );

  return (
    <Row
      gutter={24}
      className={`max-w-5xl w-full  ${className || ''}`}
      style={style}
    >
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
        className="hidden md:block mt-12"
      >
        {licenseInfo}
      </Col>
      <Col xs={24} sm={8} md={4} lg={4} xl={4} className="mt-12">
        {productInfo}
      </Col>
      <Col xs={24} sm={8} md={4} lg={4} xl={4} className="mt-12">
        {resourceInfo}
      </Col>
      <Col xs={24} sm={8} md={4} lg={4} xl={4} className="mt-12">
        {teamInfo}
      </Col>
      <Col
        xs={24}
        sm={24}
        md={12}
        lg={12}
        xl={12}
        className="block mt-12 md:hidden"
      >
        {licenseInfo}
      </Col>
    </Row>
  );
};

export default Footer;
