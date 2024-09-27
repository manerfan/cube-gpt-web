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

import ChatContent from '@/components/chat';
import ChatConversationList from '@/components/chat/chat-conversation-list';
import { workspaceService } from '@/services';
import { WorkspaceType } from '@/services/workspace';
import { Drawer, FloatButton } from 'antd';
import _ from 'lodash';
import { Bot, MessageCirclePlus, MessageSquareText, Wand } from 'lucide-react';
import { useEffect, useState } from 'react';

const Chat: React.FC = () => {
  const [openSlider, setOpenSlider] = useState(false);

  const [workspaceUid, setWorkspaceUid] = useState<string>();
  const [conversationUid, setConversationUid] = useState<string | undefined>();

  useEffect(() => {
    // 查询空间列表
    workspaceService.list().then((resp) => {
      const workspaces = resp.content;

      // 私有空间
      const privateSpace = _.head(
        _.filter(
          workspaces,
          (workspace) => workspace.type === WorkspaceType.PRIVATE,
        ),
      );
      setWorkspaceUid(privateSpace?.uid);
    });

    // 查询最新的一次会话
    // messageService.latestConversation().then((resp) => {
    //   const conversation = resp.content;
    //   setConversationUid(conversation?.conversationUid);
    // });
  }, []);

  return (
    <>
      <ChatContent
        workspaceUid={workspaceUid}
        conversationUid={conversationUid}
        className={`h-full max-h-full max-h-screen transition-[padding] ${openSlider ? 'pr-96' : 'pr-0'}`}
      />

      <FloatButton.Group
        trigger="click"
        type="primary"
        icon={<Wand size={18} />}
        className="bottom-48 lg:bottom-16"
      >
        <FloatButton
          icon={<MessageCirclePlus size={18} />}
          tooltip="发起新会话"
          onClick={() => setConversationUid(undefined)}
        />
        <FloatButton
          icon={<MessageSquareText size={18} />}
          tooltip="历史会话"
          onClick={() => setOpenSlider(true)}
        />
        <FloatButton icon={<Bot size={18} />} tooltip="Bot收藏" />
      </FloatButton.Group>

      <Drawer
        title="历史会话"
        classNames={{
          mask: '!bg-transparent',
        }}
        width={512}
        onClose={() => setOpenSlider(false)}
        destroyOnClose
        open={openSlider}
      >
        <ChatConversationList
          onConversationSelected={(_conversationUid) => {
            setConversationUid(_conversationUid);
            setOpenSlider(false);
          }}
          onConversationDeleted={(_conversationUid) => {
            if ("ALL" === _conversationUid || conversationUid === _conversationUid) {
              setConversationUid(undefined);
            }
            setOpenSlider(false);
          }}
        />
      </Drawer>
    </>
  );
};

export default Chat;
