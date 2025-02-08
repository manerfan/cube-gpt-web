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
import { LoadingOutlined, RobotOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Alert, Avatar, Button, Divider, Flex, List, Spin, Tag, Typography } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { CSSProperties } from 'react';
import ChatMarkdown from './chat-markdown';
import styles from './styles.module.scss';
import { eventBus } from '@/services';
import { BOT } from '@/services/bot/typings';
import ChatReferCards from './chat-refer-cards';
import ChatThink from './chat-think';

const ChatItem: React.FC<{
  message: MESSAGE.MessageContent;
  loading?: boolean;
  className?: string | undefined;
  messageClassName?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ message, loading, className, messageClassName, style }) => {
  const { initialState } = useModel('@@initialState');
  const emptyMessage = _.isEmpty(message?.messages) || _.every(message?.messages, msg => _.isEmpty(msg.content));

  return (
    <>
      {message.sender_role === 'system' && (
        <Flex vertical justify="center" align="center" className="w-full pl-9">
          <List
            itemLayout="horizontal"
            bordered={false}
            className="w-full"
            dataSource={message?.messages}
            renderItem={(msg) => (
              <List.Item
                key={msg.section_uid}
                style={{ border: 'none', padding: 0 }}
              >
                {/* 文本 */}
                {msg.content_type === 'text' && (
                  <Divider dashed>
                    <Typography.Text type="secondary" className='text-xs'>{msg.content as string}</Typography.Text>
                  </Divider>
                )}
              </List.Item>
            )}
          />
        </Flex>
      )}
      {message.sender_role !== 'system' && (
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
                ...(message.sender_role === 'user' ? (
                  <Avatar shape='square' size={32} className={`bg-user-msg font-bold`} src={message.sender_info?.avatar}>{initialState?.userMe?.name[0]}</Avatar>
                ) : <Avatar shape='square' size={32} icon={<RobotOutlined />} src={message.sender_info?.avatar || '/logo.png'} />
                ),
              }}
            />
          </Flex>

          <Flex
            vertical
            justify="flex-start"
            align="flex-start"
            className="flex-auto box-border"
            style={{ width: 'calc(100% - 36px - 12px)' }}
          >
            <Flex
              justify="flex-start"
              align="center"
              gap={8}
              className="w-full mb-2 box-border"
            >
              <Typography.Text type="secondary">
                {message.sender_info?.name}
                {!!message.sender_info?.name || (message.sender_role === 'user'
                  ? initialState?.userMe?.name
                  : '智能助手')}
                {message.sender_role === 'assistant' && !!message.sender_info && (
                  <Typography.Text
                    type="secondary"
                    className={`${styles['operation-header']}`}
                  >
                    <Button type="link" className="p-1" onClick={() => {
                      if (message.sender_role === 'assistant' && !!message.sender_info) {
                        eventBus.emit('modu.bot.mention', {
                          "uid": message.sender_info.uid,
                          "name": message.sender_info.name,
                          "avatar": message.sender_info.avatar,
                          "avatar_url": message.sender_info.avatar,
                        } as BOT.BotEntity);
                      }
                    }}>
                      @
                    </Button>
                  </Typography.Text>
                )}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                className={`${styles['operation-header']}`}
              >
                {moment(message.message_time).format('YYYY-MM-DD HH:mm:ss')}
              </Typography.Text>
            </Flex>

            <Flex
              vertical
              justify="flex-start"
              align="flex-start"
              className={`ray-animation w-auto max-w-full box-border bg-white rounded-lg p-3 relative 
                ${loading ? 'bg-assistant-msg-loading' : ''} ${messageClassName}`}
            >
              {/* 一条消息中有很多 section，遍历每个 section 进行渲染 */}
              {emptyMessage && <Spin indicator={<LoadingOutlined spin className='text-gray-400 font-medium' />} size="small" />}
              {!emptyMessage && <>
                <List
                  itemLayout="horizontal"
                  bordered={false}
                  className='w-full'
                  dataSource={message?.messages}
                  renderItem={(msg) => (
                    <List.Item
                      key={msg.section_uid}
                      style={{ border: 'none', padding: 0 }}
                      className='border-0 p-0 w-full'
                    >
                      {/* mention */}
                      {msg.content_type === 'mention' && (
                        <Tag color="rgba(255,255,255,0.1)" className='mb-1'>@ {(msg.content as BOT.Bot).name}</Tag>
                      )}
                      {/* 思考 */}
                      {msg.content_type === 'think:text' && (
                        <ChatThink content={msg.content as string} isFinished={msg.is_finished || !loading} />
                      )}
                      {/* 文本 */}
                      {msg.content_type === 'text' && (
                        <ChatMarkdown>{msg.content as string}</ChatMarkdown>
                      )}
                      {/* 引用卡片 */}
                      {msg.content_type === 'refer:cards' && (
                        <ChatReferCards referCards={msg.content as MESSAGE.ReferCard[]} />
                      )}
                      {/* 异常 */}
                      {msg.content_type === 'error' && (
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

                {message.sender_role !== 'user' && !loading && (
                  <Flex justify="flex-end" align="center" className="w-full mt-2">
                    <Typography.Text type="secondary" className="text-xs">
                      内容由AI生成，仅供参考
                    </Typography.Text>
                  </Flex>
                )}
              </>}
              {/* {message.sender_role !== 'user' && loading && <div className='ray-border-animation'/>} */}
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default ChatItem;
