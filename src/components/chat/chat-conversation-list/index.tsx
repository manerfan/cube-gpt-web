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

import { messageService } from '@/services';
import { CONVERSATION } from '@/services/message/typings';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Flex,
  Input,
  List,
  Popconfirm,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import { CopyX, MessageCircle, Save, X } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

const ChatConversationList: React.FC<{
  onConversationSelected?: (conversationUid: string) => void;
  onConversationDeleted?: (conversationUid: string) => void;
}> = ({ onConversationSelected, onConversationDeleted }) => {
  const [conversations, setConversations] = useState<
    CONVERSATION.Conversation[]
  >([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const [operating, setOperating] = useState<boolean>(false);
  const [editConversation, setEditConversation] =
    useState<CONVERSATION.Conversation>();

  const timeDisplay = (givenTimestamp: number) => {
    const givenMoment = moment(givenTimestamp);
    const nowMoment = moment();
    const diffMonths = nowMoment.diff(givenMoment, 'months');
    return diffMonths > 3
      ? givenMoment.format('MM月DD')
      : givenMoment.fromNow();
  };

  // 加载更多会话
  const loadMore = () => {
    const lastConversationUid = _.last(conversations)?.conversationUid;
    setLoading(true);
    messageService
      .conversations(lastConversationUid, 20)
      .then((resp) => {
        if (_.isEmpty(resp.content)) {
          setHasMore(false);
          return;
        }

        const newConversations = _.cloneDeep(conversations) || [];
        newConversations.push(...resp.content);
        setConversations(newConversations);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <>
      <Flex justify="flex-start" align="center" gap="small">
        <Input.Search
          disabled
          loading={loading}
          size="small"
          className="flex-auto"
        />
        <Tooltip title="删除所有会话">
          <Popconfirm
            title="删除所有会话?"
            description="确认要删除所有会话？"
            okText="确定要删"
            cancelText="再想想"
            okType='danger'
            onConfirm={() => {
              setOperating(true);
              return messageService
                .deleteAllConversations()
                .then(() => {
                  setConversations([]);
                  setEditConversation(undefined);
                  onConversationDeleted?.("ALL");
                })
                .finally(() => setOperating(false));
            }}
          >
            <Button
              size="small"
              color="danger"
              variant="filled"
              icon={<CopyX size={16} color="rgb(249 115 22)" />}
            />
          </Popconfirm>
        </Tooltip>
      </Flex>

      <List
        className="mt-5"
        itemLayout="horizontal"
        bordered={false}
        dataSource={conversations}
        renderItem={(conversation) => (
          <List.Item
            key={conversation.conversationUid}
            style={{ borderColor: 'rgba(0,0,0,0.05)' }}
            className={`cursor-pointer ${styles['conversation-item']}`}
            onClick={() => onConversationSelected?.(conversation.conversationUid)}
          >
            <Flex
              justify="flex-start"
              align="center"
              gap="small"
              className="w-full"
            >
              {conversation.conversationUid === editConversation?.conversationUid ? (
                <Space.Compact
                  size="small"
                  className="flex-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    variant="filled"
                    defaultValue={conversation.name}
                    onChange={(e) => setEditConversation({ ...editConversation, ...{ name: e.target.value } })}
                  />
                  <Button
                    color="default"
                    variant="filled"
                    icon={<Save size={16} />}
                    loading={operating}
                    onClick={() => {
                      setOperating(true);
                      messageService.renameConversation(conversation.conversationUid, editConversation?.name)
                        .then(() => {
                          const newConversations = _.cloneDeep(conversations);
                          const renameConversation = _.find(newConversations, (item) => item.conversationUid === editConversation.conversationUid);
                          if (!!renameConversation) {
                            renameConversation.name = editConversation.name;
                          }
                          setConversations(newConversations);
                          setEditConversation(undefined);
                        })
                        .finally(() => {
                          setOperating(false);
                        });
                    }}
                  />
                </Space.Compact>
              ) : (
                <Typography.Text ellipsis className="flex-auto">
                  <MessageCircle size={16} className="mr-2 pt-1" />
                  {conversation.name}
                </Typography.Text>
              )}

              <div className="w-24">
                {/* 时间 */}
                <Typography.Text
                  type="secondary"
                  className={`w-full inline-block text-right ${styles['conversation-time']}`}
                >
                  {timeDisplay(conversation.createdAt)}
                </Typography.Text>

                {/* 操作 */}
                <Space
                  align="end"
                  size="small"
                  className={`h-full flex-row-reverse ${styles['conversation-operator']}`}
                >
                  {/* 删除会话 */}
                  <Popconfirm
                    title="删除该会话?"
                    description={conversation.name}
                    okText="确定要删"
                    cancelText="再想想"
                    okType='danger'
                    onConfirm={(e) => {
                      e.stopPropagation();

                      setOperating(true);
                      return messageService
                        .deleteConversation(conversation.conversationUid)
                        .then(() => {
                          const newConversations = _.filter(conversations, item => item.conversationUid !== conversation.conversationUid);
                          setConversations(newConversations);
                          setEditConversation(undefined);
                          onConversationDeleted?.(conversation.conversationUid);
                        })
                        .finally(() => setOperating(false));
                    }}
                    onCancel={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      loading={operating}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Popconfirm>

                  {/* 会话重命名 */}
                  <Button
                    type="text"
                    size="small"
                    icon={
                      conversation.conversationUid ===
                        editConversation?.conversationUid ? (
                        <X size={16} />
                      ) : (
                        <EditOutlined />
                      )
                    }
                    loading={operating}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditConversation(
                        conversation.conversationUid ===
                          editConversation?.conversationUid
                          ? undefined
                          : conversation,
                      );
                    }}
                  />
                </Space>
              </div>
            </Flex>
          </List.Item>
        )}
        loadMore={
          hasMore && (
            <Flex justify="center" align="center" className="w-full mt-10">
              <Button color="default" variant="filled" size="small" loading={loading} onClick={loadMore}>
                <Typography.Text type="secondary">加载更多</Typography.Text>
              </Button>
            </Flex>
          )
        }
      />

      {loading && <Space direction='vertical' className='w-full'>
        {_.times(2, (i) => <Space key={`skeleton-${i}`} className={`${styles['skeleton-list']}`}>
          <Skeleton.Avatar active size='small' />
          <Skeleton.Input active size='small' className={`${styles['skeleton-item']}`} />
          <Skeleton.Button active size='small' />
        </Space>)}
      </Space>}
      {!loading && !hasMore && (
        <Divider>
          <Typography.Text type="secondary" className="text-xs">
            没有更多会话
          </Typography.Text>
        </Divider>
      )}
    </>
  );
};

export default ChatConversationList;
