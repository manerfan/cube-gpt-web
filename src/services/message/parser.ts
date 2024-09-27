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
import _ from 'lodash';

export function messageParser({
  conversationUid,
  setConversationUid,
  messages,
  setMessages,
  setLoadingMessageUid,
  appendMessage,
}: {
  conversationUid?: string;
  setConversationUid: (conversationUid: string) => void;
  messages: MESSAGE.MessageContent[];
  setMessages: (messages: MESSAGE.MessageContent[]) => void;
  setLoadingMessageUid: (messageUid: string) => void;
  appendMessage?: MESSAGE.MessageContent;
}): (data: string) => void {
  const conversationMessages = _.cloneDeep(messages);

  // 追加消息
  if (!!appendMessage) {
    conversationMessages.push(appendMessage);
    setMessages(conversationMessages);
  }

  let currentMessage: MESSAGE.MessageContent | null = null;

  return (data: string) => {
    const messageEvent = JSON.parse(data) as MESSAGE.MessageEvent;

    if (conversationUid !== messageEvent.conversationUid) {
      setConversationUid(messageEvent.conversationUid);
    }

    if (
      !currentMessage ||
      currentMessage.messageUid !== messageEvent.messageUid
    ) {
      // 新消息
      currentMessage = {
        senderUid: messageEvent.senderUid,
        senderRole: messageEvent.senderRole,
        messageUid: messageEvent.messageUid,
        messageTime: messageEvent.messageTime,
        messages: [messageEvent.message],
      };

      conversationMessages.push(currentMessage);
      setMessages(_.cloneDeep(conversationMessages));
      setLoadingMessageUid(messageEvent.messageUid);
    } else {
      // 追加消息内容
      const lastSectionUid = _.last(
        _.last(conversationMessages)?.messages,
      )?.sectionUid;
      if (lastSectionUid !== messageEvent.message.sectionUid) {
        // 新的 section
        _.last(conversationMessages)?.messages?.push(messageEvent.message);
        setMessages(conversationMessages);
      } else {
        // 在原 section 上追加内容
        const lastMessageBlock = _.last(_.last(conversationMessages)?.messages);
        lastMessageBlock.content += messageEvent.message.content;
        setMessages(_.cloneDeep(conversationMessages));
      }
    }
  };
}
