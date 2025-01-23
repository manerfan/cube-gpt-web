/* eslint-disable @typescript-eslint/no-unused-vars */
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
import TabHeader from '@/components/common/TabHeader';
import { Avatar, Button, Dropdown, Flex, message, Space, TabsProps, Tag, Tooltip, Typography } from 'antd';
import { BOT } from '@/services/bot/typings';
import { useEffect, useRef, useState } from 'react';
import { CheckCircleFilled, EditOutlined, HistoryOutlined, LeftOutlined, RobotOutlined, SaveOutlined } from '@ant-design/icons';
import { UsersRound } from 'lucide-react';
import BotOrchestration, { BotRefProperty } from './Orchestration';
import { workspaceService, botService } from '@/services';
import { WORKSPACE } from '@/services/workspace/typings';
import { useParams } from '@umijs/max';
import BotUpdateModal from '../BotCreateModal';
import moment from 'moment';
import BotConfigPublishHistoryDrawer from './BotConfigPublishHistoryDrawer';

const BotEdit: React.FC = () => {
    const param = useParams();

    const [workspace, setWorkspace] = useState<WORKSPACE.WorkspaceEntity>();
    const [bot, setBot] = useState<BOT.BotEntity>();

    // 智能体配置
    const botRef = useRef<BotRefProperty>(null);
    // 保存/发布 智能体配置 状态
    const [configActionLoading, setConfigActionLoading] = useState(false)
    // 保存/发布 智能体配置 时间
    const [configActionAt, setConfigActionAt] = useState<{ action: string, at: Date }>();

    // 基本信息辑弹窗
    const [baseInfoEditModal, setBaseInfoEditModal] = useState<{ open: boolean }>({ open: false })
    const showBaseInfoEditModal = () => {
        setBaseInfoEditModal({ open: true })
    }
    const closeBaseInfoEditModal = () => {
        setBaseInfoEditModal({ open: false })
    }

    // 发布历史抽屉
    const [publishHistoryDrawer, setPublishHistoryDrawer] = useState<{ open: boolean }>({ open: false })
    const showPublishHistoryDrawer = () => {
        setPublishHistoryDrawer({ open: true })
    }
    const closePublishHistoryDrawer = () => {
        setPublishHistoryDrawer({ open: false })
        botRef.current?.refreshBotConfig()
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
        window.setTimeout(() => eventBus.emit('modu.menu.collapsed', true), 500);
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
                <Avatar shape="square" icon={<RobotOutlined />} src={bot?.avatar} />
                <Flex vertical justify='center' align="flex-start" className='ml-2'>
                    <Space>
                        <Typography.Text>
                            {bot?.name || 'BOT'}
                        </Typography.Text>

                        <Button type="text" size='small' className='p-1' onClick={showBaseInfoEditModal}>
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
                        {!configActionAt && !!bot?.publish_uid &&
                            <Tag bordered={false} color="#EAEAEA" style={{ color: 'black' }}>
                                <Space>
                                    <CheckCircleFilled />
                                    <Typography.Text className="text-xs">已发布</Typography.Text>
                                </Space>
                            </Tag>
                        }
                        {!!configActionAt &&
                            <Tag bordered={false} color="#EAEAEA" style={{ color: 'black' }}>
                                <Space>
                                    <CheckCircleFilled />
                                    <Typography.Text className="text-xs">已{configActionAt.action}</Typography.Text>
                                    <Typography.Text className="text-xs">{moment(configActionAt.at).format('YYYY-MM-DD HH:mm:ss')}</Typography.Text>
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
                    <Button icon={<HistoryOutlined />} color='default' variant='filled' disabled={publishHistoryDrawer.open} onClick={showPublishHistoryDrawer} />
                </Tooltip>
                <Dropdown.Button type="primary" className='w-24'
                    disabled={publishHistoryDrawer.open}
                    menu={{
                        items: [{
                            key: 'save',
                            label: '保存',
                            icon: <SaveOutlined />,
                            disabled: publishHistoryDrawer.open,
                            onClick: () => {
                                const botConfig = botRef.current?.getBotConfigAndCheck();
                                if (!botConfig) return;
                                setConfigActionLoading(true)
                                botService.configSave(workspace!.uid, bot!.uid, botConfig.mode, botConfig.config).then((resp) => {
                                    message.success('保存成功');
                                    setConfigActionAt({ action: '保存', at: new Date() })
                                }).finally(() => setConfigActionLoading(false));
                            }
                        }]
                    }}
                    loading={configActionLoading}
                    onClick={() => {
                        const botConfig = botRef.current?.getBotConfigAndCheck();
                        if (!botConfig) return;
                        setConfigActionLoading(true)
                        botService.configPublish(workspace!.uid, bot!.uid, botConfig.mode, botConfig.config).then((resp) => {
                            if (resp.success) {
                                message.success('发布成功');
                                setBot({ ...bot!, publish_uid: resp.content })
                                setConfigActionAt({ action: '发布', at: new Date() })
                            }
                        }).finally(() => setConfigActionLoading(false));
                    }}>发布</Dropdown.Button>
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
            children: workspace && bot && <div className={`transition-[padding] ${publishHistoryDrawer.open ? 'pr-60' : 'pr-0'}`}>
                <BotOrchestration ref={botRef} workspace={workspace} bot={bot} />
            </div>,
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
                workspaceUid={param.spaceId!} open={baseInfoEditModal.open}
                modalMode="edit"
                bot={bot}
                onCancel={closeBaseInfoEditModal}
                onUpdate={(_bot) => {
                    setBot({ ...bot!, name: _bot.name, description: _bot.description, avatar: _bot.avatar })
                    closeBaseInfoEditModal();
                }} />

            <BotConfigPublishHistoryDrawer
                workspace={workspace!} bot={bot!}
                open={publishHistoryDrawer.open}
                onClose={closePublishHistoryDrawer}
                onSelect={(publishUid) => {
                    botRef.current?.refreshBotConfig(publishUid)
                }} />
        </>
    );
}

export default BotEdit;
