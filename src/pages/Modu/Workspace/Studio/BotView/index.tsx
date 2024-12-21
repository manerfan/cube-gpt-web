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

import { botService, eventBus, workspaceService } from '@/services';
import { BOT } from '@/services/bot/typings';
import { WORKSPACE } from '@/services/workspace/typings';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';

const BotView: React.FC = () => {
    const param = useParams();

    const [workspace, setWorkspace] = useState<WORKSPACE.WorkspaceEntity>();
    const [bot, setBot] = useState<BOT.BotEntity>();

    useEffect(() => {
        workspaceService.detail(param.spaceId!).then((res) => {
            const space = res.content;
            setWorkspace(space);
        });

        botService.detail(param.spaceId!, param.botUid!).then((res) => {
            const bot = res.content;
            setBot(bot);
        });

        // 发送折叠菜单的事件 see ModuWrapper
        eventBus.emit('modu.menu.collapsed', true);
        window.setTimeout(() => eventBus.emit('modu.menu.collapsed', true), 500);
    }, [param.spaceId, param.botUid]);
    return <>BotView</>
}

export default BotView;
