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
import { Divider, Flex, Image, Space, Tooltip, Typography } from 'antd';
import { CSSProperties } from 'react';
import IdeaSlogan from '../logo/IdeaSlogan';

const FooterSimple: React.FC<{
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ className, style }) => {
  const licenseInfo = (
    <Flex gap="large" justify="center" align="start" vertical>
      <Flex gap="middle" justify="center" align="start" vertical>
        <Space align="end">
          <Image
            src="/logo.png"
            alt="CubeBit Logo"
            width={32}
            height={32}
            preview={false}
          />
          <Typography.Text
            strong
            className="underline decoration-4 decoration-sky-200"
          >
            . CUBE CHAT
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
          <Tooltip
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
          </Tooltip>
          <Divider type="vertical" />
          <LanguageChanger size="small" />
        </Space>
        <Typography.Text className="text-gray-500">
          © 2024 CubeChat Maner·Fan
        </Typography.Text>
      </Flex>
    </Flex>
  );

  return (
    <>
    <Flex gap="small" justify='center' align='center' vertical>
      <Space align="end">
        <Image
          src="/logo.png"
          alt="CubeBit Logo"
          width={32}
          height={32}
          preview={false}
        />
        <Typography.Text className="text-gray-700">© 2024</Typography.Text>
        <Typography.Text
          strong
          className="underline decoration-4 decoration-sky-200"
        >
          . CUBE CHAT
        </Typography.Text>
        <Typography.Text className="text-gray-700">Maner·Fan</Typography.Text>
        <LanguageChanger size="small" />
      </Space>
      <IdeaSlogan className='block underline decoration-4 decoration-sky-200' />
      </Flex>
    </>
  );
};

export default FooterSimple;
