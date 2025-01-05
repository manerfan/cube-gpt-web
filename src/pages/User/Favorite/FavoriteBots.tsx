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


import { useEffect, useState } from "react";

import { USER_FAVORITE } from "@/services/user/favorite/typings";

import _ from 'lodash';
import InfiniteScroll from "react-infinite-scroller";
import { Avatar, Button, Divider, Dropdown, Flex, Input, Skeleton, Space, Tooltip, Typography } from "antd";

import styles from '../styles.module.scss';
import { ProCard } from "@ant-design/pro-components";
import { useModel, history } from "@umijs/max";
import { CheckCircleFilled, EditOutlined, MoreOutlined, RobotOutlined, StarFilled, StarOutlined, UserOutlined } from "@ant-design/icons";
import { botService, favoriteService } from "@/services";
import { Bot, Layers2 } from "lucide-react";

const FavoriteBots: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const [favoriteBots, setFavoriteBots] = useState<USER_FAVORITE.BotFavoriteEntity[]>([]);
    const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
    const [refreshFavorites, setRefreshFavorites] = useState(false);

    const [favoriteListQry, setFavoriteListQry] = useState<USER_FAVORITE.BotFavoriteListQry>({});
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const loadMoreFavorits = (refresh: boolean = false) => {
        if (loadingFavorites) {
            return;
        }

        const lastFavoriteUid = refresh ? undefined : _.last(favoriteBots)?.favorite_uid;
        if (refresh) setRefreshFavorites(true);
        setLoadingFavorites(true);
        favoriteService.findFavoriteBots({ ...favoriteListQry, after_uid_limit: lastFavoriteUid }, 20).then((resp) => {
            const favoriteEntities = resp.content || [];
            setFavoriteBots(refresh ? favoriteEntities : [...favoriteBots, ...favoriteEntities]);
            setHasMoreFavorites(!_.isEmpty(favoriteEntities));
        }).finally(() => {
            if (refresh) setRefreshFavorites(false);
            setLoadingFavorites(false);
        });
    }

    useEffect(() => {
        loadMoreFavorits(true);
    }, [favoriteListQry])

    return <>
        <InfiniteScroll
        loadMore={() => {
                loadMoreFavorits(false)
        }}
        hasMore={hasMoreFavorites}
        useWindow={true}
        initialLoad={false}
    >
            <ProCard
                className="relative"
                direction="row" wrap ghost gutter={[8, 16]}
                extra={<Input.Search placeholder="搜索智能体" loading={loadingFavorites} allowClear className='absolute w-48 -top-8 right-0' onSearch={(keyword) => {
                    setFavoriteListQry({ ...favoriteListQry, keyword })
                }} />}
            >
                {_.map(favoriteBots, (bot) => {
                    const dropdownItems = [{
                        key: 'chat',
                        label: <Typography.Text>快速对话</Typography.Text>,
                        disabled: false
                    }];
                    if (initialState?.userMe?.uid === bot.creator_uid) {
                        dropdownItems.push({
                            key: 'edit',
                            label: <Typography.Text>编辑</Typography.Text>,
                            disabled: false
                        });
                    }

                    const hasPublished = !!bot?.publish_uid;

                    return <ProCard
                        hidden={refreshFavorites}
                        key={bot.uid}
                        bordered
                        hoverable
                        bodyStyle={{ padding: '8px 12px' }}
                        className={`${styles['bot-card']}`}
                        style={{ height: 160 }}
                        colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
                        actions={(<Flex justify="space-between" align="center" className='w-full px-3' style={{ justifyContent: 'space-between' }}>
                            <Space className="!max-w-56">
                                <Avatar size={16} icon={<UserOutlined />} />
                                <Typography.Text type='secondary' className="!max-w-18" ellipsis>{bot.creator?.name || bot.creator_uid}</Typography.Text>
                                <Typography.Text type='secondary' className="!max-w-28" ellipsis>{bot.workspace?.name}</Typography.Text>
                            </Space>

                            <Space>
                                <Tooltip title={'收藏'}>
                                    <Button size='small' color='default' variant='filled'
                                        icon={bot.is_favorite ? <Typography.Text className='text-yellow-400'><StarFilled /></Typography.Text> : <StarOutlined />}
                                        loading={favoriteLoading}
                                        className='border-none' disabled={!hasPublished}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setFavoriteLoading(true);
                                            botService.favorite(bot.workspace_uid, bot.uid, !bot.is_favorite).then((resp) => {
                                                if (resp.success && resp.content) {
                                                    if (!!bot.is_favorite) {
                                                        const newFavorites = _.filter(favoriteBots, (b) => b.uid !== bot.uid);
                                                        setFavoriteBots(newFavorites);
                                                    }
                                                }
                                            }).finally(() => {
                                                setFavoriteLoading(false);
                                            })
                                        }} />
                                </Tooltip>
                                <Dropdown placement="bottomRight" trigger={['click']} menu={{
                                    items: dropdownItems,
                                    onClick: ({ key, domEvent }) => {
                                        domEvent.stopPropagation();
                                        domEvent.preventDefault();
                                        switch (key) {
                                            case 'edit':
                                                history.push(`/modu/space/${bot.workspace_uid}/bot/${bot.uid}/edit`);
                                                break;
                                            case 'chat':
                                                history.push(`/modu/space/${bot.workspace_uid}/bot/${bot.uid}/view`);
                                                break;
                                        }
                                    }
                                }}>
                                    <Button size='small' icon={<MoreOutlined />} color='default' variant='filled' onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }} />
                                </Dropdown>
                            </Space>
                        </Flex>)}
                        onClick={() => {
                            if (initialState?.userMe?.uid === bot.creator_uid) {
                                history.push(`/modu/space/${bot.workspace_uid}/bot/${bot.uid}/edit`)
                            } else if (!_.isEmpty(bot.publish_uid)) {
                                history.push(`/modu/space/${bot.workspace_uid}/bot/${bot.uid}/view`)
                            }
                        }}
                    >
                        <Flex vertical className='w-full h-full'>
                            <Flex justify="flex-start" align="center" gap={8} className='w-full flex-auto'>
                                <Flex vertical justify="center" align="flex-start" className='h-full' style={{ width: 'calc(100% - 76px)' }}>
                                    <Flex justify="flex-start" align="center" className='w-full h-1/2 flex-auto'>
                                        <Typography.Text strong ellipsis className='text-lg'>{bot.name}</Typography.Text>
                                        <Typography.Text className={`w-6 pl-2 flex-initial ${_.isEmpty(bot.publish_uid) ? 'text-gray-500' : 'text-green-500'}`}>
                                            {_.isEmpty(bot.publish_uid) ? <EditOutlined /> : <CheckCircleFilled />}
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
                {(refreshFavorites || loadingFavorites) && _.times(2, (i) => <ProCard
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

        {!loadingFavorites && !hasMoreFavorites && (
                <Flex justify="center" align="center" className="w-full mt-5">
                    <div>
                        <Divider className={`${styles['no-more-tip']}`}>
                            <Typography.Text type="secondary" className="text-xs">
                                没有更多收藏
                            </Typography.Text>
                        </Divider>
                    </div>
                </Flex>
            )}
    </InfiniteScroll>

        {
            hasMoreFavorites && (
                <Flex justify="center" align="center" className="w-full mt-10">
                    <Button color="default" variant="filled" size="small" loading={loadingFavorites} onClick={() => loadMoreFavorits()}>
                        <Typography.Text type="secondary">加载更多</Typography.Text>
                    </Button>
                </Flex>
            )
        }
    </>
}

export default FavoriteBots;