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

import { botService } from "@/services";
import { BOT } from "@/services/bot/typings";
import { PUBLISH } from "@/services/publish/typings";
import { WORKSPACE } from "@/services/workspace/typings";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Drawer, Flex, Skeleton, Space, Tag, Timeline, Tooltip, Typography } from "antd";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import _ from 'lodash';

const BotConfigPublishHistoryDrawer: React.FC<{
    workspace: WORKSPACE.WorkspaceEntity,
    bot: BOT.BotEntity,
    open: boolean,
    onClose?: () => void,
    onSelect?: (publish_uid?: string) => void,
}> = ({ workspace, bot, open, onClose, onSelect }) => {
    const [publishHistoryItems, setPublishHistoryItems] = useState<PUBLISH.PublishConfigEntity[]>([]);
    const [selectedPublishUid, setSelectedPublishUid] = useState<string>();

    const [publishHistoryLoading, setPublishHistoryLoading] = useState(false);

    useEffect(() => {
        if (!workspace || !bot || !open) return;

        setSelectedPublishUid(undefined);
        setPublishHistoryLoading(true);
        botService.listConfigDraft(workspace.uid, bot.uid).then((resp) => {
            setPublishHistoryItems(resp.content || []);
        }).finally(() => setPublishHistoryLoading(false));
    }, [workspace, bot, open]);

    return <Drawer
        width={240}
        mask={false} maskClosable={false} keyboard={false} destroyOnClose
        title={<Space>
            <Typography.Title level={5} className="!mb-0">发布历史</Typography.Title>
            <Tooltip title="仅保留最新的 100 条记录">
                <Typography.Text type="secondary"><QuestionCircleOutlined /></Typography.Text>
            </Tooltip>
        </Space>}
        open={open}
        onClose={onClose}>
        <Timeline items={[
            {
                children: <Flex justify="space-between" align="center"
                    className={`w-full cursor-pointer hover:bg-gray-100 rounded-md p-2 border border-solid ${!selectedPublishUid ? 'bg-gray-50 border-gray-200' : 'border-transparent'}`}
                    onClick={() => {
                        setSelectedPublishUid(undefined);
                        onSelect?.();
                    }}>
                    <Tag color="rgb(255, 241, 204)"><Typography.Text className="text-xs text-orange-400">当前</Typography.Text></Tag>
                </Flex>,
                color: 'gray'
            },
            ...publishHistoryLoading
                // 加载发布历史时，显示骨架屏
                ? _.times(2, () => ({
                    children: <Flex vertical justify="space-between" align="center" gap={8}>
                        <Skeleton.Input active />
                    </Flex>,
                    color: 'green'
                }))
                : publishHistoryItems.map((item: PUBLISH.PublishConfigEntity) => ({
                    children: <Flex vertical justify="space-between" align="center" gap={8}
                        className={`w-full cursor-pointer hover:bg-gray-100 rounded-md p-2 border border-solid ${selectedPublishUid === item.uid ? 'bg-gray-50 border-gray-200' : 'border-transparent'}`}
                        onClick={() => {
                            setSelectedPublishUid(item.uid);
                            onSelect?.(item.uid);
                        }}>
                        <Flex justify="space-between" align="center" className="w-full">
                            <Tag color="rgb(240 253 244)"><Typography.Text className="text-xs text-green-700">{item.publish_status === 'PUBLISHED' ? '发布' : '草稿'}</Typography.Text></Tag>
                            <Typography.Text type="secondary" className="text-xs">{moment(item.updated_at!).format('MM-DD HH:mm')}</Typography.Text>
                        </Flex>
                        <Flex justify="space-between" align="center" className="w-full">
                            <Space>
                                <Typography.Text type="secondary" className="text-xs">ID:</Typography.Text>
                                <Typography.Text type="secondary" className="text-xs" ellipsis copyable>{item.uid}</Typography.Text>
                            </Space>
                        </Flex>
                    </Flex>,
                    color: item.publish_status === 'PUBLISHED' ? 'green' : 'orange'
                }))
        ]} />
    </Drawer>
}

export default BotConfigPublishHistoryDrawer;