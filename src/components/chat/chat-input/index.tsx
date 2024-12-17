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

import React, { CSSProperties, useRef, useState } from 'react';

import {
  Button,
  Divider,
  Flex,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import {
  ArrowBigUp,
  AtSign,
  Command,
  CornerDownLeft,
  FilePlus,
  Maximize2,
  MessageCircleOff,
  Minimize2,
  Sparkles,
  SquareSplitVertical,
} from 'lucide-react';

import type { MESSAGE } from '@/services/message/typings';
import LexicalTextarea, { LexicalTextareaRefProperty } from '@/components/markdown/lexical/lexical-textarea';

const ChatInput: React.FC<{
  onSubmit?: (values: MESSAGE.GenerateCmd) => void;
  onClearMemory?: () => Promise<any>;
  onStop?: () => Promise<any>;
  loading?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ onSubmit, onClearMemory, onStop, loading, className, style }) => {
  const lexicalTextareaRef = useRef<LexicalTextareaRefProperty>();
  const [query, setQuery] = useState('');

  const [clearLoading, setClearLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);

  const [inputExpand, setInputExpand] = useState(false);

  const submit = (markdown?: string) => {
    const content = markdown || query;
    if (!_.isEmpty(_.trim(content))) {
      onSubmit?.({
        query: {
          inputs: [
            {
              type: 'text',
              content: _.unescape(content),
            },
          ],
        },
      });
    }
    lexicalTextareaRef?.current?.clearEditor();
  };

  return (
    <>
      <Flex
        justify="flex-start"
        align="flex-end"
        gap={12}
        className={`w-full relative ${className}`}
        style={style}
      >
        {/* {loading && (
          <Flex justify="center" align="center" className="w-full mb-3">
            <Button type="primary" icon={stopIcon}>
              停止响应
            </Button>
          </Flex>
        )} */}
        <Flex
          vertical
          justify="flex-start"
          align="flex-start"
          style={style}
          className={`flex-auto rounded-xl bg-white py-4 w-full min-h-24`}
        >
          <div
            className={`w-full min-h-12 px-5 mb-3 overflow-y-scroll transition-all duration-500 ${inputExpand ? 'h-96' : 'max-h-40'}`}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                submit(query);
              }
            }}
          >
            <LexicalTextarea
              ref={lexicalTextareaRef}
              placeholder='发送消息、@召唤智能体、/召唤技能 有什么问题尽管问我...'
              readOnly={loading}
              defaultValue=''
              showToolbar={false}
              onChange={(markdown) => setQuery(markdown)} />
          </div>

          {/* 底部按钮 */}
          <Flex justify="space-between" align="center" className="w-full px-4">
            <Space>
              <Tooltip title="清除记忆">
                <Button
                  size="small"
                  type="text"
                  className="p-1"
                  disabled={loading}
                  loading={clearLoading}
                  onClick={() => {
                    if (!!onClearMemory) {
                      setClearLoading(true);
                      onClearMemory().finally(() => setClearLoading(false));
                    }
                  }}
                >
                  <SquareSplitVertical size={18} />
                </Button>
              </Tooltip>
              {/* 技能 */}
              <Tooltip title="技能">
                <Button
                  size="small"
                  type="text"
                  className="p-1"
                  disabled={loading}
                >
                  <Sparkles size={18} />
                </Button>
              </Tooltip>
            </Space>

            <Space align="center">
              <Typography.Text type="secondary">
                <Space align="center" size={4}>
                  <CornerDownLeft size={14} className="relative top-0.5" />
                  <span>换行</span>
                  <span>/</span>
                  <Command size={14} className="relative top-0.5" />
                  <CornerDownLeft size={14} className="relative top-0.5" />
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
                    icon={<img src="/logo.png" alt="modu" width={18} />}
                    onClick={() => submit(query)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="停止">
                  <Button
                    size="small"
                    type="primary"
                    className="py-1 px-2"
                    icon={<MessageCircleOff size={18} />}
                    loading={stopLoading}
                    onClick={() => {
                      if (!!onStop) {
                        setStopLoading(true);
                        onStop().finally(() => setStopLoading(false));
                      }
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          </Flex>
        </Flex>

        <Button type='text' size='small' className='absolute h-4 p-0.5 top-1 right-1' onClick={() => setInputExpand(!inputExpand)}>
          {inputExpand ? <Minimize2 size={12} color='rgb(156 163 175)' /> : <Maximize2 size={12} color='rgb(156 163 175)' />}

        </Button>
      </Flex>
    </>
  );
};

export default ChatInput;
