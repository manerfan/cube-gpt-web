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

import {
  ACCESS_TOKEN,
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  TOKEN_TYPE,
} from '@/constants';
import { authService } from '@/services';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { useEffect } from 'react';

const redirectUri = () => {
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('redirectUri') || '/';
};

const Login: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');

  const submitLogin = async (formData: any) => {
    const { content: auth } = await authService.login({
      username: formData.username,
      password: formData.password,
    });

    window.localStorage.setItem(ACCESS_TOKEN, auth.access_token);
    window.localStorage.setItem(TOKEN_TYPE, auth.token_type || 'bearer');
    window.location.href = redirectUri();
  };

  useEffect(() => {
    if (!!initialState?.userMe) {
      history.push('/');
    }
  }, [initialState]);

  return (
    <LoginForm name="cube_chat_login" onFinish={submitLogin}>
      <ProFormText
        name="username"
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
          prefix: <UserOutlined className="site-form-item-icon" />,
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
    </LoginForm>
  );
};

export default Login;
