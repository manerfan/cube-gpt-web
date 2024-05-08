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

declare namespace SYSTEM {
  type SetupCmd = {
    /**
     * 用户名
     */
    name: string;

    /**
     * 邮箱
     */
    email: string;

    /**
     * 密码
     */
    password: string;
  };

  type AppInfo = {
    /**
     * 项目名称
     */
    title: string;

    /**
     * 项目描述
     */
    description: string;

    /**
     * 版本
     */
    version: string;

    /**
     * 联系人
     */
    contact: {
      name: string;
      url: string;
      email: string;
    };

    /**
     * 项目地址
     */
    project: {
      name: string;
      url: string;
    };

    /**
     * 许可证
     */
    licenseInfo: {
      name: string;
      url: string;
    };
  };
}
