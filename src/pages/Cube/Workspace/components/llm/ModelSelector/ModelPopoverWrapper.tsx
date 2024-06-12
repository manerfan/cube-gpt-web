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

import type { LLM } from '@/services/llm/typings';
import {
  DownOutlined,
  WarningFilled,
  WarningOutlined,
} from '@ant-design/icons';
import { Flex, Popover, Space, Tooltip, Typography } from 'antd';
import ModelItem from '../ModelItem';

import { ProviderStatus } from '@/services/llm/provider';
import { Box } from 'lucide-react';
import { forwardRef, useImperativeHandle, useState } from 'react';

export interface ModelPopoverWrapperRefProperty {
  closePopover: () => void;
}

/**
 * 模型弹出菜单的包装器
 */
const ModelPopoverWrapper: React.FC<{
  popover: React.ReactNode;
  provider?: LLM.ProviderSchema;
  model?: LLM.ModelSchema;
  providerStatus?: ProviderStatus;
  block?: boolean;
}> = forwardRef(({ popover, provider, model, providerStatus, block }, ref) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    closePopover() {
      setPopoverOpen(false);
    },
  }));

  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        arrow={false}
        content={popover}
        open={popoverOpen}
        onOpenChange={(open) => {
          setPopoverOpen(open);
        }}
      >
        <div
          className={`min-h-8 rounded-md px-2 py-1 cursor-pointer ${
            block ? 'w-full' : 'w-auto'
          } ${
            providerStatus === ProviderStatus.UN_CONFIGURED || model?.deprecated
              ? 'bg-orange-50 hover:bg-orange-100'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Flex justify="space-between" align="center">
            <ModelItem
              providerSchema={provider}
              modelSchema={model}
              slider
              empty={
                <Space align="center">
                  <Box size={16} color="#9A9A9A" className="block" />
                  <Typography.Text type="secondary">选择模型</Typography.Text>
                </Space>
              }
              onClick={() => setPopoverOpen(true)}
            />

            <Space className="ml-3">
              {(providerStatus === ProviderStatus.UN_CONFIGURED ||
                model?.deprecated) && (
                <Tooltip title={model?.deprecated ? '已弃用' : '未配置'}>
                  <Typography.Text type="warning" strong className="leading-8">
                    {model?.deprecated ? (
                      <WarningFilled />
                    ) : (
                      <WarningOutlined />
                    )}
                  </Typography.Text>
                </Tooltip>
              )}
              <Typography.Text
                type="secondary"
                strong
                className="text-xs leading-8"
              >
                <DownOutlined />
              </Typography.Text>
            </Space>
          </Flex>
        </div>
      </Popover>
    </>
  );
});

export default ModelPopoverWrapper;
