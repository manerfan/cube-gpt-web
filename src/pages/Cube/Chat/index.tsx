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

import ChatMarkdown from '@/components/chat/chat-message/chat-markdown';
import * as generateService from '@/services/llm/generate';
import { Button } from 'antd';
import { useState } from 'react';

const Chat: React.FC = () => {
  const [content, setContent] = useState('');

  const sse = (workspaceUid: string) => {
    setContent('');
    generateService.chat(workspaceUid, (event) => {
      if (event.event === 'message') {
        setContent((prev) => prev + JSON.parse(event.data).content);
      }
    });
  };

  return (
    <>
      <Button onClick={() => sse('01HXASS3M44ZX8EF3ZJCW0N7G9')}>stream</Button>
      <ChatMarkdown>{content}</ChatMarkdown>
    </>
  );
};

export default Chat;
