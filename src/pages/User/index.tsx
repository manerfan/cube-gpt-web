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

import TabHeader from "@/components/common/TabHeader";
import { EditOutlined } from "@ant-design/icons";
import { FluentEmoji, FluentEmojiProps, useControls, useCreateStore } from "@lobehub/ui";
import { Link, useModel, useParams } from "@umijs/max";
import { Avatar, Button, Flex, Result, Space, TabsProps, Typography } from "antd";
import UserFavorite from "./Favorite";
import UserCreation from "./Creation";
import UserInfoUpdateModal from "./UserInfoUpdateModal";
import { useState } from "react";

const User: React.FC = () => {
    const { initialState, setInitialState} = useModel('@@initialState');
    const param = useParams();

    const [updateModal, setUpdateModal] = useState<{ open: boolean }>({ open: false })
    const showUpdateModal = () => {
        setUpdateModal({ open: true })
    }
    const closeUpdateModal = () => {
        setUpdateModal({ open: false })
    }

    const store = useCreateStore();
    const control: FluentEmojiProps = useControls(
        {
            emoji: '😃',
            size: {
                max: 128,
                min: 16,
                step: 1,
                value: 64,
            },
        },
        { store },
    );

    // tab内容
    const items: TabsProps['items'] = [
        {
            key: 'creations',
            label: <Typography.Text>作品</Typography.Text>,
            children: <UserCreation />,
        },
        {
            key: 'favorites',
            label: <Typography.Text>收藏</Typography.Text>,
            children: <UserFavorite />,
        },
    ]

    return (param.userUid !== initialState?.userMe?.uid
        ? (<Flex vertical justify="center" align="center" className="h-full w-full">
            <Result
                status="403"
                title="403"
                subTitle="暂未开放对其他用户的空间访问"
                extra={<Button type="primary"><Link to="/modu/chat">先和我聊聊</Link></Button>}
            />
        </Flex>)
        : (<>
            <Flex className="px-20 py-10" gap={20}>
                <Avatar size={64} icon={<FluentEmoji type={'anim'} {...control} />} src={initialState?.userMe?.avatar_url} />
                <Flex vertical justify="center" align="flex-start" className="h-16 flex-auto">
                    <Space align="center" className="h-8">
                        <Typography.Title level={3} className="!m-0">{initialState?.userMe?.name}</Typography.Title>
                        <Typography.Text type="secondary">{initialState?.userMe?.email}</Typography.Text>
                    </Space>
                    <Flex justify="flex-start" align="center" className="h-8" gap={10}>
                        <Typography.Text type="secondary">{initialState?.userMe?.description || "这个用户很懒，什么都没有留下"}</Typography.Text>
                        <Button type="text" size="small" icon={<Typography.Text type="secondary" onClick={showUpdateModal}><EditOutlined /></Typography.Text>} />
                    </Flex>
                </Flex>
            </Flex>
            <Flex className="px-20 py-5">
                <TabHeader
                    className="w-full"
                    contentNoPpadding
                    items={items}
                    defaultActiveKey='favorites'
                />
            </Flex>

            <UserInfoUpdateModal
                open={updateModal.open}
                onCancel={closeUpdateModal}
                onUpdate={closeUpdateModal}
            />
        </>
        ));
};

export default User;