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

import type { BotMode } from '@/services/bot';
import { Flex, List, Popover, Space, Typography } from 'antd';
import * as botService from '@/services/bot';
import { Layers2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { eventBus } from '@/services';

const BotModeSelect: React.FC<{
    defaultMode: BotMode
    onSelect?: (mode: BotMode) => void
}> = ({ defaultMode, onSelect }) => {

    const [mode, setMode] = useState<BotMode>(defaultMode);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const options = [
        {
            value: botService.BotMode.SINGLE_AGENT,
            label: '单Agent',
            desc: '智能体只有一个Agent，用户于大模型进行对话，适用于逻辑较为简单的智能体。',
            icon: <Sparkles size={12} />
        },
        {
            value: botService.BotMode.MULTI_AGENTS,
            label: '多Agents',
            desc: '在一个智能体中设置多个Agents，以处理复杂的逻辑。',
            icon: <Layers2 size={12} />
        },
    ];

    const valueRender = () => {
        const option = _.find(options, (o) => o.value === mode);
        if (!option) {
            return <></>;
        }

        return <Space>{option.icon}<Typography.Text>{option.label}</Typography.Text></Space>
    }

    const optionRender = (option) => {
        return <Flex vertical align='flex-start' justify='center' gap={6}>
            <Space>
                {option.icon}
                <Typography.Text strong>{option.label}</Typography.Text>
            </Space>
            <Typography.Text type='secondary' className='text-sm'>{option.desc}</Typography.Text>
        </Flex>
    }

    return <Popover
        placement="bottomRight"
        trigger="click"
        arrow={false}
        content={<>
            <Typography.Title level={5}>选择模式</Typography.Title>
            <List
                size="small"
                bordered={false}
                itemLayout="horizontal"
                dataSource={options}
                rowKey={(option) => option.value}
                renderItem={(option) => (
                    <List.Item
                        style={option.value === mode ? { borderBlockEnd: '1.5px solid #475569' } : { borderBlockEnd: '1.5px solid #e2e8f0' }}
                        className={`relative group my-3 border-solid rounded-lg hover:bg-gray-100 cursor-pointer ${(option.value === mode)
                            ? 'border-gray-600 bg-gray-50'
                            : 'border-gray-200'
                            }`}
                        onClick={() => {
                            setMode(option.value);
                            onSelect?.(option.value);
                            setPopoverOpen(false);

                            // 发送切换 bot mode 的事件 see BotOrchestration
                            eventBus.emit('modu.bot.mode', option.value);
                        }}
                    >{optionRender(option)}</List.Item>
                )}
            />
        </>}
        open={popoverOpen}
        onOpenChange={(open) => {
            setPopoverOpen(open);
        }}
    >
        <div className={`min-h-8 rounded-md px-2 py-1 cursor-pointer bg-gray-100 hover:bg-gray-200`}>
            <Flex justify="space-between" align="center" gap={10}>
                <Space>
                    {valueRender()}
                </Space>
                <Space>
                    <Typography.Text
                        type="secondary"
                        strong
                        className="text-xs leading-8"
                    >
                        <DownOutlined />
                    </Typography.Text>
                </Space>
            </Flex>
        </div>
    </Popover>
}

export default BotModeSelect;