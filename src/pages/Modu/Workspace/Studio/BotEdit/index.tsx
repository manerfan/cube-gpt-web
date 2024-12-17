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

import { eventBus } from '@/services';
import TabHeader from '../../components/TabHeader';
import { Avatar, Button, Flex, Space, TabsProps, Tag, Tooltip, Typography } from 'antd';
import { BOT } from '@/services/bot/typings';
import { useEffect, useState } from 'react';
import { CheckCircleFilled, EditOutlined, HistoryOutlined, LeftOutlined, RobotOutlined } from '@ant-design/icons';
import { UsersRound } from 'lucide-react';
import BotOrchestration from './Orchestration';
import { workspaceService, botService } from '@/services';
import { WORKSPACE } from '@/services/workspace/typings';
import { useParams } from '@umijs/max';
import BotUpdateModal from '../BotCreateModal';

const BotEdit: React.FC = () => {
    const param = useParams();

    const [workspace, setWorkspace] = useState<WORKSPACE.WorkspaceEntity>();
    const [bot, setBot] = useState<BOT.BotEntity>();

    const [editModal, setEditModal] = useState<{ open: boolean }>({ open: false })

    const showEditModal = () => {
        setEditModal({ open: true })
    }
    const closeEditModal = () => {
        setEditModal({ open: false })
    }

    useEffect(() => {
        workspaceService.detail(param.spaceId!).then((res) => {
            const space = res.content;
            setWorkspace(space);
        });

        botService.detail(param.spaceId!, param.botUid!).then((res) => {
            const bot = res.content;
            setBot(bot);
        });

        // 发送折叠菜单的事件 see ModuWrapper
        eventBus.emit('modu.menu.collapsed', true);
    }, [param.spaceId, param.botUid]);

    // tab左右两侧内容
    const tabBarExtraContent = {
        left: (
            <Space style={{ marginLeft: '1rem' }}>
                <Button
                    type="text"
                    icon={<LeftOutlined />}
                    className="text-gray-500 font-bold"
                    onClick={() => history.back()}
                />
                <Avatar shape="square" icon={bot?.avatar ? bot?.avatar : <RobotOutlined />} />
                <Flex vertical justify='center' align="flex-start" className='ml-2'>
                    <Space>
                        <Typography.Text>
                            {bot?.name || 'BOT'}
                        </Typography.Text>

                        <Button type="text" size='small' className='p-1' onClick={showEditModal}>
                            <Typography.Text className="text-gray-500 font-bold"><EditOutlined /></Typography.Text>
                        </Button>
                    </Space>

                    <Space>
                        <Tag bordered={false} color="#EAEAEA" style={{ color: 'black' }}>
                            <Space>
                                <UsersRound size={10} />
                                <Typography.Text className="text-xs">{workspace?.name}</Typography.Text>
                            </Space>
                        </Tag>
                        {!!bot?.publishUid &&
                            <Tag bordered={false} color="#EAEAEA" style={{ color: 'black' }}>
                                <Space>
                                    <CheckCircleFilled />
                                    <Typography.Text className="text-xs">已发布</Typography.Text>
                                </Space>
                            </Tag>
                        }
                    </Space>

                </Flex>

            </Space>
        ),
        right: (
            <Space style={{ marginRight: '1rem' }}>
                <Tooltip title='发布历史' placement='left'>
                    <Button icon={<HistoryOutlined />} color='default' variant='filled' />
                </Tooltip>
                <Button type="primary" className='w-24'>发布</Button>
            </Space>
        ),
    };

    // tab内容
    const items: TabsProps['items'] = [
        {
            key: 'orchestration',
            label: (
                <>
                    <Space align="center" size={0}>
                        <Typography.Text>编排</Typography.Text>
                    </Space>
                </>
            ),
            children: workspace && bot && <BotOrchestration workspace={workspace} bot={bot} />,
        },
    ]

    return (
        <>
            <TabHeader
                centered
                sticky
                contentNoPpadding
                locationUpdate
                tabBarRender
                items={items}
                defaultActiveKey='orchestration'
                tabBarExtraContent={tabBarExtraContent}
            />

            <BotUpdateModal
                workspaceUid={param.spaceId!} open={editModal.open}
                modalMode="edit"
                bot={bot}
                onCancel={closeEditModal}
                onUpdate={(_bot) => {
                    setBot({ ...bot!, name: _bot.name, description: _bot.description })
                    closeEditModal();
                }} />
        </>
    );
}

export default BotEdit;
