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

import { CSSProperties } from 'react';

import { useIntl } from '@umijs/max';
import { Avatar, Button, Divider, Flex, Input, Space, Tooltip, Typography } from 'antd';
import {
  ArrowBigUp,
  AtSign,
  CornerDownLeft,
  FilePlus,
  MessageCircleOff,
  MessageCirclePlus,
  SendHorizontal,
} from 'lucide-react';

const ChatInput: React.FC<{
  onSubmit?: (values: any) => void;
  loading?: boolean | undefined;
  autoFocus?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ onSubmit, loading, autoFocus, className, style }) => {
  const intl = useIntl();

  const inputKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault();
        console.log('Shift + Enter');
      } else {
        console.log('Enter');
      }
    }
  };

  return (
    <>
      <Flex
        vertical
        justify="flex-start"
        align="flex-start"
        className="rounded-xl bg-white py-4 w-full min-h-24"
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          className={`border-0 rounded-0 outline-none focus:outline-none focus:border-0 focus:shadow-none leading-5 w-full min-h-5 px-5 mb-3`}
          placeholder="和我聊聊天吧"
          onKeyDown={inputKeyDown}
        />

        {/* 底部按钮 */}
        <Flex justify="space-between" align="center" className="w-full px-4">
          {/* 新建会话 */}
          <Tooltip title="新建对话">
            <Button size="small" type="text" className="p-1">
              <MessageCirclePlus size={18} />
            </Button>
          </Tooltip>

          <Space align="center">
            <Typography.Text type="secondary">
              <Space align="center" size={4}>
                <CornerDownLeft size={14} className="relative top-0.5" />
                <span>换行</span>
                <span>/</span>
                <CornerDownLeft size={14} className="relative top-0.5" />
                <ArrowBigUp size={16} className="relative top-0.5" />
                <span>发送</span>
              </Space>
            </Typography.Text>

            {/* 选择机器人 */}
            <Tooltip title="@机器人">
              <Button
                size="small"
                type="text"
                className="p-1"
                disabled={loading}
              >
                <AtSign size={18} />
              </Button>
            </Tooltip>

            {/* 添加附件 */}
            <Tooltip title="上传文件">
              <Button
                size="small"
                type="text"
                className="p-1"
                disabled={loading}
              >
                <FilePlus size={18} />
              </Button>
            </Tooltip>

            <Divider type="vertical" />

            {/* 发起会话 */}
            {!loading ? (
              <Tooltip title="发送">
                <Button size="small" type='primary' className="p-1" icon={<img src="/logo.png" alt="cubechat" width={18} />}>
                  发送
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="停止">
                <Button size="small" type="primary" className="p-1" icon={<MessageCircleOff size={18} />}>
                  停止
                </Button>
              </Tooltip>
            )}
          </Space>
        </Flex>
      </Flex>
      <Flex justify="center" align="center" className="w-full mt-3">
        <Typography.Text type="secondary" className="select-none">
          内容由AI生成，无法确保真实准确，仅供参考。
        </Typography.Text>
      </Flex>
    </>
  );
};

export default ChatInput;
