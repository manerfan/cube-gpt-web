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

import ChatContent, { ChatContentRefProperty } from '@/components/chat';
import ChatFunc from '@/components/chat/chat-function';
import { toCamelCase } from '@/services/common';
import * as generateService from '@/services/message/generate';
import { MESSAGE } from '@/services/message/typings';
import { useModel } from '@umijs/max';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { ulid } from 'ulid';

const Chat: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const chatContentPopoverRef = useRef<ChatContentRefProperty>();

  const [loadingMessageId, setLoadingMessageId] = useState<string>();

  // 消息列表
  const [messages, setMessages] = useState<MESSAGE.MessageContent[]>([]);

  const submit = (submitQuery: MESSAGE.GenerateCmd) => {
    chatContentPopoverRef.current?.scrollMessageToBottom();
    
    const conversationMessages = _.cloneDeep(messages);

    conversationMessages.push({
      senderId: initialState?.userMe?.uid,
      senderRole: 'user',
      messageId: ulid(),
      messageTime: new Date().getTime(),
      messages: [
        ..._.map(submitQuery.query.refers || [], (ref) => {
          return {
            type: 'question',
            contentType: ref.type,
            content: ref.content,
            sectionId: ulid(),
          } as MESSAGE.MessageBlock;
        }),
        ..._.map(submitQuery.query.inputs || [], (input) => {
          return {
            type: 'question',
            contentType: input.type,
            content: input.content,
            sectionId: ulid(),
          } as MESSAGE.MessageBlock;
        }),
      ],
    });
    setMessages(conversationMessages);

    let currentMessage: MESSAGE.MessageContent | null = null;

    generateService.chat(submitQuery, (messageEvent) => {
      const { id, event, data } = messageEvent;
      console.log(id, '======= event', messageEvent);
      switch (event) {
        case 'message': {
          const messageEvent = toCamelCase(
            JSON.parse(data),
          ) as MESSAGE.MessageEvent;
          console.log(id, 'current', currentMessage);
          if (
            !currentMessage ||
            currentMessage.messageId !== messageEvent.messageId
          ) {
            console.log(id, 'new message');
            const message = {
              senderId: messageEvent.senderId,
              senderRole: messageEvent.senderRole,
              messageId: messageEvent.messageId,
              messageTime: messageEvent.messageTime,
              messages: [
                {
                  type: messageEvent.message.type,
                  contentType: messageEvent.message.contentType,
                  content: messageEvent.message.content,
                  sectionId: messageEvent.message.sectionId,
                } as MESSAGE.MessageBlock,
              ],
            };

            currentMessage = message;
            conversationMessages.push(currentMessage);
            setMessages(_.cloneDeep(conversationMessages));
            setLoadingMessageId(messageEvent.messageId);
            console.log(id, 'messages', conversationMessages);
          } else {
            const lastSectionId = _.last(_.last(conversationMessages)?.messages)
              ?.sectionId;
            if (lastSectionId !== messageEvent.message.sectionId) {
              console.log(id, 'new message section');
              _.last(conversationMessages)?.messages?.push({
                type: messageEvent.message.type,
                contentType: messageEvent.message.contentType,
                content: messageEvent.message.content,
                sectionId: messageEvent.message.sectionId,
              } as MESSAGE.MessageBlock);
              setMessages(conversationMessages);
            } else {
              console.log(id, 'append message');
              const lastMessageBlock = _.last(
                _.last(conversationMessages)?.messages,
              );
              lastMessageBlock.content += messageEvent.message.content;
              setMessages(_.cloneDeep(conversationMessages));
            }

            console.log(id, 'messages', conversationMessages);
          }
          break;
        }
        case 'done': {
          currentMessage = null;
          setLoadingMessageId(undefined);
          break;
        }
        default:
          break;
      }
    });
  };

  return (
    <>
      <ChatContent
        ref={chatContentPopoverRef}
        messages={messages}
        className="max-h-full max-h-screen"
        onSubmit={submit}
        loadingMessageId={loadingMessageId}
      />

      <ChatFunc />
    </>
  );
};

export default Chat;
