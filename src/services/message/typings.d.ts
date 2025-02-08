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
import { BOT } from '@/services/bot/typings';

declare namespace MESSAGE {
  type SenderRole = "user" | "assistant" | "system";
  
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
    conversation_uid?: string;

    /**
     * 会话内容
     */
    query: Query;

    /**
     * 提及的机器人
     */
    mentions?: BOT.Bot[];
  }

  type MessageBlock = {
    /**
     * 消息类型
     */
    type: "question" | "answer" | "system";

    /**
     * 消息内容的类型
     */
    content_type: "text" | "refer:text" | "refer:cards" | "think:text" | "mention" | "error";
    
    /**
     * 消息内容
     */
    content: string | Record<string, any> | string[] | Record<string, any>[];

    /**
     * 该部分内容 ID
     */
    section_uid: string;

    /**
     * 该部分内容是否结束
     */
    is_finished?: boolean;
  }

  type SenderInfo = {
    /**
     * 发送者 ID
     */
    uid: string;

    /**
     * 发送者名称
     */
    name: string;

    /**
     * 发送者头像
     */
    avatar?: string;

    /**
     * 发送者角色
     */
    role: string;
  }

  type MessageEvent = {
    /**
     * 会话 ID
     */
    conversation_uid: string;

    /**
     * 发送者 ID
     */
    sender_uid: string;

    /**
     * 发送者角色
     */
    sender_role: SenderRole;

    /**
     * 发送者信息
     */
    sender_info?: SenderInfo;

    /**
     * 消息 ID
     */
    message_uid: string;

    /**
     * 消息时间戳
     */
    message_time: number;

    /**
     * 消息内容
     */
    message: MessageBlock;

    /**
     * 消息是否结束
     */
    is_finished: boolean;
  }

  type MessageContent = {
    /**
     * 发送者 ID
     */
    sender_uid: string;

    /**
     * 发送者角色
     */
    sender_role: SenderRole;

    /**
     * 发送者信息
     */
    sender_info?: SenderInfo;

    /**
     * 消息 ID
     */
    message_uid: string;

    /**
     * 消息时间戳
     */
    message_time: number;

    /**
     * 消息内容
     */
    messages: MessageBlock[];
  }

  type ReferCard = {
    index: number;
    name?: string;
    title: string;
    description?: string;
    icon?: string;
    url?: string;
  }
}

declare namespace CONVERSATION {
  type Conversation = {
    /**
     * 会话 ID
     */
    conversation_uid: string;

    /**
     * 会话名称
     */
    name: string;

    /**
     * 会话创建时间
     */
    created_at: number;
  }
}
