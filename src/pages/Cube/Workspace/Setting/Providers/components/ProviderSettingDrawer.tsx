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

import { convertFormSchema2AntdFormSchema } from '@/components/form';
import { getLocaleContent } from '@/locales';
import { LLM } from '@/services/llm/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import { LinkOutlined, LockFilled } from '@ant-design/icons';
import {
  BetaSchemaForm,
  ProFormColumnsType,
  ProSkeleton,
  useIntl,
} from '@ant-design/pro-components';
import { Drawer, Flex, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import * as icons from '../icons';

type DataItem = {
  name: string;
  state: string;
};

const ProviderSettingDrawer: React.FC<{
  workspace: WORKSPACE.WorkspaceEntity;
  providerSchema?: LLM.ProviderSchema;
  open: boolean;
  onClose?: () => void;
}> = ({ workspace, providerSchema, open, onClose }) => {
  const intl = useIntl();
  const [providerIcon, setProviderIcon] = useState<LLM.ProviderIcon>();
  const [formColumns, setFormColumns] = useState<
    ProFormColumnsType<DataItem>[]
  >([]);

  useEffect(() => {
    if (!providerSchema) {
      return;
    }

    // 获取LLM的图标相关
    setProviderIcon(icons.getProviderIconBySchema(providerSchema));

    // 解析 Form Columns
    // https://pro-components.antdigital.dev/components/schema-form
    // https://pro-components.antdigital.dev/components/schema
    setFormColumns(
      convertFormSchema2AntdFormSchema(
        providerSchema.credentialSchemas,
        intl.locale,
      ),
    );
  }, [intl.locale, workspace, providerSchema]);

  const getDrawerWidth = () => {
    return window.innerWidth < 576 ? '100%' : 520;
  };

  return (
    <>
      <Drawer
        title={
          <>
            <Space>
              {providerIcon?.avatar && providerIcon?.avatar}
              <Typography.Text>
                {providerSchema?.name || '模型设置'}
              </Typography.Text>
            </Space>
          </>
        }
        extra={providerIcon?.combine}
        placement="right"
        closeIcon={false}
        open={open}
        onClose={onClose}
        width={getDrawerWidth()}
        destroyOnClose
        autoFocus
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
        <ProSkeleton type="list" />
        <BetaSchemaForm<DataItem>
          layoutType="Form"
          rowProps={{
            gutter: [16, 16],
          }}
          colProps={{
            span: 24,
          }}
          grid
          columns={formColumns}
          isKeyPressSubmit
          onFinish={async (values) => {
            console.log(values);
          }}
        />
        {!!providerSchema?.help && (
          <Typography.Link
            href={providerSchema.help.url}
            target="_blank"
            style={{ display: 'block', marginTop: 16 }}
          >
            <LinkOutlined />{' '}
            {getLocaleContent(
              providerSchema.help.title,
              intl.locale,
              '帮助文档',
            )}
          </Typography.Link>
        )}
      </Drawer>
    </>
  );
};

export default ProviderSettingDrawer;
