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

import { CSSProperties, useState } from 'react';

import {
  Button,
  Divider,
  Flex,
  Input,
  message,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import {
  ArrowBigUp,
  AtSign,
  CornerDownLeft,
  FilePlus,
  MessageCircleOff,
  Sparkles,
} from 'lucide-react';

const ChatInput: React.FC<{
  onSubmit?: (values: any) => void;
  loading?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ onSubmit, loading, className, style }) => {
  const [query, setQuery] = useState('');

  const submit = () => {
    if (!_.isEmpty(query)) {
      onSubmit?.(query);
    }
    setQuery('');
  };

  const inputKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        // 换行
        if (event.shiftKey) {
          // 发送
          event.preventDefault();
          submit();
        }
        break;
      }
      case '@': {
        // 召唤机器人
        break;
      }
      case '/':
      case '、': {
        // 召唤技能
        message.info('input /');
        break;
      }

      default:
        break;
    }
  };

  return (
    <>
      {loading && (
        <Flex
        justify="center"
        align="center"
        className='w-full mb-3'
      >
        <Button
          type="primary"
          icon={<MessageCircleOff size={16} />}
        >
          停止响应
        </Button>
        </Flex>
      )}
      <Flex
        vertical
        justify="flex-start"
        align="flex-start"
        style={style}
        className={`rounded-xl bg-white py-4 w-full min-h-24 ${className}`}
      >
        <Input.TextArea
          autoSize={{ minRows: 1, maxRows: 6 }}
          className={`border-0 rounded-0 outline-none focus:outline-none focus:border-0 focus:shadow-none leading-5 w-full min-h-5 px-5 mb-3`}
          placeholder="发送消息、@Bot 有什么问题尽管问我..."
          readOnly={loading}
          onKeyDown={inputKeyDown}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* 底部按钮 */}
        <Flex justify="space-between" align="center" className="w-full px-4">
          {/* 技能 */}
          <Tooltip title="技能">
            <Button size="small" type="text" className="p-1" disabled={loading}>
              <Sparkles size={18} />
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
                <Button
                  size="small"
                  type="primary"
                  className="py-1 px-2 bg-sky-50"
                  icon={<img src="/logo.png" alt="cubechat" width={18} />}
                  onClick={submit}
                />
              </Tooltip>
            ) : (
              <Tooltip title="停止">
                <Button
                  size="small"
                  type="primary"
                  className="py-1 px-2"
                  icon={<MessageCircleOff size={18} />}
                />
              </Tooltip>
            )}
          </Space>
        </Flex>
      </Flex>
    </>
  );
};

export default ChatInput;
