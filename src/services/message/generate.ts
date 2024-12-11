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

import { SeverSendEventCallbackFn, sseRequest } from '@/services/sse';
import type { Response } from '@/services/typings';
import { request } from '@umijs/max';
import { MESSAGE } from './typings';

/**
 * 发起生成请求
 * @param generateCmd 生成命令
 * @param onMessage Event 回调
 */
export async function chat(
  workspaceUid: string,
  generateCmd: MESSAGE.GenerateCmd,
  onMessage: SeverSendEventCallbackFn,
  onFinish?: () => void,
) {
  const connection = await sseRequest(
    `/api/chat?workspace_uid=${workspaceUid || ''}`,
    {
      method: 'POST',
      body: JSON.stringify(generateCmd),
    },
  );
  connection.onEvent(onMessage, onFinish);
}

export async function stop(
  conversationUid: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<boolean>> {
  return request<Response.SingleResponse<boolean>>(
    `/api/chat/${conversationUid}/stop`,
    {
      method: 'PUT',
      ...(options || {}),
    },
  );
}

export async function clearMemory(
  conversationUid: string,
  options?: Record<string, any>,
): Promise<Response.MultiResponse<MESSAGE.MessageContent>> {
  return request<Response.MultiResponse<MESSAGE.MessageContent>>(
    `/api/chat/${conversationUid}/message/clear`,
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}
