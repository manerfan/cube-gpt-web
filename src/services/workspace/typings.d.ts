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

declare namespace WORKSPACE {
  type WorkspaceEntity = {
    /**
     * uid
     */
    uid: string;

    /**
     * 创建者 uid
     */
    creator_uid: string;

    /**
     * 名称
     */
    name: string;

    /**
     * 描述
     */
    description?: string;

    /**
     * 类型
     */
    type: WorkspaceType;

    /**
     * 角色
     */
    member_role: WorkspaceMemberRole;
  }
}