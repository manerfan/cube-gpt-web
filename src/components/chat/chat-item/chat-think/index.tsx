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

import { CSSProperties, useState } from "react";
import styles from './styles.module.scss';

import { Collapse, Typography } from 'antd';
import { Sparkles } from "lucide-react";
import ChatMarkdown from "../chat-markdown";

const ChatReferCards: React.FC<{
    content?: string;
    isFinished?: boolean;
    className?: string | undefined;
    style?: CSSProperties | undefined;
}> = ({ content, isFinished = true, className, style }) => {
    const [finished] = useState(isFinished);
    return (
        <>
            <div className={`w-full mb-4 ${className} ${styles['think']}`} style={style}>
                <Collapse className="w-full" items={[
                    {
                        key: 'thinking',
                        label: <Typography.Text><Sparkles size={12} /> {isFinished ? '已深度思考' : '思考中...'} </Typography.Text>,
                        children: <ChatMarkdown className="text-gray-400">{content}</ChatMarkdown>
                    },
                ]} bordered={false} defaultActiveKey={finished ? [] : ['thinking']} />
            </div>
        </>
    )
}

export default ChatReferCards;