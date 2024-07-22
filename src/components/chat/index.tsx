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

import { Flex, Layout } from 'antd';
import ChatInput from './chat-input';
import ChatList from './chat-list';
import styles from './styles.module.scss';

const ChatContent: React.FC = () => {
  return (
    <>
      <Flex align="center" justify="center" className="h-full w-full p-6">
        <Layout
          className={`bg-inherit h-full w-full max-w-screen-md ${styles['chat-content']}`}
        >
          <Layout.Content
            className={`bg-inherit chat-content ${styles['chat-list']}`}
          >
            <ChatList />
          </Layout.Content>
          <Layout.Footer
            className={`bg-inherit chat-content ${styles['chat-input']}`}
          >
            <ChatInput />
          </Layout.Footer>
        </Layout>
      </Flex>
    </>
  );
};

export default ChatContent;
