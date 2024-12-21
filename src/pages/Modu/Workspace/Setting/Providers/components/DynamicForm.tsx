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

import { HIDDEN_PREFIX } from '@/constants';
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
  initialValues?: Record<string, string | number>,
): ProFormColumnsType<T>[] {
  if (!formSchemas) {
    return [];
  }

  return _.map(formSchemas, (formSchema) => {
    const jsonSchema = {
      key: formSchema.name,
      dataIndex: formSchema.name,
      // 字段标题
      title: getLocaleContent(formSchema.title, locale, ''),
      // 字段类型
      valueType: formSchema.value_type,
      // 字段提示
      tooltip: getLocaleContent<string>(formSchema.tooltip, locale),
      // 初始值
      initialValue: initialValues?.[formSchema.name],
      // 对脱敏字段进行处理 - server → form
      convertValue: (value, field) => {
        if (_.startsWith(value, HIDDEN_PREFIX)) {
          // 如果是脱敏字段值，则移除脱敏标进行展示
          return _.replace(value, HIDDEN_PREFIX, '');
        }

        return value;
      },
      // 对脱敏字段进行处理 - form → server
      transform: (value, namePath, allValues) => {
        if (_.isEqual(HIDDEN_PREFIX + value, initialValues?.[namePath])) {
          // 脱敏字段值如果没有修改，则带上脱敏标给服务端处理
          return HIDDEN_PREFIX + value;
        }
        return value;
      },
    } as ProFormColumnsType<T>;

    // 字段属性
    if (!!formSchema.field_props) {
      jsonSchema.fieldProps = {
        ...formSchema.field_props,
        placeholder: getLocaleContent<string>(
          formSchema.field_props.placeholder,
          locale,
        ),
      };
    }

    // 多值类型字段内容
    if (!!formSchema.value_enum) {
      const valueEnums = _.map(formSchema.value_enum, (value) => {
        return {
          value: value.value,
          text: getLocaleContent<string>(value.text, locale, ''),
          status: value.status,
          color: value.color,
          disabled: value.disabled,
        };
      });

      const valueEnum = {} as { [key: string]: ProSchemaValueEnumType };
      _.forEach(valueEnums, (value) => {
        valueEnum[value.value] = value as ProSchemaValueEnumType;
      });

      jsonSchema.valueEnum = valueEnum;
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
