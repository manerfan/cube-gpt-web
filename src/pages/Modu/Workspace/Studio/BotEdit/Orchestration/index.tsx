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

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { BotMode } from '@/services/bot';
import * as botService from '@/services/bot';
import SingleAgent from './SingleAgent';
import MultiAgent from './MultiAgent';
import { WORKSPACE } from '@/services/workspace/typings';
import { BOT } from '@/services/bot/typings';
import { eventBus } from '@/services';
import _ from 'lodash';
import hash from 'object-hash';
import { Spin } from 'antd';

export interface AgentRefProperty {
    getAgentConfigAndCheck: () => Record<string, any> | null;
}

export interface BotRefProperty {
    getBotConfigAndCheck: () => { mode: BotMode, config: Record<string, any> } | null;
    refreshBotConfig: (publishUid?: string) => void;
}

const BotOrchestration = forwardRef<BotRefProperty, {
    workspace: WORKSPACE.WorkspaceEntity,
    bot: BOT.BotEntity
}>(({ workspace, bot }, ref) => {
    const [botMode, setBotMode] = useState<BotMode>(bot.mode as BotMode.SINGLE_AGENT);
    const [botConfig, setBotConfig] = useState<Record<string, any>>();
    const agentRef = useRef<AgentRefProperty>(null);

    const [refreshLoading, setRefreshLoading] = useState(false);
    const refreshBotConfig = (publishUid?: string) => {
        setRefreshLoading(true);
        botService.getConfigDraft(workspace.uid, bot.uid, publishUid).then((res) => {
            if (!!res.content?.config) {
                setBotMode(res.content.config.mode as BotMode);
                setBotConfig(res.content.config.config);
            }
        }).finally(() => setRefreshLoading(false));
    };

    useImperativeHandle(ref, () => ({
        getBotConfigAndCheck: () => {
            const agentConfig = agentRef.current?.getAgentConfigAndCheck() || {};
            if (_.isEmpty(agentConfig)) return null;
            return { config: agentConfig, mode: botMode };
        },
        refreshBotConfig
    }));

    // 监听 bot mode 的变化
    useEffect(() => {
        const handleBotModeEvent = (mode: BotMode) => {
            setBotMode(mode);
        }
        eventBus.addListener('modu.bot.mode', handleBotModeEvent);
        return () => {
            eventBus.removeListener('modu.bot.mode', handleBotModeEvent);
        }
    }, [workspace, bot]);

    // 刷新 bot config
    useEffect(() => refreshBotConfig(), [workspace, bot]);

    return <>
        <div className='w-full grid overflow-hidden' style={{ height: 'calc(100dvh - 70px)' }}>
            {botMode === botService.BotMode.SINGLE_AGENT && (
                <SingleAgent
                    key={hash(botConfig || {})}
                    ref={agentRef}
                    workspace={workspace}
                    bot={bot}
                    botConfig={botConfig}
                />
            )}
            {botMode === botService.BotMode.MULTI_AGENTS && (
                <MultiAgent
                    key={hash(botConfig || {})}
                    ref={agentRef}
                    workspace={workspace}
                    bot={bot}
                    botConfig={botConfig}
                />
            )}
        </div>

        <Spin spinning={refreshLoading} fullscreen rootClassName='ant-spin-bg-transparent' />
    </>;
});

export default BotOrchestration;