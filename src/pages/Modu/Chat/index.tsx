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
import { workspaceService } from '@/services';
import * as generateService from '@/services/message/generate';
import { MESSAGE } from '@/services/message/typings';
import { ServerSendEvent } from '@/services/sse';
import { WorkspaceType } from '@/services/workspace';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { ulid } from 'ulid';

const Chat: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const chatContentPopoverRef = useRef<ChatContentRefProperty>();

  // 当前conversationUid
  const [conversationUid, setConversationUid] = useState<string>();
  // 当前使用的空间
  const [workspaceUid, setWorkspaceUid] = useState<string>();

  // 正在加载的messageUid
  const [loadingMessageUid, setLoadingMessageUid] = useState<string>();

  // 消息列表
  const [messages, setMessages] = useState<MESSAGE.MessageContent[]>([]);

  useEffect(() => {
    // 查询空间列表
    workspaceService.list().then((resp) => {
      const workspaces = resp.content;

      // 私有空间
      const privateSpace = _.head(
        _.filter(
          workspaces,
          (workspace) => workspace.type === WorkspaceType.PRIVATE,
        ),
      );
      setWorkspaceUid(privateSpace?.uid);
    });
  }, []);

  const scrollMessageToBottom = () => {
    chatContentPopoverRef.current?.scrollMessageToBottom();
  };

  const messageParser = (appendMessage?: MESSAGE.MessageContent) => {
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
    setLoadingMessageUid(undefined);
    // 将消息列表滚动到底部
    scrollMessageToBottom();

    // 追加用户消息
    const parseMessageEvent = messageParser({
      senderUid: initialState?.userMe?.uid,
      senderRole: 'user',
      messageUid: ulid(),
      messageTime: new Date().getTime(),
      messages: [
        ..._.map(submitQuery.query.refers || [], (ref) => {
          return {
            type: 'question',
            contentType: ref.type,
            content: ref.content,
            sectionUid: ulid(),
          } as MESSAGE.MessageBlock;
        }),
        ..._.map(submitQuery.query.inputs || [], (input) => {
          return {
            type: 'question',
            contentType: input.type,
            content: input.content,
            sectionUid: ulid(),
          } as MESSAGE.MessageBlock;
        }),
      ],
    });

    // 发起请求
    submitQuery.conversationUid = conversationUid;
    generateService.chat(workspaceUid!!, submitQuery, (messageEvent) => {
      if (messageEvent instanceof String || typeof messageEvent === 'string') {
        const { success, message: errorMsg } = JSON.parse(
          messageEvent as string,
        );
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
          setLoadingMessageUid(undefined);
          break;
        }
        // 结束
        case 'done': {
          setLoadingMessageUid(undefined);
          // 将消息列表滚动到底部
          scrollMessageToBottom();
          break;
        }
        default: {
          // 将消息列表滚动到底部
          scrollMessageToBottom();
          break;
        }
      }
    });
  };

  const clearMemory = async () => {
    if (!conversationUid) {
      return;
    }

    // 清空记忆，展示系统消息
    const resp = await generateService.clearMemory(conversationUid!!);
    const newMessages = _.cloneDeep(messages);
    newMessages.push(...resp.content);
    setMessages(newMessages);
  };

  return (
    <>
      <ChatContent
        ref={chatContentPopoverRef}
        messages={messages}
        className="max-h-full max-h-screen"
        onSubmit={submit}
        onClearMemory={clearMemory}
        loadingMessageUid={loadingMessageUid}
      />

      <ChatFunc />
    </>
  );
};

export default Chat;
