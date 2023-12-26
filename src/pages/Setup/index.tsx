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
import { setupService } from '@/services';
import {
  ContactsOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';

const Login: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const [loading, setLoading] = useState(false);
  const submitSetup = async (formData: any) => {
    setLoading(true);
    const { content } = await setupService.setup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }).finally(() => setLoading(false));
  
    if (content) {
      history.push('/login');
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
    <Form name="cube_chat_login" onFinish={submitSetup}>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            min: 3,
            max: 32,
            message: intl.formatMessage({ id: 'login.username.tip' }),
          },
        ]}
      >
        <Input
          size="large"
          minLength={3}
          maxLength={32}
          prefix={<UserOutlined className="site-form-item-icon" />}
          type="text"
          placeholder={intl.formatMessage({ id: 'login.username.placeholder' })}
        />
      </Form.Item>
      <Form.Item
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
      >
        <Input
          size="large"
          maxLength={128}
          prefix={<ContactsOutlined className="site-form-item-icon" />}
          type="text"
          placeholder={intl.formatMessage({ id: 'login.email.placeholder' })}
        />
      </Form.Item>
      <Form.Item
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
      >
        <Input
          size="large"
          minLength={6}
          maxLength={32}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder={intl.formatMessage({ id: 'login.password.placeholder' })}
        />
      </Form.Item>

      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          className="login-form-button"
          size="large"
          loading={loading}
        >
          {intl.formatMessage({ id: 'login.button.login' })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
