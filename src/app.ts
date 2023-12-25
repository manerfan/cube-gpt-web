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

import { ErrorShowType } from '@/services';
import type { Response } from '@/services/typings';
import { RequestConfig, RequestOptions, history } from '@umijs/max';
import { message, notification } from 'antd';
import { ACCESS_TOKEN, TOKEN_TYPE } from './constants';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{
//   userMe?: USER.UserEntity;
// }> {
//   // const pathname = history.location.pathname;

//   const fetchUserInfo = async () => {
//     try {
//       const result = await userService.me();
//       return result.content;
//     } catch (ex) {
//       return undefined;
//     }
//   };
// }

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
  } = error;
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

// 请求配置：https://umijs.org/docs/max/request
export const request: RequestConfig = {
  timeout: 1000,
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

      if (opts?.skipErrorHandler) {
        throw error;
      }

      if (error.name === 'BizError') {
        errorShow(error);
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        if (!!error.response.data?.content) {
          errorShow(error.response.data.content);
        } else {
          message.error(`Response status:${error.response.status}`);
        }
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
      if (!!window.localStorage.getItem('accessToken')) {
        config.headers.Authorization = `${
          window.localStorage.getItem(TOKEN_TYPE) || 'bearer'
        } ${window.localStorage.getItem(ACCESS_TOKEN)}`;
      }
      return { ...config };
    },
  ],
  responseInterceptors: [
    // (response: AxiosResponse<any>) => {
    //   const data = response.data;
    //   if (!!data.content) {
    //     return data.content;
    //   }
    //   return data;
    // },
  ],
  // other axios options you want
};
