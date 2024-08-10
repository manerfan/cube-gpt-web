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

import { history, useIntl, useModel } from '@umijs/max';

import { EMAIL_PATTERN, PASSWORD_PATTERN } from '@/constants';
import { systemService } from '@/services';
import {
  ContactsOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect } from 'react';

const Login: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const submitSetup = async (formData: any) => {
    const { content } = await systemService.setup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (content) {
      window.location.href = '/login';
    } else {
      message.error('Init Error!');
    }
  };

  useEffect(() => {
    if (!!initialState?.setupStatus) {
      history.push('/login');
    }
  }, [initialState]);

  return (
    <ProForm name="modu_chat_setup" onFinish={submitSetup} className='px-8 py-6'>
      <ProFormText
        name="name"
        rules={[
          {
            required: true,
            min: 3,
            max: 32,
            message: intl.formatMessage({ id: 'login.username.tip' }),
          },
        ]}
        placeholder={intl.formatMessage({ id: 'login.username.placeholder' })}
        fieldProps={{
          size: 'large',
          maxLength: 32,
          prefix: <UserOutlined className="site-form-item-icon" />,
        }}
      />
      <ProFormText
        name="email"
        rules={[
          {
            required: true,
            min: 5,
            max: 128,
            pattern: EMAIL_PATTERN,
            message: intl.formatMessage({ id: 'login.email.tip' }),
          },
        ]}
        placeholder={intl.formatMessage({ id: 'login.email.placeholder' })}
        fieldProps={{
          size: 'large',
          maxLength: 128,
          prefix: <ContactsOutlined className="site-form-item-icon" />,
        }}
      />
      <ProFormText.Password
        name="password"
        rules={[
          {
            required: true,
            min: 6,
            max: 32,
            pattern: PASSWORD_PATTERN,
            message: intl.formatMessage({ id: 'login.password.tip' }),
          },
        ]}
        placeholder={intl.formatMessage({ id: 'login.password.placeholder' })}
        fieldProps={{
          size: 'large',
          minLength: 6,
          maxLength: 32,
          prefix: <LockOutlined className="site-form-item-icon" />,
        }}
      />
    </ProForm>
  );
};

export default Login;
