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
import { Avatar, Image, Typography } from 'antd';

const providerIcon: { [key: string]: LLM.ProviderIcon } = {
  openai: {
    icon: (size?: number) => <OpenAI size={size} />,
    text: (size?: number) => <OpenAI.Text size={size} />,
    combine: (size?: number) => <OpenAI.Combine size={size} />,
    avatar: (size?: number) => <OpenAI.Avatar size={size || 18} />,
    color: OpenAI.colorPrimary,
  },
  moonshot: {
    icon: (size?: number) => <Moonshot size={size}/>,
    text: (size?: number) => <Moonshot.Text size={size}/>,
    combine: (size?: number) => <Moonshot.Combine size={size}/>,
    avatar: (size?: number) => <Moonshot.Avatar size={size || 18}/>,
    color: Moonshot.colorPrimary,
  },
  zhipu: {
    icon: (size?: number) => <Zhipu.Color size={size}/>,
    text: (size?: number) => <Zhipu.Text size={size}/>,
    combine: (size?: number) => <Zhipu.Combine type={'color'} size={size}/>,
    avatar: (size?: number) => <Zhipu.Avatar size={size || 18}/>,
    color: Zhipu.colorPrimary,
  },
  wenxin: {
    icon: (size?: number) => <Wenxin.Color size={size}/>,
    text: (size?: number) => <Wenxin.Text size={size}/>,
    combine: (size?: number) => <Wenxin.Combine type={'color'} extra={'一言'} size={size}/>,
    avatar: (size?: number) => <Wenxin.Avatar size={size || 18}/>,
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
  return getProviderIcon(provider.provider, {
    icon: (size?: number) => provider.icon?.icon ? (
      <Avatar size={(size || 18) + 2} src={provider.icon.icon} />
    ) : (
      <Typography.Text>{provider.name}</Typography.Text>
    ),
    text: (size?: number) => <Typography.Text>{provider.name}</Typography.Text>,
    combine: (size?: number) => provider.icon?.combine ? (
      <Image preview={false} src={provider.icon.combine} height={(size || 18) + 6} />
    ) : (
      <Typography.Text>{provider.name}</Typography.Text>
    ),
    avatar: (size?: number) => provider.icon?.avatar ? (
      <Avatar size={(size || 18) + 2} src={provider.icon.avatar} />
    ) : (
      <Typography.Text>{provider.name}</Typography.Text>
    ),
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
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
};

// 减淡颜色函数
export const lightenColor = (color: string, percent: number) => {
  let [r, g, b] = hexToRgb(color);
  r = Math.min(255, Math.floor(r + ((255 - r) * percent) / 100));
  g = Math.min(255, Math.floor(g + ((255 - g) * percent) / 100));
  b = Math.min(255, Math.floor(b + ((255 - b) * percent) / 100));
  return rgbToHex(r, g, b);
};
