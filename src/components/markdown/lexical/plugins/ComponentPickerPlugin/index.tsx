/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  TextNode,
} from 'lexical';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { InsertEquationDialog } from '../EquationsPlugin';
import { InsertTableDialog } from '../TablePlugin';
import { blockTypeToBlockIcon, blockTypeToBlockName } from '../../context/ToolbarContext';
import { Flex, Typography, Modal } from 'antd';
import { HookAPI } from 'antd/es/modal/useModal';
import { Sheet, Sigma } from 'lucide-react';
import { debounce } from 'lodash';

export class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  label?: ReactNode;
  // Icon for display
  icon?: ReactNode;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      label?: ReactNode;
      icon?: ReactNode;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    },
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.label = options.label;
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
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
  option: ComponentPickerOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      <Flex justify='space-between' align='center' gap={8} className='px-1'>
        {option.icon}
        <Typography.Text>{option.label || option.title}</Typography.Text>
      </Flex>
    </li>
  );
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (!queryString) {
    return options;
  }

  const tableMatch = queryString.match(/^(?:table)([1-9])(?:x([1-9])?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: blockTypeToBlockIcon.table,
            keywords: ['table'],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          }),
      ),
    );
  }

  return options;
}

function getBaseOptions(editor: LexicalEditor, modal: HookAPI) {
  return [
    new ComponentPickerOption(blockTypeToBlockName.paragraph, {
      icon: blockTypeToBlockIcon.paragraph,
      keywords: ['normal', 'paragraph', 'p', 'text', 'zhengwen', '正文'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.h1, {
      icon: blockTypeToBlockIcon.h1,
      keywords: ['heading', 'header', `h1`, 'biaoti', '标题'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(`h1`));
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.h2, {
      icon: blockTypeToBlockIcon.h2,
      keywords: ['heading', 'header', `h2`, 'biaoti', '标题'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(`h2`));
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.h3, {
      icon: blockTypeToBlockIcon.h3,
      keywords: ['heading', 'header', `h3`, 'biaoti', '标题'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(`h3`));
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.bullet, {
      icon: blockTypeToBlockIcon.bullet,
      keywords: ['bulleted list', 'unordered list', 'ul', 'wuxu', '无序', 'liebiao', '列表'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(blockTypeToBlockName.number, {
      icon: blockTypeToBlockIcon.number,
      keywords: ['numbered list', 'ordered list', 'ol', 'youxu', '有序', 'liebiao', '列表'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(blockTypeToBlockName.check, {
      icon: blockTypeToBlockIcon.check,
      keywords: ['check list', 'todo list', 'daiban', '待办', 'liebiao', '列表'],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption(blockTypeToBlockName.quote, {
      icon: blockTypeToBlockIcon.quote,
      keywords: ['block quote', 'yinyong', '引用'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.code, {
      icon: blockTypeToBlockIcon.code,
      keywords: ['java', 'python', 'javascript', 'js', 'typescript', 'ts', 'codeblock', 'daima', '代码'],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              // Will this ever happen?
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),
    new ComponentPickerOption(blockTypeToBlockName.table, {
      icon: blockTypeToBlockIcon.table,
      keywords: ['table', 'grid', 'spreadsheet', 'rows', 'columns', 'biaoge', '表格'],
      onSelect: () => {
        const m = modal.confirm({
          title: '插入表格',
          icon: <Sheet size={16} style={{ marginTop: 4, marginRight: 4 }} />,
          width: 240,
          cancelButtonProps: { style: { display: 'none' } },
          okButtonProps: { style: { display: 'none' } },
          maskClosable: true,
          content: <InsertTableDialog activeEditor={editor} onClose={() => m.destroy()} />
        })
      },
    }),
    new ComponentPickerOption(blockTypeToBlockName.equation, {
      icon: blockTypeToBlockIcon.equation,
      keywords: ['equation', 'latex', 'math', 'gongshi', '公式'],
      onSelect: () => {
        const m = modal.confirm({
          title: '插入公式',
          icon: <Sigma size={16} style={{ marginTop: 4, marginRight: 4 }} />,
          cancelButtonProps: { style: { display: 'none' } },
          okButtonProps: { style: { display: 'none' } },
          maskClosable: true,
          content: <InsertEquationDialog activeEditor={editor} onClose={() => m.destroy()} />
        })
      },
    }),
  ];
}

type Option = {
  trigger?: string,
  showBaseOptions?: boolean,
};

export default function ComponentPickerMenuPlugin({
  trigger = '/',
  showBaseOptions = true
}: Option): JSX.Element {
  // 编辑器
  const [editor] = useLexicalComposerContext();

  // 关键词
  const [queryString, setQueryString] = useState<string | null>(null);

  const typeaheadRef = useRef<HTMLDivElement | null>(null);

  const [modal, contextHolder] = Modal.useModal();

  // 注册触发器
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(trigger, {
    minLength: 0,
  });

  // popover中的选项
  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, modal);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, 'i');

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword)),
      ),
    ];
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
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
    <>
      {contextHolder}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
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
                <div className="typeahead-popover component-picker-menu" ref={typeaheadRef}>
                  <ul>
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
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
    </>
  );
}
