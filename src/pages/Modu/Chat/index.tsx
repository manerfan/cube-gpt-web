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
import { ServerSendEvent } from '@/services/sse';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { ulid } from 'ulid';

const Chat: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const chatContentPopoverRef = useRef<ChatContentRefProperty>();

  const [loadingMessageId, setLoadingMessageId] = useState<string>();

  // 消息列表
  const [messages, setMessages] = useState<MESSAGE.MessageContent[]>([]);

  const messageParser = (appendMessage?: MESSAGE.MessageContent) => {
    const conversationMessages = _.cloneDeep(messages);

    // 追加消息
    if (!!appendMessage) {
      conversationMessages.push(appendMessage);
      setMessages(conversationMessages);
    }

    let currentMessage: MESSAGE.MessageContent | null = null;

    return (data: string) => {
      const messageEvent = toCamelCase(
        JSON.parse(data),
      ) as MESSAGE.MessageEvent;

      if (
        !currentMessage ||
        currentMessage.messageId !== messageEvent.messageId
      ) {
        // 新消息
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
      } else {
        // 追加消息内容
        const lastSectionId = _.last(_.last(conversationMessages)?.messages)
          ?.sectionId;
        if (lastSectionId !== messageEvent.message.sectionId) {
          // 新的 section
          _.last(conversationMessages)?.messages?.push({
            type: messageEvent.message.type,
            contentType: messageEvent.message.contentType,
            content: messageEvent.message.content,
            sectionId: messageEvent.message.sectionId,
          } as MESSAGE.MessageBlock);
          setMessages(conversationMessages);
        } else {
          // 在原 section 上追加内容
          const lastMessageBlock = _.last(
            _.last(conversationMessages)?.messages,
          );
          lastMessageBlock.content += messageEvent.message.content;
          setMessages(_.cloneDeep(conversationMessages));
        }
      }
    };
  };

  // 提交
  const submit = (submitQuery: MESSAGE.GenerateCmd) => {
    // 取消 loading
    setLoadingMessageId(undefined);
    // 将消息列表滚动到底部
    chatContentPopoverRef.current?.scrollMessageToBottom();

    // 追加用户消息
    const parseMessageEvent = messageParser({
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

    // 发起请求
    generateService.chat(submitQuery, (messageEvent) => {
      if (messageEvent instanceof String || (typeof messageEvent === 'string')) {
          const {success, message: errorMsg} = JSON.parse(messageEvent as string);
          if (!success && !!errorMsg) {
            message.error(errorMsg);
          }
          return;
      }

      const { event, data } = messageEvent as ServerSendEvent;

      switch (event) {
        // 消息
        case 'message': {
          parseMessageEvent(data);
          break;
        }
        // 异常
        case 'error': {
          parseMessageEvent(data);
          setLoadingMessageId(undefined);
          break;
        }
        // 结束
        case 'done': {
          setLoadingMessageId(undefined);
          break;
        }
        default:{
          break;
        }
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
