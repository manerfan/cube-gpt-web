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
import * as icons from '@/pages/Cube/Workspace/components/llm/icons';
import { formatBytes } from '@/services/common';
import { ModelFeature } from '@/services/llm/model';
import type { LLM } from '@/services/llm/typings';
import { EyeFilled } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Space, Tag, Tooltip, Typography } from 'antd';
import _ from 'lodash';
import { SlidersHorizontal } from 'lucide-react';

const ModelItem: React.FC<{
  providerSchema?: LLM.ProviderSchema;
  modelSchema?: LLM.ModelSchema;
  textType?: 'secondary' | 'success' | 'warning' | 'danger';
  disable?: boolean;
  slider?: boolean;
  empty?: React.ReactNode;
  onClick?: () => void;
}> = ({ providerSchema, modelSchema, textType, disable, slider, empty, onClick}) => {
  const intl = useIntl();

  if (!providerSchema || !modelSchema) {
    return <>{empty}</> || <></>;
  }

  const icon = icons.getProviderIconBySchema(providerSchema);

  return (
    <>
      <Space align="center" className={disable ? 'opacity-40' : ''} onClick={() => onClick?.()}>
        {/** 图标 */}
        <div className="relative top-1">{icon.icon(18)}</div>

        {/** 名称 */}
        <Tooltip
          title={
            <Typography.Text className="text-slate-100 text-xs">
              {getLocaleContent(
                modelSchema.discription,
                intl.locale,
                modelSchema.name,
              )}
            </Typography.Text>
          }
          color={icons.lightenColor(icon.color, 90)}
        >
          <Typography.Text type={textType}>{modelSchema.name}</Typography.Text>
        </Tooltip>

        {/** 模式 */}
        {!!modelSchema.properties.mode && (
          <Tag bordered={false} className="m-0">
            <Typography.Text type={textType} className="text-xs text-slate-500">
              {_.upperCase(modelSchema.properties.mode)}
            </Typography.Text>
          </Tag>
        )}

        {/** 上下文 */}
        {!!modelSchema.properties.contextSize &&
          _.isNumber(modelSchema.properties.contextSize) && (
            <Tag bordered={false} className="m-0">
              <Typography.Text
                type={textType}
                className="text-xs text-slate-500"
              >
                {formatBytes(modelSchema.properties.contextSize)}
              </Typography.Text>
            </Tag>
          )}

        {/** 特性 */}
        {_.map(
          _.filter(
            modelSchema.features,
            (feature) => feature !== ModelFeature.VISION,
          ),
          (feature) => (
            <Tag bordered={false} className="m-0">
              <Typography.Text
                type={textType}
                className="text-xs text-slate-500"
              >
                {feature}
              </Typography.Text>
            </Tag>
          ),
        )}
        {_.includes(modelSchema.features, ModelFeature.VISION) && (
          <Tooltip
            title={
              <Typography.Text className="text-slate-100 text-xs">
                支持 {ModelFeature.VISION} 功能
              </Typography.Text>
            }
            color={icons.lightenColor(icon.color, 90)}
          >
            <Tag bordered={false} className="m-0">
              <Typography.Text
                type={textType}
                className="text-xs text-slate-500"
              >
                <EyeFilled />
              </Typography.Text>
            </Tag>
          </Tooltip>
        )}

        {slider && (
          <SlidersHorizontal size={16} color="#6e7481" className="block" />
        )}
      </Space>
    </>
  );
};

export default ModelItem;
