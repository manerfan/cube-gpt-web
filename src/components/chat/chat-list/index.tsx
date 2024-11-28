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

import LogoInfoSimple from '@/components/logo/LogoInfoSimple';
import { MESSAGE } from '@/services/message/typings';
import { List, Skeleton, Space } from 'antd';
import _ from 'lodash';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ChatItem from '../chat-item';

const ChatList: React.FC<{
  messages: MESSAGE.MessageContent[];
  hasMore?: boolean;
  loadMore?: () => void;
  loadingMore?: boolean;
  loadingMessageUid?: string;
}> = ({ messages, hasMore, loadMore, loadingMore, loadingMessageUid }) => {

  return (
    <>
      {_.isEmpty(messages) ? (
        <LogoInfoSimple className="h-full" />
      ) : (
        <InfiniteScroll
          loadMore={() => loadMore?.()}
          hasMore={hasMore}
          useWindow={false}
          initialLoad={false}
          isReverse={true}
        >
          {/* 加载动画 */}
          <Skeleton avatar active paragraph={{ rows: 2 }} className={loadingMore ? '' : 'hidden'} />

          <List
            itemLayout="horizontal"
            bordered={false}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                key={message.messageUid}
                style={{ border: 'none' }}
                className="my-1"
              >
                <ChatItem
                  message={message}
                  loading={message.messageUid === loadingMessageUid}
                  messageClassName={
                    message.senderRole === 'user'
                      ? 'bg-user-msg'
                      : 'bg-assistant-msg'
                  }
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      )}
    </>
  );
};

export default ChatList;
