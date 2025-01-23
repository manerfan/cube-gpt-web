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
import { EditOutlined, LoadingOutlined, RobotOutlined } from '@ant-design/icons';
import { Input, Modal, Form, Avatar, Space, Button, Tooltip, Divider, Typography, message, Upload } from 'antd';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import styles from './styles.module.scss';
import * as botService from '@/services/bot';
import ImgCrop from 'antd-img-crop';
import { fileService } from '@/services';
import { FILE } from '@/services/file/typings';

const BotUpdateModal: React.FC<{
    open: boolean,
    onUpdate?: (bot: BOT.BotEntity) => void,
    onCancel?: () => void,
    workspaceUid: string,
    modalMode: 'create' | 'edit',
    bot?: BOT.BotEntity,
}> = ({ open, onUpdate, onCancel, workspaceUid, modalMode = 'create', bot }) => {
    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);

    const [avatar, setAvatar] = useState<FILE.SimpleFile>();
    const [avatarUploading, setAvatarUploading] = useState(false);
    const submit = async () => {
        form.submit();
    };

    const onSubmit = async (addCmd: BOT.BotAddCmd) => {
        setSubmitLoading(true);
        addCmd.avatar = avatar?.file_key;
        if (modalMode === 'create') {
            botService.add(workspaceUid, addCmd).then((resp) => {
                onUpdate?.(resp.content);
                message.success(`创建智能体成功`);
            }).finally(() => setSubmitLoading(false));
        } else {
            botService.update(workspaceUid, bot!.uid, addCmd).then((resp) => {
                onUpdate?.(resp.content);
                message.success(`修改智能体成功`);
            }).finally(() => setSubmitLoading(false));
        }
    };

    return <Modal
        title={modalMode === 'create' ? "创建智能体" : "编辑智能体"}
        open={open}
        onOk={submit}
        confirmLoading={submitLoading}
        onCancel={onCancel}
        destroyOnClose={true}
        afterOpenChange={(open) => {
            if (!open) {
                form.resetFields()
            } else if (!!bot) {
                form.setFieldsValue({
                    name: bot?.name,
                    description: bot?.description,
                    avatar: bot?.avatar
                })
            };
        }}
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
                <Input defaultValue={bot?.name} showCount maxLength={20} placeholder="给智能体起一个独一无二的名字" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="智能体功能介绍" name="description" className='font-bold'>
                <Input.TextArea defaultValue={bot?.description} showCount maxLength={500} autoSize={{ minRows: 4, maxRows: 6 }} placeholder="介绍智能体的功能，将会展示给智能体的用户" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="图标" name="avatar">
                <Space align='end' split={<Divider type="vertical" />}>
                    <ImgCrop rotationSlider quality={0.5} aspect={1} modalTitle='裁剪'>
                        <Upload
                            name='file'
                            action="/api/file/upload"
                            accept='image/*'
                            listType="picture-card"
                            multiple={false}
                            maxCount={1}
                            showUploadList={false}
                            className='ant-upload-16'
                            customRequest={({ file, onSuccess, onError }) => {
                                setAvatarUploading(true);
                                fileService.upload(file as File)
                                    .then((res) => {
                                        if (res.success && onSuccess) {
                                            const file_info = res.content;
                                            setAvatar(file_info);
                                            onSuccess(file_info.file_url);
                                        }
                                    })
                                    .catch((err) => {
                                        if (onError) {
                                            onError(err);
                                        }
                                    })
                                    .finally(() => setAvatarUploading(false));
                            }}
                        >
                            <div className={`${styles['avatar-upload']}`}>
                                <Avatar shape="square" className='h-full w-full' icon={<RobotOutlined className='w-16 h-16 justify-center text-gray-200 text-[32px]' />} src={avatar?.file_url} />
                                <Button size="small" color="default" variant="filled" className={`w-full h-full ${styles['avatar-upload-btn']}`} >
                                    <Typography.Text strong className="font-bold text-2xl text-slate-50"><EditOutlined /></Typography.Text>
                                </Button>
                                {avatarUploading && <div className={`${styles['avatar-upload-loading']}`}>
                                    <LoadingOutlined />
                                </div>}
                            </div>

                        </Upload>
                    </ImgCrop>

                    <Tooltip title="输入智能体名称和介绍后，点击自动生成头像 [暂未开放]">
                        <Button
                            size="small"
                            color="default"
                            variant="filled"
                            className='border-none'
                        >
                            <Sparkles size={18} />
                        </Button>
                    </Tooltip>
                </Space>
            </Form.Item>
        </Form>
    </Modal>
};

export default BotUpdateModal;

