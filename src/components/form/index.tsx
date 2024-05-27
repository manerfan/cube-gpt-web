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

import { getLocaleContent } from '@/locales';
import type { Display } from '@/services/typings';
import {
  ProFormColumnsType,
  ProSchemaValueEnumType,
} from '@ant-design/pro-components';
import _ from 'lodash';

/**
 * 将FormSchema转为Antd Pro Schema Form可以使用的数据结构
 * @param formSchemas FormSchema
 * @param locale 当前语言
 * @returns ProFormColumnsType
 */
export function convertFormSchema2AntdFormSchema<T>(
  formSchemas?: Display.FormSchema[],
  locale?: string,
  initialValues?: Record<string, string | number>
): ProFormColumnsType<T>[] {
  if (!formSchemas) {
    return [];
  }

  return _.map(formSchemas, (formSchema) => {
    const jsonSchema = {
      key: formSchema.dataIndex,
      dataIndex: formSchema.dataIndex,
      // 字段标题
      title: getLocaleContent(formSchema.title, locale, ''),
      // 字段类型
      valueType: formSchema.valueType,
      // 字段提示
      tooltip: getLocaleContent<string>(formSchema.tooltip, locale),
      initialValue: initialValues?.[formSchema.dataIndex],
    } as ProFormColumnsType<T>;

    // 字段属性
    if (!!formSchema.fieldProps) {
      jsonSchema.fieldProps = {
        ...formSchema.fieldProps,
        placeholder: getLocaleContent<string>(
          formSchema.fieldProps.placeholder,
          locale,
        ),
      };
    }

    // 多值类型字段内容
    if (!!formSchema.valueEnum) {
      jsonSchema.valueEnum = _.mapValues(formSchema.valueEnum, (value) => {
        return {
          text: getLocaleContent<string>(value.text, locale, ''),
          status: value.status,
          color: value.color,
          disabled: value.disabled,
        } as ProSchemaValueEnumType;
      });
    }

    // 字段规则
    if (!!formSchema.rules) {
      jsonSchema.formItemProps = {};
      jsonSchema.formItemProps.rules = [
        {
          required: formSchema.rules.required,
          min: formSchema.rules.min,
          max: formSchema.rules.max,
          pattern: formSchema.rules.pattern
            ? new RegExp(formSchema.rules.pattern)
            : undefined,
          message: getLocaleContent<string>(formSchema.rules.message, locale),
        },
      ];
    }

    return jsonSchema;
  });
}
