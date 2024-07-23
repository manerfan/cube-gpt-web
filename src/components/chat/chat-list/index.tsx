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

import { List } from 'antd';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ChatItem from '../chat-item';

const ChatList: React.FC = () => {
  const [items, setItems] = useState([
    {
      title: 'Bot 1',
    },
    {
      title: 'Bot 2',
    },
    {
      title: 'Bot 3',
    },
    {
      title: 'Bot 4',
    },
  ]);

  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    console.log('loadMore');
    setTimeout(() => {
      setItems((prevItems) => [...prevItems, { title: 'Bot' }]);
      setHasMore(items.length < 50);
      console.log(items.length);
    }, 1000);
  };

  return (
    <>
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
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item style={{ border: 'none' }} className="my-1">
              <ChatItem />
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </>
  );
};

export default ChatList;
