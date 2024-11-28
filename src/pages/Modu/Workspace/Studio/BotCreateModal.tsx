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

import { BOT } from '@/services/bot/typings';
import { EditOutlined, RobotOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Avatar, Space, Button, Tooltip, Divider, Typography, message } from 'antd';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import styles from './styles.module.scss';
import * as botService from '@/services/bot';

const BotCreateModal: React.FC<{
    open: boolean,
    onCreate?: (bot: BOT.BotAddCmd) => void,
    onCancel?: () => void,
    workspaceUid: string,
}> = ({ open, onCreate, onCancel, workspaceUid }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        form.submit();
    };

    const onSubmit = async (addCmd: BOT.BotAddCmd) => {
        setLoading(true);
        botService.add(workspaceUid, addCmd).then((resp) => {
            onCreate?.(resp.content);
            message.success(`创建智能体成功`);
        }).finally(() => setLoading(false));
    };

    return <Modal
        title="创建智能体"
        open={open}
        onOk={submit}
        confirmLoading={loading}
        onCancel={onCancel}
        destroyOnClose
    >
        <Form
            layout="vertical"
            form={form}
            className='mt-5 mb-10'
            onFinish={onSubmit}
        >
            <Form.Item<BOT.BotAddCmd>
                label="智能体名称" name="name" className='font-bold'
                rules={[{ required: true, message: '请给智能体起一个独一无二的名字吧' }]}>
                <Input showCount maxLength={20} placeholder="给智能体起一个独一无二的名字" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="智能体功能介绍" name="description" className='font-bold'>
                <Input.TextArea showCount maxLength={500} autoSize={{ minRows: 4, maxRows: 6 }} placeholder="介绍智能体的功能，将会展示给智能体的用户" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="图标" name="avatar">
                <Space align='end' split={<Divider type="vertical" />}>
                    <div className={`w-16 h-16 ${styles['avatar-upload']}`}>
                        <Avatar shape="square" className='h-full w-full' icon={<RobotOutlined />} />
                        <Button size="small" color="default" variant="filled" className={`w-full h-full ${styles['avatar-upload-btn']}`} >
                            <Typography.Text strong className="font-bold text-2xl text-slate-50"><EditOutlined /></Typography.Text>
                        </Button>
                    </div>

                    <Tooltip title="输入智能体名称和介绍后，点击自动生成头像">
                        <Button
                            size="small"
                            color="default"
                            variant="filled"
                            disabled
                            className='border-none'
                        >
                            <Sparkles size={18} />
                        </Button>
                    </Tooltip>

                    <Typography.Text type='secondary'>图标功能敬请期待 (✧∀✧)</Typography.Text>
                </Space>
            </Form.Item>
        </Form>
    </Modal>
};

export default BotCreateModal;

