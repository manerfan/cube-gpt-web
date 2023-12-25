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

/**
 * 请求
 */
declare namespace Request {
  /**
   * 分页参数
   */
  type PageRequest = {
    page: number;
    size: number;
  };
}

/**
 * 响应
 */
declare namespace Response {
  /**
   * 响应体
   */
  type Response<T> = {
    success: boolean;
    code?: string;
    content: T;
    errorShowType?: ErrorShowType;
  };

  /**
   * 单值响应
   */
  type SingleResponse<T> = Response<T>;

  /**
   * 多值响应
   */
  type MultiResponse<T> = Response<T[]>;

  /**
   * 分页响应
   */
  type PageResponse<T> = Response<{
    total?: number;
    page?: Request.PageRequest;
    content: T[];
  }>;
}
