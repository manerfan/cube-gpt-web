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
import { WORKSPACE } from './typings';

export enum WorkspaceType {
  /**
   * 私有空间
   */
  PRIVATE = 'PRIVATE',

  /**
   * 公开空间
   */
  PUBLIC = 'PUBLIC',
}

export enum WorkspaceMemberRole {
  /**
   * 创建者
   */
  OWNER = 'OWNER',

  /**
   * 管理员
   */
  ADMIN = 'ADMIN',

  /**
   * 成员
   */
  MEMBER = 'MEMBER',
}

/**
 * 当前登录人相关的空间列表
 */
export async function list(
  options?: Record<string, any>,
): Promise<Response.MultiResponse<WORKSPACE.WorkspaceEntity>> {
  return request<Response.MultiResponse<WORKSPACE.WorkspaceEntity>>(
    `/api/workspace`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

/**
 * 空间详情
 */
export async function detail(
  workspaceUid: string,
  options?: Record<string, any>,
): Promise<Response.SingleResponse<WORKSPACE.WorkspaceEntity>> {
  return request<Response.SingleResponse<WORKSPACE.WorkspaceEntity>>(
    `/api/workspace/${workspaceUid}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}
