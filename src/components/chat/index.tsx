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
import { MESSAGE } from '@/services/message/typings';
import { Flex, Layout, Typography } from 'antd';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ChatInput from './chat-input';
import ChatList from './chat-list';
import styles from './styles.module.scss';

export interface ChatContentRefProperty {
  scrollMessageToBottom: () => void;
}

const ChatContent: React.FC<{
  messages: MESSAGE.MessageContent[];
  onSubmit?: (values: MESSAGE.GenerateCmd) => void;
  onClearMemory?: () => Promise<any>;
  className?: string;
  loadingMessageUid?: string;
}> = forwardRef(
  (
    { messages, onSubmit, onClearMemory, className, loadingMessageUid },
    ref,
  ) => {
    const chatContentPopoverRef = useRef<ScrollToBottomBtnRefProperty>();

    useImperativeHandle(ref, () => ({
      scrollMessageToBottom() {
        chatContentPopoverRef.current?.trigScrollToBottom();
      },
    }));

    return (
      <>
        <Flex
          gap="large"
          vertical
          align="center"
          justify="center"
          className={`h-full w-full p-6 ${styles['chat-container']} ${className}`}
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
                  loadingMessageUid={loadingMessageUid}
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
                onSubmit={onSubmit}
                onClearMemory={onClearMemory}
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
  },
);

export default ChatContent;
