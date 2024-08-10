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

import { MESSAGE } from '@/services/message/typings';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { useModel } from '@umijs/max';
import { Avatar, Flex, List, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import ChatMarkdown from './chat-markdown';

const ChatItem: React.FC<{
  message: MESSAGE.MessageContent;
  loading?: boolean;
  className?: string | undefined;
  messageClassName?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ message, loading, className, messageClassName, style }) => {
  const { initialState } = useModel('@@initialState');

  const userStore = useCreateStore();
  const userControl: FluentEmojiProps = useControls(
    {
      emoji: '👤',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
    },
    { store: userStore },
  );

  const assistantStore = useCreateStore();
  const assistantControl: FluentEmojiProps = useControls(
    {
      emoji: '🤖',
      size: {
        max: 128,
        min: 16,
        step: 1,
        value: 64,
      },
    },
    { store: assistantStore },
  );

  return (
    <>
      <Flex
        justify="flex-start"
        align="flex-start"
        gap={12}
        className={`w-full ${className}`}
        style={style}
      >
        <Flex
          vertical
          justify="flex-start"
          align="flex-start"
          className="w-9 h-9"
        >
          <Avatar
            className="bg-transparent"
            shape="square"
            icon={{
              ...(message.senderRole === 'user' ? (
                <FluentEmoji type={'anim'} {...userControl} />
              ) : (
                <img src={'/logo.png'} alt="MODU 墨读无界" />
              )),
            }}
          />
        </Flex>

        <Flex
          vertical
          justify="flex-start"
          align="flex-start"
          className="flex-auto"
        >
          <Flex justify="flex-start" align="center" className="w-full mb-2">
            <Typography.Text strong>
              {message.senderRole === 'user'
                ? initialState?.userMe?.name
                : 'Assistant'}
            </Typography.Text>
          </Flex>

          <Flex
            vertical
            justify="flex-start"
            align="flex-start"
            className={`w-auto max-w-full bg-white rounded-lg p-3 ${
              loading ? 'bg-assistant-msg-loading' : ''
            } ${messageClassName}`}
          >
            <List
              itemLayout="horizontal"
              bordered={false}
              dataSource={message?.messages}
              renderItem={(msg) => (
                <List.Item
                  key={msg.sectionId}
                  style={{ border: 'none', padding: 0 }}
                >
                  {msg.contentType === 'text' && (
                    <ChatMarkdown>{msg.content as string}</ChatMarkdown>
                  )}
                </List.Item>
              )}
            />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ChatItem;
