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

import { ACCESS_TOKEN, TOKEN_TYPE } from '@/constants';
import { message } from 'antd';

export type ServerSendEvent = {
  data?: string;
  event?: 'message' | 'done' | 'error';
  id?: string;
};

export type SeverSendEventCallbackFn = (
  event: ServerSendEvent | string,
) => void;

/**
 * 解析 sse 内容
 *
 * <pre>
 *   id: 1
 *   event: message
 *   data: {"message": "Hello, world!", "role": "assistant"}
 * </pre>
 *
 * @param data
 * @returns
 */
function parseSSE(data: string) {
  const events = data.split('\n');
  const event: ServerSendEvent = {};

  for (let i = 0; i < events.length; i++) {
    const line = events[i];
    if (line.startsWith('data:')) {
      event.data = (event.data || '') + line.substring(5).trim();
    } else if (line.startsWith('event:')) {
      event.event = line.substring(6).trim();
    } else if (line.startsWith('id:')) {
      event.id = line.substring(3).trim();
    }
  }

  return event;
}

/**
 * 处理 sse 响应
 *
 * <pre>
 *   id: 1
 *   event: message
 *   data: {"message": "Hello, world!", "role": "assistant"}
 *
 *   id: 2
 *   event: message
 *   data: {"message": "Hello, world!", "role": "assistant"}
 *
 *   id: 3
 *   event: message
 *   data: {"message": "Hello, world!", "role": "assistant"}
 * </pre>
 *
 * @param body sse响应体
 * @param onMessage message回调
 */
async function handleSSE(
  body: ReadableStream<Uint8Array>,
  onMessage: SeverSendEventCallbackFn,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const chunk = buffer.substring(0, boundary + 2);
      buffer = buffer.substring(boundary + 2);
      onMessage(parseSSE(chunk));
      boundary = buffer.indexOf('\n\n');
    }
  }

  onMessage({
    id: new Date().getTime().toString(),
    event: 'done'
  })
}

/**
 * 处理非 sse 响应
 * @param body 响应
 * @param onMessage message回调
 */
async function handleNonSSE(
  body: ReadableStream<Uint8Array>,
  onMessage: SeverSendEventCallbackFn,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');

  let data = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    data += decoder.decode(value, { stream: true });
  }

  onMessage(data);
}

/**
 * sse 请求
 *
 * <code>
 * const headers = new Headers({
 *     "Content-Type": "application/json",
 *     "Authorization": "Bearer YOUR TOKEN HERE"
 * });
 *
 * const bodyData = {
 *     someKey: "someValue"
 * };
 *
 * const sseConnection = sseRequest("https://example.com/sse", headers, bodyData);
 *
 * sseConnection.onMessage((event) => {
 *     console.log("New event:", event);
 * });
 *
 * // 需要时关闭连接
 * sseConnection.close();
 * </code>
 *
 * @param init
 * @returns
 */
export async function sseRequest(url: string, init?: RequestInit) {
  // 加入认证信息
  const requestInit = init || ({} as RequestInit);
  requestInit.headers = Object.assign(
    {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'Accept-Encoding': 'identity',
      Authorization: `${
        window.localStorage.getItem(TOKEN_TYPE) || 'bearer'
      } ${window.localStorage.getItem(ACCESS_TOKEN)}`,
    },
    requestInit.headers,
  );

  // 加入AbortController
  const controller = new AbortController();
  requestInit.signal = controller.signal;

  requestInit.cache = 'no-store';

  // 发起请求
  const response = await fetch(url, requestInit);
  const status = response.status;
  if (status !== 200) {
    message.error(`Request failed with status ${status}`);
    console.error(`Request failed with status ${status}`, response)
  }

  if (!response.body) {
    throw new Error('ReadableStream not yet supported in this browser.');
  }

  // 根据返回的类型选择处理器
  const contentType = response.headers.get('Content-Type');
  let isSSE = contentType && contentType.includes('text/event-stream');
  const sseHandler: (
    body: ReadableStream<Uint8Array>,
    onMessage: SeverSendEventCallbackFn,
  ) => void = isSSE ? handleSSE : handleNonSSE;

  let onMessageCallback: SeverSendEventCallbackFn | null = null;
  let resolveOnMessageReady: () => void;
  const onMessageReady = new Promise<void>((resolve) => {
    resolveOnMessageReady = resolve;
  });

  const processResponse = async () => {
    await onMessageReady; // 等待 onMessage 函数设置
    await sseHandler(response.body!, (event) => {
      onMessageCallback?.(event);
    });
  };

  // Start processing the response in the background
  processResponse();

  return {
    onMessage: (callback: SeverSendEventCallbackFn) => {
      onMessageCallback = callback;
      resolveOnMessageReady();
    },
    close: () => {
      controller.abort();
    },
  };
}
