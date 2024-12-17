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

import ScrollToBottomBtn, {
  ScrollToBottomBtnRefProperty,
} from '@/components/common/ScrollToBottomBtn';
import { messageService } from '@/services';
import * as generateService from '@/services/message/generate';
import * as parser from '@/services/message/parser';
import { MESSAGE } from '@/services/message/typings';
import { ServerSendEvent } from '@/services/sse';
import { useModel } from '@umijs/max';
import { Flex, Layout, Typography, message } from 'antd';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import { ulid } from 'ulid';
import ChatInput from './chat-input';
import ChatList from './chat-list';
import styles from './styles.module.scss';

const ChatContent: React.FC<{
  workspaceUid?: string;
  conversationUid?: string;
  className?: string;
  withChatBackgroundImage?: boolean;
  emptyNode?: React.ReactNode;
}> = ({ workspaceUid, conversationUid: _conversationUid, className, withChatBackgroundImage=true, emptyNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const chatContentPopoverRef = useRef<ScrollToBottomBtnRefProperty>();
  const { initialState } = useModel('@@initialState');

  // 当前会话
  const [conversationUid, setConversationUid] = useState<string | undefined>(
    _conversationUid,
  );

  // 消息列表
  const [messages, setMessages] = useState<MESSAGE.MessageContent[]>([]);

  // 正在加载的messageUid
  const [loadingMessageUid, setLoadingMessageUid] = useState<string>();

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 滚动到消息列表底部
  const scrollMessageToBottom = () => {
    chatContentPopoverRef.current?.trigScrollToBottom();
  };

  // 加载更多会话
  const loadMore = (
    _conversationUid?: string,
    clearMessages: boolean = false,
  ) => {
    const convUid = _conversationUid || conversationUid;
    if (_.isEmpty(convUid)) {
      // 没有会话，就不加载了
      return;
    }

    if (loadingMore) {
      // 正在加载，不处理
      return;
    }

    const fistMessageUid = clearMessages
      ? undefined
      : _.first(messages)?.messageUid;
    
    setLoadingMore(true);
    messageService
      .messages(convUid, fistMessageUid, 10)
      .then((resp) => {
        if (_.isEmpty(resp.content)) {
          setHasMore(false);
          return;
        }

        const newMessages = _.cloneDeep(messages) || [];
        setMessages(
          clearMessages ? resp.content : [...resp.content, ...newMessages],
        );
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  useEffect(() => {
    if (conversationUid === _conversationUid) {
      return;
    }

    setConversationUid(_conversationUid);
    setMessages([]);
    setHasMore(!!_conversationUid);

    if (!!_conversationUid) {
      loadMore(_conversationUid, true);
      scrollMessageToBottom();
    }
  }, [workspaceUid, _conversationUid]);


  const scrollMessageToBottomTicker = () => {
    const tickerId = setInterval(() => {
      scrollMessageToBottom();
    }, 1000);

    return () => {
      clearInterval(tickerId);
    };
  };

  const messageParser = (appendMessage?: MESSAGE.MessageContent) => {
    return parser.messageParser({
      conversationUid,
      setConversationUid,
      messages,
      setMessages,
      setLoadingMessageUid,
      appendMessage,
    });
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
    const stopScrollMessageToBottom = scrollMessageToBottomTicker();
    submitQuery.conversationUid = conversationUid;
    generateService.chat(
      workspaceUid!!,
      submitQuery,
      // onMessage
      (messageEvent) => {
        if (
          messageEvent instanceof String ||
          typeof messageEvent === 'string'
        ) {
          const { success, message: errorMsg } = JSON.parse(
            messageEvent as string,
          );
          if (!success && !!errorMsg) {
            messageApi.error(errorMsg);
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
      },
      // onFinish
      () => {
        stopScrollMessageToBottom();
      },
    );
  };

  // 清除记忆
  const clearMemory = async () => {
    if (!conversationUid) {
      return;
    }

    // 清空记忆，展示系统消息
    const resp = await generateService.clearMemory(conversationUid!!);
    if (!_.isEmpty(resp.content)) {
      const newMessages = _.cloneDeep(messages);
      newMessages.push(...resp.content);
      setMessages(newMessages);
    }

    scrollMessageToBottom();
  };

  const stopGenerate = async () => {
    if (!conversationUid) {
      return;
    }

    if (!loadingMessageUid) {
      return;
    }

    return generateService.stop(conversationUid!!);
  }

  return (
    <>
      {contextHolder}
      <Flex
        gap="large"
        vertical
        align="center"
        justify="center"
        className={`h-full w-full p-6 ${styles['chat-container']} ${withChatBackgroundImage && styles['chat-background-image']} ${className}`}
      >
        <Layout
          className={`bg-inherit h-full max-h-full w-full max-w-screen-md ${styles['chat-content']}`}
        >
          <Layout.Content
            className={`bg-inherit flex-auto chat-content ${styles['chat-list']}`}
          >
            <ScrollToBottom
              initialScrollBehavior="smooth"
              followButtonClassName="hidden"
              className="h-full max-h-full relative overscroll-none"
            >
              {/* 消息列表 */}
              <ChatList
                messages={messages}
                hasMore={hasMore}
                loadMore={loadMore}
                loadingMessageUid={loadingMessageUid}
                emptyNode={emptyNode}
              />
              <ScrollToBottomBtn ref={chatContentPopoverRef} />
            </ScrollToBottom>
          </Layout.Content>
          <Layout.Footer
            className={`bg-inherit mt-5 chat-content ${styles['chat-input']}`}
          >
            {/* 消息输入 */}
            <ChatInput
              loading={!!loadingMessageUid}
              onSubmit={submit}
              onClearMemory={clearMemory}
              onStop={stopGenerate}
              key="chat-input"
            />
            <Flex justify="center" align="center" className="w-full mt-3">
              <Typography.Text type="secondary" className="select-none">
                内容由AI生成，无法确保真实准确，仅供参考。
              </Typography.Text>
            </Flex>
          </Layout.Footer>
        </Layout>
      </Flex>
    </>
  );
};

export default ChatContent;
