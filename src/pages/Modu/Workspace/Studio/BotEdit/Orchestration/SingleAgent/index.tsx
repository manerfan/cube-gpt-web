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

import { Button, Card, Flex, Space, Splitter, Typography } from 'antd';
import * as botService from '@/services/bot';
import BotModeSelect from '../BotModeSelect';
import ModelSelector from '@/pages/Modu/Workspace/components/llm/ModelSelector';
import ChatContent from '@/components/chat';
import { Sparkles } from 'lucide-react';

const SingleAgent: React.FC<{
    workspaceUid: string,
    botUid: string
}> = ({ workspaceUid, botUid }) => {
    return <Splitter className='w-full h-full'>
        <Splitter.Panel min="50%">
            <Card bordered={false} className='w-full h-full bg-transparent' styles={{ body: { padding: 12, height: 'calc(100% - 56px)' } }}
                title={<Flex justify='space-between' align='center' className='w-full'>
                    <Space size='large'>
                        <Typography.Text strong className='text-lg' >编排</Typography.Text>
                        <BotModeSelect defaultMode={botService.BotMode.SINGLE_AGENT} />
                    </Space>
                    <Space size='large'>
                        <ModelSelector
                            workspaceUid={workspaceUid}
                            providerWithModels={[]}
                            providerName='openai'
                            modelName='gpt-4o'
                            modelParameters={{}}
                        />
                    </Space>
                </Flex>}>
                <Flex vertical className='h-full' justify='flex-start' align='flex-start'>
                    <Flex className='w-full' justify='space-between' align='center'>
                        <Typography.Title level={5}>人设与回复逻辑</Typography.Title>
                        <Button size='small' color='default' variant='filled' icon={<Sparkles size={12} />}>优化</Button>
                    </Flex>
                    <div className='w-full flex-auto overflow-y-scroll'>
                        {/** TODO */}
                    </div>
                </Flex>
            </Card>
        </Splitter.Panel>
        <Splitter.Panel min={560} defaultSize={560}>
            <Card bordered={false} className='w-full h-full rounded-none' styles={{ body: { padding: 0, height: 'calc(100% - 56px)' } }}
                title={<Typography.Text strong className='text-lg' >预览与调试</Typography.Text>}>
                <ChatContent
                    workspaceUid={workspaceUid}
                    conversationUid={undefined}
                    className={`h-full max-h-full transition-[padding]`}
                />
            </Card>
        </Splitter.Panel>
    </Splitter>
}

export default SingleAgent;