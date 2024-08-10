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

import _ from 'lodash';

/**
 * 将 bytes 字节数转为可读的字符串
 * @param bytes 字节数
 * @returns 可读的字符串
 */
export const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return '0 B';
  }

  const sizes = ['B', 'K', 'M', 'G', 'T'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedBytes = _.round(bytes / Math.pow(1024, i), 2);

  return `${formattedBytes} ${sizes[i]}`;
};

export const getPathAndModule = (path: string) => {
  const match = path.match(/^(\/[\w-|\\/]+)\/([\w-]+).*$/);
  return [_.get(match, 1, null), _.get(match, 2, null)];
};

/**
 * 将对象中下划线格式的键转换为驼峰格式
 * @param obj 要转换的对象
 * @returns 转换后的对象
 */
export function toCamelCase<T>(obj: T): T {
  if (_.isArray(obj)) {
    // 如果是数组，对数组的每个元素进行递归处理
    return obj.map((item) => toCamelCase(item)) as T;
  } else if (_.isObject(obj)) {
    // 如果是对象，首先用 _.mapKeys 转换对象的键
    return _.mapValues(
      _.mapKeys(obj, (value, key) => _.camelCase(key)),
      (value) => {
        // 然后对对象的值进行递归处理
        if (_.isObject(value)) {
          return toCamelCase(value);
        }
        return value;
      },
    ) as T;
  }

  // 如果既不是对象也不是数组，直接返回原值
  return obj;
}

/**
 * 将对象中驼峰格式的键转换为下划线
 * @param obj 要转换的对象
 * @returns 转换后的对象
 */
export function toSnakeCase<T>(obj: T): T {
  if (_.isArray(obj)) {
    // 如果是数组，对数组的每个元素进行递归处理
    return obj.map((item) => toSnakeCase(item)) as T;
  } else if (_.isObject(obj)) {
    // 如果是对象，首先用 _.mapKeys 转换对象的键
    return _.mapValues(
      _.mapKeys(obj, (value, key) => _.snakeCase(key)),
      (value) => {
        // 然后对对象的值进行递归处理
        if (_.isObject(value)) {
          return toSnakeCase(value);
        }
        return value;
      },
    ) as T;
  }

  // 如果既不是对象也不是数组，直接返回原值
  return obj;
}
