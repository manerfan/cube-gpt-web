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

import { css } from '@emotion/css';
import { ConfigProvider, Space } from 'antd';
import React, { useContext } from 'react';

const GradentButtonWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
      border-width: 0;
      background: linear-gradient(45deg, #369eff, #95f3d9);

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(-45deg, #369eff, #95f3d9);
        position: absolute;
        inset: 0;
        opacity: 1;
        border-radius: inherit;
        transition: all 0.5s;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `;
  return (
    <ConfigProvider
      button={{
        className: linearGradientButton,
      }}
    >
      <Space>{children}</Space>
    </ConfigProvider>
  );
};

export default GradentButtonWrapper;
