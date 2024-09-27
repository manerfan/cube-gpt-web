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
import { ReloadOutlined } from '@ant-design/icons';
import {
  FluentEmoji,
  FluentEmojiProps,
  useControls,
  useCreateStore,
} from '@lobehub/ui';
import { useModel } from '@umijs/max';
import { Alert, Avatar, Button, Divider, Flex, List, Space, Typography } from 'antd';
import moment from 'moment';
import React, { CSSProperties } from 'react';
import ChatMarkdown from './chat-markdown';
import styles from './styles.module.scss';

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

  return (
    <>
      {message.senderRole === 'system' && (
        <Flex vertical justify="center" align="center" className="w-full pl-9">
          <List
            itemLayout="horizontal"
            bordered={false}
            className="w-full"
            dataSource={message?.messages}
            renderItem={(msg) => (
              <List.Item
                key={msg.sectionUid}
                style={{ border: 'none', padding: 0 }}
              >
                {/* 文本 */}
                {msg.contentType === 'text' && (
                  <Divider dashed>
                    <Typography.Text type="secondary" className='text-xs'>{msg.content as string}</Typography.Text>
                  </Divider>
                )}
              </List.Item>
            )}
          />
        </Flex>
      )}
      {message.senderRole !== 'system' && (
        <Flex
          justify="flex-start"
          align="flex-start"
          gap={12}
          className={`w-full ${styles['chat-item']} ${className}`}
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
            <Flex
              justify="flex-start"
              align="center"
              gap={8}
              className="w-full mb-2"
            >
              <Typography.Text type="secondary">
                {message.senderRole === 'user'
                  ? initialState?.userMe?.name
                  : 'Assistant'}
                {message.senderRole !== 'user' && (
                  <Typography.Text
                    type="secondary"
                    className={`${styles['operation-header']}`}
                  >
                    <Button type="link" className="p-1">
                      @
                    </Button>
                  </Typography.Text>
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                className={`${styles['operation-header']}`}
              >
                {moment(message.messageTime).format('YYYY-MM-DD HH:mm:ss')}
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
              {/* 一条消息中有很多 section，遍历每个 section 进行渲染 */}
              <List
                itemLayout="horizontal"
                bordered={false}
                dataSource={message?.messages}
                renderItem={(msg) => (
                  <List.Item
                    key={msg.sectionUid}
                    style={{ border: 'none', padding: 0 }}
                  >
                    {/* 文本 */}
                    {msg.contentType === 'text' && (
                      <ChatMarkdown>{msg.content as string}</ChatMarkdown>
                    )}
                    {/* 异常 */}
                    {msg.contentType === 'error' && (
                      <Alert
                        message="遇到异常"
                        description={msg.content as string}
                        type="error"
                        showIcon
                        className="w-full my-3"
                        // action={
                        //   <Space>
                        //     <Button
                        //       type="primary"
                        //       danger
                        //       size="small"
                        //       icon={<ReloadOutlined />}
                        //     >
                        //       重试
                        //     </Button>
                        //   </Space>
                        // }
                      />
                    )}
                  </List.Item>
                )}
              />

              {message.senderRole !== 'user' && !loading && (
                <Flex justify="flex-end" align="center" className="w-full mt-2">
                  <Typography.Text type="secondary" className="text-xs">
                    内容由AI生成
                  </Typography.Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default ChatItem;
