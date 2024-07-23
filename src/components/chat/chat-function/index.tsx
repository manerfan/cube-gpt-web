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

import { FloatButton } from 'antd';
import { Bot, MessageCirclePlus, MessageSquareText, Wand } from 'lucide-react';
import React from 'react';

const ChatFunc: React.FC = () => {
  return (
    <>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        icon={<Wand size={18} />}
        className="bottom-48 lg:bottom-16"
      >
        <FloatButton
          icon={<MessageCirclePlus size={18} />}
          tooltip="发起新会话"
        />
        <FloatButton
          icon={<MessageSquareText size={18} />}
          tooltip="历史会话"
        />
        <FloatButton icon={<Bot size={18} />} tooltip="Bot收藏" />
      </FloatButton.Group>
    </>
  );
};

export default ChatFunc;
