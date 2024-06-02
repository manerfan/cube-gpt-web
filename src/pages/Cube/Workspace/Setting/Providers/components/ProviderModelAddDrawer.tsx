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

import { LLM } from '@/services/llm/provider/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import { LockFilled } from '@ant-design/icons';
import { Button, Drawer, Flex, Result, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import * as icons from '../icons';

const ProviderSettingDrawer: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  providerSchema?: LLM.ProviderSchema;
  open: boolean;
  onClose?: () => void;
}> = ({ workspace, providerSchema, open, onClose }) => {
  const [providerIcon, setProviderIcon] = useState<LLM.ProviderIcon>();

  useEffect(() => {
    if (!providerSchema) {
      return;
    }

    setProviderIcon(icons.getProviderIconBySchema(providerSchema));
  }, [workspace, providerSchema]);

  const getDrawerWidth = () => {
    return window.innerWidth < 576 ? '100%' : 520;
  };

  return (
    <>
      <Drawer
        title={
          <>
            <Space>
              {providerIcon?.avatar()}
              <Typography.Text>
                {providerSchema?.name || '模型设置'}
              </Typography.Text>
            </Space>
          </>
        }
        extra={providerIcon?.combine()}
        placement="right"
        closeIcon={false}
        open={open}
        onClose={onClose}
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
        <Result title="敬请期待" extra={<Button onClick={onClose}>返回</Button>} />
      </Drawer>
    </>
  );
};

export default ProviderSettingDrawer;
