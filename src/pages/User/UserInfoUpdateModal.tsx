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
import { Input, Modal, Form, Avatar, Space, Button, Tooltip, Divider, Typography, Upload, message } from 'antd';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import styles from './styles.module.scss';
import { userService } from '@/services';
import ImgCrop from 'antd-img-crop';
import { fileService } from '@/services';
import { FILE } from '@/services/file/typings';
import { USER } from '@/services/user/typings';
import { useModel } from '@umijs/max';

const UserInfoUpdateModal: React.FC<{
    open: boolean,
    onUpdate?: (bot: USER.UserEntity) => void,
    onCancel?: () => void,
}> = ({ open, onUpdate, onCancel }) => {
    const { initialState, refresh, setInitialState } = useModel('@@initialState');

    const [form] = Form.useForm();
    const [submitLoading, setSubmitLoading] = useState(false);

    const [avatar, setAvatar] = useState<FILE.SimpleFile | undefined>(() => {
        const user = initialState?.userMe
        if (!!user && !!user.avatar) {
            return {
                file_key: user.avatar,
                file_url: user.avatar_url || ''
            }
        }
        return undefined;
    });
    const [avatarUploading, setAvatarUploading] = useState(false);

    const submit = async () => {
        form.submit();
    };

    const onSubmit = async (base_info: USER.UserBaseInfo) => {
        setSubmitLoading(true);
        base_info.avatar = avatar?.file_key;
        userService.update(base_info).then((resp) => {
            const user = resp.content;
            setInitialState({
                ...initialState,
                userMe: user
            });
            refresh();
            onUpdate?.(user);
            message.success(`修改成功`);
        }).finally(() => setSubmitLoading(false));
    }

    return <Modal
        title="编辑个人信息"
        open={open}
        onOk={submit}
        confirmLoading={submitLoading}
        onCancel={onCancel}
        destroyOnClose={true}
        afterOpenChange={(open) => {
            if (!open) {
                form.resetFields()
            } else if (!!initialState?.userMe) {
                form.setFieldsValue({
                    name: initialState?.userMe?.name,
                    description: initialState?.userMe?.description,
                    avatar: initialState?.userMe?.avatar
                });
                if (!!initialState?.userMe.avatar) {
                    setAvatar({
                        file_key: initialState?.userMe.avatar,
                        file_url: initialState?.userMe.avatar_url || ''
                    });
                } else {
                    setAvatar(undefined);
                }
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
                label="用户名" name="name" className='font-bold'
                rules={[{ required: true, message: '请给自己起一个独一无二的名字吧' }]}>
                <Input defaultValue={initialState?.userMe?.name} showCount maxLength={20} placeholder="给自己起一个独一无二的名字" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="自我介绍" name="description" className='font-bold'>
                <Input.TextArea defaultValue={initialState?.userMe?.description} showCount maxLength={500} autoSize={{ minRows: 4, maxRows: 6 }} placeholder="介绍一下自己，让大家更好的了解你" />
            </Form.Item>
            <Form.Item<BOT.BotAddCmd>
                label="头像" name="avatar">
                <Space align='end' split={<Divider type="vertical" />}>
                    <ImgCrop rotationSlider quality={0.5} aspect={1} modalTitle='裁剪'>
                        <Upload
                            name='file'
                            action="/api/file/upload"
                            accept='.jpg,.jpeg,.png,.bmp'
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

                    <Tooltip title="自动生成头像 [暂未开放]">
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

export default UserInfoUpdateModal;
