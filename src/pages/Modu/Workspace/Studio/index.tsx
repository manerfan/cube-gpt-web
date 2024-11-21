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


import { CheckCircleFilled, MoreOutlined, RobotOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Flex, Radio, Input, Button, Typography, Avatar, Space, Dropdown } from 'antd';
import { Plus } from 'lucide-react';
import styles from './styles.module.scss';

const Studio: React.FC<{
    workspaceUid: string
}> = ({ workspaceUid }) => {
    return <>
        <ProCard
            direction="row"
            wrap
            ghost
            gutter={[8, 16]}
            title={
                <Radio.Group defaultValue="all" buttonStyle="solid">
                    <Radio.Button value="all">所有</Radio.Button>
                    <Radio.Button value="published">已发布</Radio.Button>
                </Radio.Group>
            }
            extra={<Input.Search placeholder="搜索智能体" allowClear className='w-48' />}
        >
            <ProCard
                key="addBot"
                bordered
                hoverable
                style={{ height: 160 }}
                bodyStyle={{ padding: 0 }}
                colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
            >
                <Button color="default" variant="filled" className='w-full h-full'>
                    <Flex vertical className='w-full h-full' justify="center" align="center">
                        <Plus size={80} className='text-gray-500' />
                        <Typography.Text className='text-gray-500'>创建智能体</Typography.Text>
                    </Flex>
                </Button>
            </ProCard>

            <ProCard
                key="demo"
                bordered
                hoverable
                bodyStyle={{ padding: '8px 12px' }}
                className={`${styles['bot-card']}`}
                style={{ height: 160 }}
                colSpan={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 6, }}
                actions={(<>
                    <Flex justify="space-between" align="center" className='w-full relative'>
                        <Space className='w-64'>
                            <Avatar size={16} icon={<UserOutlined />} />
                            <Typography.Text type='secondary'>manerfan</Typography.Text>
                        </Space>

                        <Space className=''>
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
                    </Flex>

                </>)}
            >
                <Flex vertical className='w-full h-full'>
                    <Flex justify="flex-start" align="center" gap={8} className='w-full flex-auto'>
                        <Flex vertical justify="center" align="flex-start" className='h-full w-56 flex-auto'>
                            <Flex justify="flex-start" align="center" className='w-full h-1/2 flex-auto'>
                                <Typography.Text ellipsis className=''>DemoDemo</Typography.Text>
                                <Typography.Text className='w-4 pl-2 flex-initial text-green-500'><CheckCircleFilled /></Typography.Text>
                            </Flex>

                            <Typography.Text type='secondary' ellipsis className='h-1/2 w-full'>描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述</Typography.Text>
                        </Flex>
                        <Flex justify="center" align="center" className='h-full aspect-square'>
                            <Avatar shape="square" icon={<RobotOutlined />} className='h-full w-full' />
                        </Flex>
                    </Flex>
                    <Flex justify="flex-start" align="center" className='w-full h-8'>
                        <Typography.Text type='secondary' ellipsis>模式模式模式模式模式模式模式模式模式模式模式模式模式模式</Typography.Text>
                    </Flex>
                </Flex>
            </ProCard>

        </ProCard>

    </>
};

export default Studio;

