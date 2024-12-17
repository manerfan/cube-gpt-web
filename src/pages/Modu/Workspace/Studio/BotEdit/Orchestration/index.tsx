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

import { useEffect, useState } from 'react';
import type { BotMode } from '@/services/bot';
import * as botService from '@/services/bot';
import SingleAgent from './SingleAgent';
import MultiAgent from './MultiAgent';
import { WORKSPACE } from '@/services/workspace/typings';
import { BOT } from '@/services/bot/typings';
import { eventBus } from '@/services';

const BotOrchestration: React.FC<{
    workspace: WORKSPACE.WorkspaceEntity,
    bot: BOT.BotEntity
}> = ({ workspace, bot }) => {
    const [botMode, setBotMode] = useState<BotMode>(bot.mode as BotMode.SINGLE_AGENT);

    useEffect(() => {
        const handleBotModeEvent = (mode: BotMode) => {
            setBotMode(mode);
        }
        eventBus.addListener('modu.bot.mode', handleBotModeEvent);
        return () => {
            eventBus.removeListener('modu.bot.mode', handleBotModeEvent);
        }
    }, [workspace, bot]);

    return <div className='w-full grid overflow-hidden' style={{ height: 'calc(100dvh - 70px)' }}>
        {botMode === botService.BotMode.SINGLE_AGENT && <SingleAgent workspace={workspace} bot={bot} />}
        {botMode === botService.BotMode.MULTI_AGENTS && <MultiAgent workspace={workspace} bot={bot} />}
    </div>;
}

export default BotOrchestration;