/**
 * Copyright 2023 Maner·Fan
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

import { useIntl } from 'umi';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

const Login: React.FC = () => {
  const intl = useIntl();

  return (
    <Form name="cube_chat_login">
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'login.username.tip' }),
          },
        ]}
      >
        <Input
          size="large"
          maxLength={32}
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={intl.formatMessage({ id: 'login.username.placeholder' })}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'login.password.tip' }),
          },
        ]}
      >
        <Input
          size="large"
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
        >
          {intl.formatMessage({ id: 'login.button.login' })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
