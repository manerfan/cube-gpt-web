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

import type { Response } from '@/services/typings';
import { request } from '@umijs/max';
import { CONVERSATION, MESSAGE } from './typings';

/**
 * 查询会话
 */
export async function conversations(
  beforeConversationUid: string = '',
  maxCount: number,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<CONVERSATION.Conversation>> {
  return request<Response.MultiResponse<CONVERSATION.Conversation>>(
    `/api/chat/conversations`,
    {
      method: 'GET',
      params: {
        before_conversation_uid: beforeConversationUid,
        max_count: maxCount,
      },
      ...(options || {}),
    },
  );
}

/**
 * 查询最新会话
 */
export async function latestConversation(
  options?: Record<string, any>,
): Promise<Response.SingleResponse<CONVERSATION.Conversation>> {
  return request<Response.SingleResponse<CONVERSATION.Conversation>>(
    `/api/chat/conversation/latest`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/**
 * 修改会话名
 */
export async function renameConversation(
  conversationUid: string,
  name: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<string>> {
  return request<Response.SingleResponse<string>>(
    `/api/chat/conversation/${conversationUid}/rename`,
    {
      method: 'PUT',
      params: {
        name,
      },
      ...(options || {}),
    },
  );
}

/**
 * 删除会话
 */
export async function deleteConversation(
  conversationUid: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<boolean>> {
  return request<Response.SingleResponse<boolean>>(
    `/api/chat/conversation/${conversationUid}`,
    {
      method: 'DELETE',
      ...(options || {}),
    },
  );
}

/**
 * 删除所有会话
 */
export async function deleteAllConversations(
  options?: Record<string, any>,
): Promise<Response.SingleResponse<boolean>> {
  return request<Response.SingleResponse<boolean>>(
    `/api/chat/conversation/all`,
    {
      method: 'DELETE',
      ...(options || {}),
    },
  );
}

/**
 * 查询消息
 */
export async function messages(
  conversationUid: string,
  beforeMessageUid: string = '',
  maxCount: number,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<MESSAGE.MessageContent>> {
  return request<Response.MultiResponse<MESSAGE.MessageContent>>(
    `/api/chat/${conversationUid}/messages`,
    {
      method: 'GET',
      params: {
        before_message_uid: beforeMessageUid,
        max_count: maxCount,
      },
      ...(options || {}),
    },
  );
}
