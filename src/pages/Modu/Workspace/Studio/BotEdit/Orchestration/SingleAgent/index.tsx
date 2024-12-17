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

import { Avatar, Button, Card, Divider, Flex, Space, Splitter, Typography } from 'antd';
import * as botService from '@/services/bot';
import BotModeSelect from '../BotModeSelect';
import ModelSelectorWithType from '@/pages/Modu/Workspace/components/llm/ModelSelector/ModelSelectorWithType';
import ChatContent from '@/components/chat';
import { Sparkles } from 'lucide-react';
import LexicalTextarea from '@/components/markdown/lexical/lexical-textarea';
import { RobotOutlined } from '@ant-design/icons';
import { WORKSPACE } from '@/services/workspace/typings';
import { BOT } from '@/services/bot/typings';
import { ModelType } from '@/services/llm/model';

const SingleAgent: React.FC<{
    workspace: WORKSPACE.WorkspaceEntity,
    bot: BOT.BotEntity
}> = ({ workspace, bot }) => {
    return <Splitter className='w-full h-full overflow-auto'>
        {/* 智能体编排 */}
        <Splitter.Panel min="50%">
            <Card bordered={false} className='w-full h-full bg-transparent rounded-none' style={{ boxShadow: 'none' }} styles={{ body: { padding: 12, height: 'calc(100% - 56px)', overflow: 'auto' } }}
                title={<Flex justify='space-between' align='center' className='w-full'>
                    <Space size='large'>
                        <Typography.Text strong className='text-lg' >编排</Typography.Text>
                        <BotModeSelect defaultMode={botService.BotMode.SINGLE_AGENT} />
                    </Space>
                    <Space size='large'>
                        {/* 模型选择 */}
                        <ModelSelectorWithType
                            workspaceUid={workspace.uid}
                            modelType={ModelType.TEXT_GENERATION}
                            providerName='openai'
                            modelName='gpt-4o'
                            modelParameters={{}}
                            onSelect={(providerName, modelName, modelParameters) => {
                                console.log("onSelect", providerName, modelName, modelParameters)
                            }}
                            onProviderWithModelsLoaded={(providerWithModels) => {
                                console.log("onProviderWithModelsLoaded", providerWithModels)
                            }}
                            onProviderConfigAdd={(providerConfig) => {
                                console.log("onProviderConfigAdd", providerConfig)
                            }}
                        />
                    </Space>
                </Flex>}>
                <Flex justify='flex-start' align='flex-start' className='h-full'>
                    <Flex vertical justify='flex-start' align='flex-start' className='w-1/2 h-full'>
                        <Flex className='w-full' justify='space-between' align='center'>
                            <Typography.Title level={5}>人设与回复逻辑</Typography.Title>
                            <Button size='small' color='default' variant='filled' icon={<Sparkles size={12} />}>优化</Button>
                        </Flex>
                        <div className='w-full flex-auto overflow-y-scroll h-full mt-2 rounded-lg bg-gray-50 px-3 text-gray-600'>
                            <LexicalTextarea
                                placeholder='输入人设与回复逻辑，输入/插入已配置的技能或编辑样式...'
                                defaultValue=''
                                showToolbar={false} />
                        </div>
                    </Flex>

                    <Divider type='vertical' className='h-full' />

                    <Flex vertical justify='flex-start' align='flex-start' className='w-1/2 h-full'>
                        <Flex className='w-full' justify='space-between' align='center'>
                            <Typography.Title type='secondary' level={5}>技能</Typography.Title>
                        </Flex>
                        <div className='w-full flex-auto overflow-y-scroll h-full'>
                        </div>
                    </Flex>
                </Flex>
            </Card>
        </Splitter.Panel>

        {/* 预览与调试 */}
        <Splitter.Panel min={560} defaultSize={560}>
            <Card bordered={false} className='w-full h-full bg-transparent rounded-none' style={{ boxShadow: 'none' }} styles={{ body: { padding: 0, height: 'calc(100% - 56px)', overflow: 'auto' } }}
                title={<Typography.Text strong className='text-lg' >预览与调试</Typography.Text>}>
                <ChatContent
                    workspaceUid={workspace.uid}
                    conversationUid={undefined}
                    className={`h-full max-h-full transition-[height]`}
                    withChatBackgroundImage={false}
                    emptyNode={<Flex
                        vertical
                        justify="center"
                        align="center"
                        className='h-full'>
                        <Avatar shape="square" icon={<RobotOutlined />} />
                        <Typography.Title level={5} className='mt-6'>智能体名称</Typography.Title>
                        <Typography.Text type='secondary' >智能体描述智能体描述智能体描述</Typography.Text>
                    </Flex>}
                />
            </Card>
        </Splitter.Panel>
    </Splitter>
}

export default SingleAgent;