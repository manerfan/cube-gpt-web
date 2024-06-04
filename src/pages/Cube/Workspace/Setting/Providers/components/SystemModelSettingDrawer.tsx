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

import { WORKSPACE } from '@/services/workspace/typings';
import { LeftOutlined, LockFilled, SettingOutlined } from '@ant-design/icons';
import { Button, Drawer, Flex, Result, Space, Typography } from 'antd';

const SystemModelSettingDrawer: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  open: boolean;
  onClose?: () => void;
}> = ({ workspace, open, onClose }) => {
  const getDrawerWidth = () => {
    return window.innerWidth < 576 ? '100%' : 520;
  };

  return (
    <>
      <Drawer
        title={
          <Space>
            <Button
              type="text"
              icon={<LeftOutlined />}
              className="text-gray-500 font-bold w-5 md:hidden"
              onClick={() => onClose?.()}
            />
            <SettingOutlined />
            系统模型设置
          </Space>
        }
        extra
        placement="right"
        closeIcon={false}
        open={open}
        onClose={() => onClose?.()}
        width={getDrawerWidth()}
        destroyOnClose
        footer={
          <Flex align="center" justify="center">
            <Typography.Text type="secondary">
              <LockFilled /> 您的信息将使用{' '}
              <Typography.Link
                href="https://pycryptodome.readthedocs.io/en/latest/src/cipher/oaep.html"
                target="_blank"
              >
                PKCS1_OAEP
              </Typography.Link>{' '}
              技术进行加密和存储。
            </Typography.Text>
          </Flex>
        }
      >
        <Result
          title="敬请期待"
          extra={<Button onClick={onClose}>返回</Button>}
        />
      </Drawer>
    </>
  );
};

export default SystemModelSettingDrawer;
