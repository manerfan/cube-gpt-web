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

import { CheckCircleFilled, EditOutlined, MoreOutlined, RobotOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Radio, Input, Button, Typography, Avatar, Space, Dropdown, Tooltip, Skeleton, Divider } from 'antd';
import styles from './styles.module.scss';
import BotCreateModal from './BotCreateModal';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { BOT } from '@/services/bot/typings';
import * as botService from '@/services/bot';
import _ from 'lodash';
import { Bot, Layers2 } from 'lucide-react';
import { useModel, history } from '@umijs/max';

const Studio: React.FC<{
    workspaceUid: string
}> = ({ workspaceUid }) => {
    const { initialState } = useModel('@@initialState');
    
    const [createModal, setCreateModal] = useState<{ open: boolean }>({ open: false })
    const showCreateModal = () => {
        setCreateModal({ open: true })
    }
    const closeCreateModal = () => {
        setCreateModal({ open: false })
    }

    const [bots, setBots] = useState<BOT.BotEntity[]>([]);
    const [hasMoreBots, setHasMoreBots] = useState(true);

    const [botListQry, setBotListQry] = useState<BOT.BotListQry>({});
    const [loadingBots, setLoadingBots] = useState(false);
    const [refreshBots, setRefreshBots] = useState(false);

    const loadMoreBots = (refresh: boolean = false) => {
        if (loadingBots) {
            return;
        }

        const lastBotUid = refresh ? undefined : _.last(bots)?.uid;
        if (refresh) setRefreshBots(true);
        setLoadingBots(true);
        botService.find(workspaceUid, { ...botListQry, afterUidLimit: lastBotUid }, 20).then((resp) => {
            const botEntities = resp.content || [];
            setBots(refresh ? botEntities : [...bots, ...botEntities]);
            setHasMoreBots(!_.isEmpty(botEntities));
        }).finally(() => {
            if (refresh) setRefreshBots(false);
            setLoadingBots(false);
        });
    }

    useEffect(() => {
        loadMoreBots(true);
    }, [workspaceUid, botListQry])

    return <>
        <InfiniteScroll
            loadMore={() => {
                loadMoreBots(false)
            }}
            hasMore={hasMoreBots}
            useWindow={true}
            initialLoad={false}
        >
            <ProCard
                direction="row" wrap ghost gutter={[8, 16]}
                title={
                    <Radio.Group defaultValue="all" buttonStyle="solid" disabled={loadingBots} onChange={(e) => {
                        setBotListQry({ ...botListQry, isPublished: e.target.value === 'published' ? true : undefined })
                    }}>
                        <Radio.Button value="all">所有</Radio.Button>
                        <Radio.Button value="published">已发布</Radio.Button>
                    </Radio.Group>
                }
                extra={<Input.Search placeholder="搜索智能体" loading={loadingBots} allowClear className='w-48' onSearch={(keyword) => {
                    setBotListQry({ ...botListQry, keyword })
                }} />}
            >
                <ProCard
                    key="addBot"
                    bordered
                    hoverable
                    style={{ height: 160 }}
                    bodyStyle={{ padding: 0 }}
                    colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
                >
                    <Button color="default" variant="filled" className='w-full h-full' disabled={loadingBots} onClick={showCreateModal}>
                        <Flex vertical className='w-full h-full' justify="center" align="center" gap={6}>
                            <Avatar src="/icons/plus.svg" />
                            <Typography.Text className='text-gray-500'>创建智能体</Typography.Text>
                        </Flex>
                    </Button>
                </ProCard>

                {_.map(bots, (bot) => {
                    return <ProCard
                        hidden={refreshBots}
                        key={bot.uid}
                        bordered
                        hoverable
                        bodyStyle={{ padding: '8px 12px' }}
                        className={`${styles['bot-card']}`}
                        style={{ height: 160 }}
                        colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
                        actions={(<Flex justify="space-between" align="center" className='w-full px-3' style={{ justifyContent: 'space-between' }}>
                            <Space>
                                <Avatar size={16} icon={<UserOutlined />} />
                                <Typography.Text type='secondary'>{bot.creator?.name || bot.creatorUid}</Typography.Text>
                            </Space>

                            <Space>
                                <Button size='small' icon={<StarOutlined />} color='default' variant='filled'></Button>
                                <Dropdown placement="bottomRight" trigger={['click']} menu={{
                                    items: [
                                        {
                                            key: '0',
                                            label: <Typography.Text>创建副本</Typography.Text>
                                        },
                                        {
                                            key: '1',
                                            label: <Typography.Text>迁移</Typography.Text>
                                        },
                                        {
                                            key: '2',
                                            label: <Typography.Text type='danger'>删除</Typography.Text>
                                        }
                                    ]
                                }}>
                                    <Button size='small' icon={<MoreOutlined />} color='default' variant='filled'></Button>
                                </Dropdown>
                            </Space>
                        </Flex>)}
                        onClick={() => {
                            if (initialState?.userMe?.uid === bot.creatorUid) {
                                history.push(`/modu/space/${workspaceUid}/bot/${bot.uid}/edit`)
                            } else if (!_.isEmpty(bot.publishUid)) {
                                history.push(`/modu/space/${workspaceUid}/bot/${bot.uid}/view`)
                            }
                        }}
                    >
                        <Flex vertical className='w-full h-full'>
                            <Flex justify="flex-start" align="center" gap={8} className='w-full flex-auto'>
                                <Flex vertical justify="center" align="flex-start" className='h-full' style={{ width: 'calc(100% - 76px)' }}>
                                    <Flex justify="flex-start" align="center" className='w-full h-1/2 flex-auto'>
                                        <Typography.Text ellipsis>{bot.name}</Typography.Text>
                                        <Typography.Text strong className={`w-6 pl-2 flex-initial ${_.isEmpty(bot.publishUid) ? 'text-gray-500' : 'text-red-500'}`}>
                                            {_.isEmpty(bot.publishUid) ? <EditOutlined /> : <CheckCircleFilled />}
                                        </Typography.Text>
                                    </Flex>

                                    <Tooltip title={bot.description}>
                                        <Typography.Text type='secondary' ellipsis className='h-1/2 w-full'>{bot.description}</Typography.Text>
                                    </Tooltip>
                                </Flex>
                                <Flex justify="center" align="center" className='h-full aspect-square'>
                                    <Avatar shape="square" icon={<RobotOutlined />} className='h-full w-full' />
                                </Flex>
                            </Flex>
                            <Flex justify="flex-start" align="center" className='w-full h-6'>
                                {bot.mode === botService.BotMode.SINGLE_AGENT
                                    ? <Typography.Text type='secondary' ellipsis><Bot size={14} className='pt-1' /> 单智能体</Typography.Text>
                                    : <Typography.Text type='secondary' ellipsis><Layers2 size={14} className='pt-1' />多智能体</Typography.Text>
                                }

                            </Flex>
                        </Flex>
                    </ProCard>
                })}

                {/* 加载动画 */}
                {(refreshBots || loadingBots) && _.times(2, (i) => <ProCard
                    key={`skeleton-${i}`}
                    bodyStyle={{ padding: '0' }}
                    style={{ height: 160 }}
                    className={`${styles['skeleton-card']}`}
                    colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
                >
                    <Skeleton.Node active style={{ width: '100%', height: '100%' }} >
                        <RobotOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                    </Skeleton.Node>
                </ProCard>
                )}
            </ProCard>

            {!loadingBots && !hasMoreBots && (
                <Flex justify="center" align="center" className="w-full mt-5">
                    <div>
                        <Divider className={`${styles['no-more-tip']}`}>
                            <Typography.Text type="secondary" className="text-xs">
                                没有更多智能体
                            </Typography.Text>
                        </Divider>
                    </div>
                </Flex>
            )}
        </InfiniteScroll>

        {
            hasMoreBots && (
                <Flex justify="center" align="center" className="w-full mt-10">
                    <Button color="default" variant="filled" size="small" loading={loadingBots} onClick={() => loadMoreBots()}>
                        <Typography.Text type="secondary">加载更多</Typography.Text>
                    </Button>
                </Flex>
            )
        }

        <BotCreateModal workspaceUid={workspaceUid} open={createModal.open} onCancel={closeCreateModal} onCreate={closeCreateModal} />
    </>
};

export default Studio;

