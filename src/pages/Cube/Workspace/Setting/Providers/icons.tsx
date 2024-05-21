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

import { LLM } from '@/services/llm/typings';
import { Moonshot, OpenAI, Wenxin, Zhipu } from '@lobehub/icons';
import { Image, Typography } from 'antd';

const providerIcon: { [key: string]: LLM.ProviderIcon } = {
  openai: {
    icon: <OpenAI />,
    text: <OpenAI.Text />,
    combine: <OpenAI.Combine />,
    avatar: <OpenAI.Avatar size={64} />,
    color: OpenAI.colorPrimary,
  },
  moonshot: {
    icon: <Moonshot />,
    text: <Moonshot.Text />,
    combine: <Moonshot.Combine />,
    avatar: <Moonshot.Avatar size={64} />,
    color: Moonshot.colorPrimary,
  },
  zhipu: {
    icon: <Zhipu.Color />,
    text: <Zhipu.Text />,
    combine: <Zhipu.Combine type={'color'} />,
    avatar: <Zhipu.Avatar size={64} />,
    color: Zhipu.colorPrimary,
  },
  wenxin: {
    icon: <Wenxin.Color />,
    text: <Wenxin.Text />,
    combine: <Wenxin.Combine type={'color'} extra={'一言'} />,
    avatar: <Wenxin.Avatar size={64} />,
    color: Wenxin.colorPrimary,
  },
};

/**
 * 获取Provider Icon
 * @param provider provider key
 * @param defaultIcon 默认 Icon
 * @returns ProviderIcon
 */
export const getProviderIcon = (
  provider: string,
  defaultIcon?: LLM.ProviderIcon,
): LLM.ProviderIcon => {
  return providerIcon[provider] || defaultIcon || {};
};

/**
 * 使用Provider Schema获取Provider Icon
 * @param provider ProviderSchema
 * @returns ProviderIcon
 */
export const getProviderIconBySchema = (
  provider: LLM.ProviderSchema,
): LLM.ProviderIcon => {
  return getProviderIcon(provider.key, {
    icon: provider.icon?.icon || <span />,
    text: provider.name,
    combine: provider.icon?.combine ? (
      <Image preview={false} src={provider.icon.combine} height={24} />
    ) : (
      <Typography.Text>{provider.name}</Typography.Text>
    ),
    avatar: provider.icon?.avatar || <span />,
    color: provider.icon?.color || '#000000',
  });
};

// 将 HEX 颜色转换为 RGB 数组
const hexToRgb = (hex: string) => {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return [r, g, b];
};

// 将 RGB 数组转换为 HEX 颜色
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// 减淡颜色函数
export const lightenColor = (color: string, percent: number) => {
  let [r, g, b] = hexToRgb(color);
  r = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
  g = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
  b = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
  return rgbToHex(r, g, b);
};
