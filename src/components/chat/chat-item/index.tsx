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

import { Avatar, Flex, Typography } from 'antd';
import React, { CSSProperties } from 'react';
import ChatMarkdown from './chat-markdown';

const ChatItem: React.FC<{
  className?: string | undefined;
  messageClassName?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ className, messageClassName, style }) => {
  return (
    <>
      <Flex
        justify="flex-start"
        align="flex-start"
        className={`w-full ${className}`}
        style={style}
      >
        <Avatar
          className="w-11"
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=1`}
        />

        <Flex
          vertical
          justify="flex-start"
          align="flex-start"
          className="flex-auto ml-2"
        >
          <Flex justify="flex-start" align="center" className='w-full mb-2'>
            <Typography.Text strong>Bot</Typography.Text>
          </Flex>

          <Flex
            vertical
            justify="flex-start"
            align="flex-start"
            className={`w-auto max-w-full bg-white rounded-lg p-3 ${messageClassName}`}
          >
            <ChatMarkdown>
              {`
# cube chat  
cube chat 是一款灵活的基于大模型的应用 
                `}
            </ChatMarkdown>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default ChatItem;
