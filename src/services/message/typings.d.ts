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

import '@interface/typings';

declare namespace MESSAGE {
  type Item = {
    /**
     * 类型
     */
    type: string;

    /**
     * 内容
     */
    content: string | Record<string, any>;
  }

  type Query = {
    /**
     * 输入的内容
     */
    inputs: Item[];

    /**
     * 引用的内容
     */
    refers?: Item[];
  }

  type GenerateCmd = {
    /**
     * 会话 ID
     */
    conversationId?: string;

    /**
     * 会话内容
     */
    query: Query;

    /**
     * 提及的机器人
     */
    mentions?: string[];
  }

  type MessageBlock = {
    /**
     * 消息类型
     */
    type: "question" | "answer";

    /**
     * 消息内容的类型
     */
    contentType: "text" | "refer:text" | "error";
    
    /**
     * 消息内容
     */
    content: string | Record<string, any>;

    /**
     * 该部分内容 ID
     */
    sectionId: string;
  }

  type MessageEvent = {
    /**
     * 会话 ID
     */
    conversationId: string;

    /**
     * 发送者 ID
     */
    senderId: string;

    /**
     * 发送者角色
     */
    senderRole: "user" | "assistant";

    /**
     * 消息 ID
     */
    messageId: string;

    /**
     * 消息时间戳
     */
    messageTime: number;

    /**
     * 消息内容
     */
    message: MessageBlock;

    /**
     * 消息是否结束
     */
    isFinished: boolean;
  }

  type MessageContent = {
    /**
     * 发送者 ID
     */
    senderId: string;

    /**
     * 发送者角色
     */
    senderRole: "user" | "assistant";

    /**
     * 消息 ID
     */
    messageId: string;

    /**
     * 消息时间戳
     */
    messageTime: number;

    /**
     * 消息内容
     */
    messages: MessageBlock[];
  }
}
