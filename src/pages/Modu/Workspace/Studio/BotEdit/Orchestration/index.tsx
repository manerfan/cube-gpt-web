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

import { useState } from 'react';
import type { BotMode } from '@/services/bot';
import * as botService from '@/services/bot';
import SingleAgent from './SingleAgent';
import MultiAgent from './MultiAgent';

const BotOrchestration: React.FC<{
    workspaceUid: string,
    botUid: string
}> = ({ workspaceUid, botUid }) => {
    const [botMode, setBotMode] = useState<BotMode>(botService.BotMode.SINGLE_AGENT);

    return <div className='w-full grid' style={{ minHeight: 'calc(100vh - 70px)' }}>
        {botMode === botService.BotMode.SINGLE_AGENT && <SingleAgent workspaceUid={workspaceUid} botUid={botUid} />}
        {botMode === botService.BotMode.MULTI_AGENTS && <MultiAgent workspaceUid={workspaceUid} botUid={botUid} />}
    </div>;
}

export default BotOrchestration;