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
import { List } from 'antd';
import _ from 'lodash';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ChatItem from '../chat-item';

const ChatList: React.FC<{
  messages: MESSAGE.MessageContent[];
  loadingMessageId?: string;
}> = ({ messages, loadingMessageId }) => {
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    console.log('loadMore');
  };

  return (
    <>
      {_.isEmpty(messages) ? (
        <LogoInfoSimple className="h-full" />
      ) : (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          useWindow={false}
          initialLoad={false}
          isReverse={true}
        >
          <List
            itemLayout="horizontal"
            bordered={false}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                key={message.messageId}
                style={{ border: 'none' }}
                className="my-1"
              >
                <ChatItem
                  message={message}
                  loading={message.messageId === loadingMessageId}
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
