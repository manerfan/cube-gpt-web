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

import { MESSAGE } from "@/services/message/typings";
import { CSSProperties, memo } from "react";
import styles from './styles.module.scss';
import { Avatar, Card, Flex, Tag, Typography } from "antd";
import _ from 'lodash';

const ChatReferCards: React.FC<{
  referCards: MESSAGE.ReferCard[];
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = memo(({ referCards, className, style }) => {
  return (
    <>
      <div className={`max-w-full overflow-auto p-2 ${className} ${styles['refer-cards']}`} style={style}>
        <Flex justify="flex-start" align="center" gap={8} className="shrink inline-flex" >
          {_.map(referCards, (referCard) => (
            <Card className="cursor-pointer w-72 h-28 transition-all hover:-translate-y-1 hover:origin-bottom hover:-rotate-1 hover:shadow-md hover:shadow-indigo-400/30" classNames={{ body: 'w-full h-full !p-3' }} onClick={() => {
              window.open(referCard.url, '_blank')
            }}>
              <Flex vertical justify="space-between" align="flex-start" className="w-full h-full">
                <Flex justify="flex-start" align="center" gap={4} className="w-full">
                  <Tag className="m-0 rounded-xl h-4 px-1" style={{ lineHeight: "14px" }} color="rgb(156 163 175)" >{referCard.index}</Tag>
                  <Typography.Text strong ellipsis className="flex-auto">{referCard.title}</Typography.Text>
                </Flex>
                <Flex justify="flex-start" align="center" gap={4} className="w-full py-2">
                  <Typography.Text type="secondary" className="text-xs line-clamp-2 flex-auto">{referCard.description || referCard.title}</Typography.Text>
                </Flex>
                <Flex justify="flex-start" align="flex-start" gap={4} className="w-full">
                  {!!referCard.icon && <Avatar shape='square' size={16} className="w-4 h-4" src={referCard.icon}>{referCard.name?.[0]}</Avatar>}
                  {!!referCard.name && <Typography.Text type="secondary" ellipsis className="text-xs flex-auto">{referCard.name}</Typography.Text>}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      </div>
    </>
  );
});

export default ChatReferCards;