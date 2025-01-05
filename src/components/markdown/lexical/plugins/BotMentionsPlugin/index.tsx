/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { Avatar, Flex, Typography } from 'antd';
import { debounce } from 'lodash';

import { favoriteService } from "@/services";
import { USER_FAVORITE } from '@/services/user/favorite/typings';
import { RobotOutlined } from '@ant-design/icons';

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

class MentionTypeaheadOption extends MenuOption {
  bot: USER_FAVORITE.BotFavoriteEntity;

  constructor(bot: USER_FAVORITE.BotFavoriteEntity) {
    super(bot.name);
    this.bot = bot;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.bot.uid}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      <Flex justify='space-between' align='center' gap={8} className='px-1'>
        <Avatar size={16} icon={<RobotOutlined />} />
        <Typography.Text>{option.bot.name}</Typography.Text>
      </Flex>
    </li>
  );
}

type Option = {
  trigger?: string,
  onSelect?: (botFavorite: USER_FAVORITE.BotFavoriteEntity) => void;
};

export default function BotMentionsPlugin({
  trigger = '@',
  onSelect
}: Option): JSX.Element | null {
  // 编辑器
  const [editor] = useLexicalComposerContext();

  // 关键词
  const [queryString, setQueryString] = useState<string>('');

  const typeaheadRef = useRef<HTMLDivElement | null>(null);

  // 注册触发器
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(trigger, {
    minLength: 0,
  });

  const [bots, setBots] = useState<USER_FAVORITE.BotFavoriteEntity[]>([]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      favoriteService.findFavoriteBots({ keyword: query }, SUGGESTION_LIST_LENGTH_LIMIT).then((resp) => {
        const favoriteEntities = resp.content || [];
        setBots(favoriteEntities);
      });
    }, 200),
    [] // 空依赖数组，确保函数只创建一次
  );
  useEffect(() => {
    debouncedSearch(queryString);
    return () => {
      debouncedSearch.cancel();
    };
  }, [queryString, debouncedSearch]);

  // popover中的选项
  const options = useMemo(
    () => bots.map(
      (bot) =>
        new MentionTypeaheadOption(bot),
    ).slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [bots],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        onSelect?.(selectedOption.bot);
        closeMenu();
      });
    },
    [editor],
  );

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const debouncedHandleResize = debounce(() => {
    setWindowHeight(window.innerHeight);
    if (!typeaheadRef?.current) {
      return;
    }

    const typeaheadElRect = typeaheadRef.current.getBoundingClientRect();
    const topOverflow = typeaheadElRect.top < 0;
    const bottomOverflow = typeaheadElRect.bottom > windowHeight;
    const leftOverflow = typeaheadElRect.left < 0;
    const rightOverflow = typeaheadElRect.right > window.innerWidth;

    if (bottomOverflow) {
      // 超出了屏幕底部
      if (typeaheadElRect.top - typeaheadElRect.height - 40 > 0) {
        // 判断将它移动到上方是否会超出屏幕顶部，只有在不超出的情况下才移动
        typeaheadRef.current.style.top = `-${typeaheadElRect.height + 40}px`;
      }
    }

    if (topOverflow) {
      // 超出了屏幕顶部，无脑移动到下方
      typeaheadRef.current.style.top = `0px`;
    }

    if (leftOverflow) {
      // 超出了屏幕左侧，移动到贴近左侧
      typeaheadRef.current.style.left = '0px';
    }
    if (rightOverflow && typeaheadElRect.left < 0) {
      // 超出了屏幕右侧，移动到贴近左侧
      typeaheadRef.current.style.left = '0px';
    }
  }, 200);

  useEffect(() => {
    debouncedHandleResize();
    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [typeaheadRef, windowHeight, editor, queryString]);
  debouncedHandleResize();

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={(matchingString) => setQueryString(matchingString || '')}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
            <div className='lexical'>
              <div className="typeahead-popover mentions-menu" ref={typeaheadRef}>
                <ul>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.bot.uid}
                      option={option}
                    />
                  ))}
                </ul>
              </div>
            </div>,
            anchorElementRef.current,
          )
          : null
      }
    />
  );
}
