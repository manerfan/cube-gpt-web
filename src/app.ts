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

import {
  ErrorShowType,
  llmProviderService,
  systemService,
  userService,
  workspaceService,
} from '@/services';
import type { Response } from '@/services/typings';
import {
  AxiosResponse,
  RequestConfig,
  RequestOptions,
  history,
} from '@umijs/max';
import { message, notification } from 'antd';
import _ from 'lodash';
import { ACCESS_TOKEN, TOKEN_TYPE } from './constants';
import { LLM } from './services/llm/typings';
import { SYSTEM } from './services/system/typings';
import { USER } from './services/user/typings';
import { WORKSPACE } from './services/workspace/typings';

const loginPath = '/login';
const ignoreAuthPath = ['/login', '/setup'];

// 运行时配置

// eslint-disable-next-line @typescript-eslint/ban-types
export function render(oldRender: Function) {
  oldRender();
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  // 当前登录账号
  userMe?: USER.UserEntity;
  // 我的工作空间
  mineWorkspace?: WORKSPACE.WorkspaceEntity;
  // 初始化状态
  setupStatus?: boolean;
  // 应用
  appInfo?: SYSTEM.AppInfo;
  // 模型
  providers?: LLM.ProviderSchema[];
}> {
  // const pathname = history.location.pathname;

  const fetchUserInfo = async () => {
    try {
      const result = await userService.me();
      return result.content;
    } catch (ex) {
      return undefined;
    }
  };

  const fetchMineWorkspace = async () => {
    try {
      const result = await workspaceService.mine();
      return result.content;
    } catch (ex) {
      return undefined;
    }
  };

  const fetchSetupStatus = async () => {
    try {
      const result = await systemService.isSetup();
      return result.content;
    } catch (ex) {
      return undefined;
    }
  };

  const fetchAppInfo = async () => {
    try {
      const result = await systemService.profile();
      return result.content.app_info;
    } catch (ex) {
      return undefined;
    }
  };

  const fetchProviders = async () => {
    try {
      const result = await llmProviderService.providers();
      return result.content;
    } catch (ex) {
      return undefined;
    }
  };

  const [userMe, workspace, setupStatus, appInfo, providers] = await Promise.all<
    [
      Promise<USER.UserEntity | undefined>,
      Promise<WORKSPACE.WorkspaceEntity | undefined>,
      Promise<boolean | undefined>,
      Promise<SYSTEM.AppInfo | undefined>,
      Promise<LLM.ProviderSchema[] | undefined>,
    ]
  >([fetchUserInfo(), fetchMineWorkspace(), fetchSetupStatus(), fetchAppInfo(), fetchProviders()]);

  return {
    userMe: await userMe,
    mineWorkspace: await workspace,
    setupStatus: await setupStatus,
    appInfo: await appInfo,
    providers: await providers,
  };
}

const errorShow = (error: any) => {
  // 判断error是否为数组
  if (Array.isArray(error)) {
    message.warning(error[0]?.msg);
    return;
  }

  const {
    code,
    message: errorMessage,
    show_type: errorShowType,
    target,
  } = error.content || error;
  switch (errorShowType) {
    case ErrorShowType.SILENT:
      // Do Nothing
      break;
    case ErrorShowType.WARN_MESSAGE:
      message.warning(errorMessage);
      break;
    case ErrorShowType.ERROR_MESSAGE:
      message.error(errorMessage);
      break;
    case ErrorShowType.NOTIFICATION:
      notification.open({
        description: errorMessage,
        message: code,
      });
      break;
    case ErrorShowType.REDIRECT:
      message.error(errorMessage);
      history.push(target);
      break;
    default:
      message.error(errorMessage);
      break;
  }
};

const responseHandler = (
  response?: AxiosResponse<any>,
  opts: any | undefined = undefined,
) => {
  if (!response) {
    return undefined;
  }

  // 处理401，跳转到登录
  if (response.status === 401) {
    // 首页和登录页不需要
    if (
      !(
        location.pathname === '/' ||
        _.some(ignoreAuthPath, (path) => location.pathname.startsWith(path))
      )
    ) {
      message.info('登录中, 请稍等...');
      let redirectUri = location.pathname.startsWith('/api')
        ? '/'
        : location.pathname;
      if (redirectUri.startsWith(loginPath)) {
        const searchParams = new URLSearchParams(location.search);
        redirectUri = searchParams.get('redirectUri') || '/';
      }
      window.location.href = loginPath + '?redirectUri=' + redirectUri;
    }

    (opts || {}).skipErrorHandler = true;
  }

  return response;
};

// 请求配置：https://umijs.org/docs/max/request
export const request: RequestConfig = {
  timeout: 10_000,
  errorConfig: {
    errorThrower(res: Response.Response<any>) {
      const { success, code, content } = res;
      const message = content.message;
      const showType = content.show_type || ErrorShowType.ERROR_MESSAGE;
      const target = content.target;
      if (!success) {
        const error: any = new Error();
        error.name = 'BizError';
        error.code = code;
        error.message = message;
        error.content = content;
        error.showType = showType;
        error.target = target;
        throw error;
      }
    },
    errorHandler(error: any, opts: any) {
      console.error(error);
      responseHandler(error.response, opts);

      if (opts?.skipErrorHandler) {
        throw error;
      }

      if (error.name === 'BizError') {
        errorShow(error);
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (!!error.response.data) {
          errorShow(error.response.data);
        } else {
          message.error(`Response status:${error.response.status}`);
        }
      } else if (error.name === 'AxiosError') {
        message.warning(error.message);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },
  requestInterceptors: [
    (config: RequestOptions) => {
      // Bear Token
      if (!!window.localStorage.getItem(ACCESS_TOKEN)) {
        config.headers.Authorization = `${
          window.localStorage.getItem(TOKEN_TYPE) || 'bearer'
        } ${window.localStorage.getItem(ACCESS_TOKEN)}`;
      }
      return { ...config };
    },
  ],
  responseInterceptors: [responseHandler],
  // other axios options you want
};
