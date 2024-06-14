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
import { Display } from '@/services/typings';
import {
  CheckOutlined,
  EyeInvisibleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Col,
  InputNumber,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Tooltip,
  Typography,
} from 'antd';

import _ from 'lodash';
import { useState } from 'react';

/**
 * 自动判断步长
 * @param min 最小值
 * @param max 最大值
 * @returns 步长
 */
const judgeStep = (min?: number, max?: number, def?: number) => {
  if (min === undefined || min === null || max === undefined || max === null) {
    return def || 1;
  }

  if (max - min < 5) {
    return 0.1;
  }

  if (max - min > 500) {
    return 100;
  }

  if (max - min > 50) {
    return 10;
  }

  return 1;
};

/**
 * 模型参数设置
 *
 * 由于需要有一些特殊的交互逻辑
 * 这里未使用 AndPro Schema Form 而是自己手动解析
 */
const ModelSettingItem: React.FC<{
  itemSchema: Display.FormSchema;
  itemValue?: any;
  onChange?: (value: any) => void;
}> = ({ itemSchema, itemValue, onChange }) => {
  const intl = useIntl();

  const [currentValue, setCurrentValue] = useState<any>(() => {
    if (itemValue !== undefined) {
      return itemValue;
    }

    if (itemSchema.initialValue !== undefined) {
      return itemSchema.initialValue;
    }

    if (itemSchema.valueType === 'digit') {
      return itemSchema.fieldProps?.min || 0;
    }

    return undefined;
  });
  const [enabeld, setEnabeld] = useState<boolean>(
    (itemValue !== undefined && itemValue !== null) ||
      itemSchema.rules?.required ||
      false,
  );

  let itemCol = <></>;
  switch (itemSchema.valueType) {
    // 数字
    case 'digit': {
      // 判断是否显示滑动条
      const beSlider =
        itemSchema.fieldProps?.min !== undefined &&
        itemSchema.fieldProps?.max !== undefined;

      // 步长
      const step = judgeStep(
        itemSchema.fieldProps?.min,
        itemSchema.fieldProps?.max,
        1,
      );

      itemCol = (
        <>
          {/** 滑动条 */}
          {beSlider && (
            <Col span={9}>
              <Slider
                className="my-1.5 mx-0"
                min={itemSchema.fieldProps!.min}
                max={itemSchema.fieldProps!.max}
                step={step}
                tooltip={{ open: false }}
                value={currentValue}
                disabled={!enabeld}
                onChange={(value) => {
                  setCurrentValue(value);
                  onChange?.(value);
                }}
              />
            </Col>
          )}

          {/** 数字框 */}
          <Col span={beSlider ? 5 : 14}>
            <InputNumber
              min={itemSchema.fieldProps?.min || 0}
              max={itemSchema.fieldProps?.max}
              step={step}
              precision={itemSchema.fieldProps?.precision || 0}
              value={currentValue}
              size="small"
              variant="filled"
              className="w-full"
              disabled={!enabeld}
              onChange={(value) => {
                setCurrentValue(value);
                onChange?.(value);
              }}
            />
          </Col>
        </>
      );
      break;
    }

    // 选择框
    case 'select': {
      const options = _.map(itemSchema.valueEnum || [], (value) => {
        return {
          value: value.value,
          label: getLocaleContent<string>(value.text, intl.locale, ''),
          disabled: value.disabled,
          status: value.status,
          color: value.color,
        };
      });
      itemCol = (
        <>
          <Col span={14}>
            <Select
              style={{ maxWidth: '100%' }}
              size="small"
              variant="filled"
              mode={itemSchema.fieldProps?.mode}
              allowClear
              options={options}
              value={currentValue}
              disabled={!enabeld}
              placeholder={
                itemSchema.fieldProps?.mode === 'tags'
                  ? '输入并按TAB/ENTER健确认'
                  : undefined
              }
              onChange={(value) => {
                setCurrentValue(value);
                onChange?.(value);
              }}
            />
          </Col>
        </>
      );
      break;
    }
    default: {
      break;
    }
  }

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Space align="center" size={6} className="relative top-0.5">
          <Tooltip
            title={getLocaleContent(itemSchema.title, intl.locale, '参数')}
          >
            <Typography.Text strong className="text-gray-700" ellipsis>
              {getLocaleContent(itemSchema.title, intl.locale, '参数')}
            </Typography.Text>
          </Tooltip>

          <Tooltip
            title={
              <pre className="whitespace-pre-wrap text-pretty">
                {getLocaleContent(itemSchema.tooltip, intl.locale, '')}
              </pre>
            }
          >
            <QuestionCircleOutlined className="text-gray-500" />
          </Tooltip>
        </Space>
      </Col> 
      <Col span={3}>
        <Switch
          size="small"
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          defaultChecked={
            (itemValue !== undefined && itemValue !== null) ||
            itemSchema.rules?.required
          }
          disabled={itemSchema.rules?.required}
          onChange={(checked) => {
            setEnabeld(checked);
            onChange?.(checked ? currentValue : undefined);
          }}
        />
      </Col>
      <Col span={1}></Col>

      {itemCol}
    </Row>
  );
};

export default ModelSettingItem;
