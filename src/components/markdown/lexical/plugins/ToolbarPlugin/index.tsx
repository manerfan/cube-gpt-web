/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
} from '@lexical/selection';
import { $isTableNode, $isTableSelection } from '@lexical/table';
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $isEditorIsNestedEditor,
  mergeRegister,
} from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useState } from 'react';

import {
  blockTypeToBlockIcon,
  blockTypeToBlockName,
  useToolbarState,
} from '../../context/ToolbarContext';
import { getSelectedNode } from '../../utils/getSelectedNode';
import { sanitizeUrl } from '../../utils/url';
import { SHORTCUTS } from '../ShortcutsPlugin/shortcuts';
import { InsertTableDialog } from '../TablePlugin';
import {
  clearFormatting,
  formatBulletList,
  formatCheckList,
  formatCode,
  formatHeading,
  formatNumberedList,
  formatParagraph,
  formatQuote,
} from './utils';
import { Button, Divider, Dropdown, Flex, Modal, Popover, Space, Typography } from 'antd';
import { Bold, ChevronDown, Code, Eraser, Italic, Link, Sheet, Sigma, Strikethrough, Underline } from 'lucide-react';
import { InsertEquationDialog } from '../EquationsPlugin';

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
};

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName;
  rootType: keyof typeof rootTypeToRootName;
  editor: LexicalEditor;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Dropdown trigger={['click']} disabled={disabled} overlayClassName='max-h-96 overflow-y-auto' menu={{
      items: [
        {
          key: "PARAGRAPH",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.paragraph}
              <Typography.Text>{blockTypeToBlockName.paragraph}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.NORMAL}</Typography.Text>
          </Flex>),
          onClick: () => formatParagraph(editor),
          style: blockType === 'paragraph' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "HEADING1",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.h1}
              <Typography.Text>{blockTypeToBlockName.h1}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.HEADING1}</Typography.Text>
          </Flex>),
          onClick: () => formatHeading(editor, blockType, 'h1'),
          style: blockType === 'h1' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "HEADING2",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.h2}
              <Typography.Text>{blockTypeToBlockName.h2}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.HEADING2}</Typography.Text>
          </Flex>),
          onClick: () => formatHeading(editor, blockType, 'h2'),
          style: blockType === 'h2' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "HEADING3",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.h3}
              <Typography.Text>{blockTypeToBlockName.h3}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.HEADING3}</Typography.Text>
          </Flex>),
          onClick: () => formatHeading(editor, blockType, 'h3'),
          style: blockType === 'h3' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "BULLET_LIST",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.bullet}
              <Typography.Text>{blockTypeToBlockName.bullet}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.BULLET_LIST}</Typography.Text>
          </Flex>),
          onClick: () => formatBulletList(editor, blockType),
          style: blockType === 'bullet' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "NUMBERED_LIST",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.number}
              <Typography.Text>{blockTypeToBlockName.number}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.NUMBERED_LIST}</Typography.Text>
          </Flex>),
          onClick: () => formatNumberedList(editor, blockType),
          style: blockType === 'number' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "CHECK_LIST",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.check}
              <Typography.Text>{blockTypeToBlockName.check}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.CHECK_LIST}</Typography.Text>
          </Flex>),
          onClick: () => formatCheckList(editor, blockType),
          style: blockType === 'check' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "QUOTE",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.quote}
              <Typography.Text>{blockTypeToBlockName.quote}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.QUOTE}</Typography.Text>
          </Flex>),
          onClick: () => formatQuote(editor, blockType),
          style: blockType === 'quote' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        },
        {
          key: "CODE_BLOCK",
          label: (<Flex justify='space-between' align='center' className='w-48'>
            <Flex justify='space-between' align='center' gap={8}>
              {blockTypeToBlockIcon.code}
              <Typography.Text>{blockTypeToBlockName.code}</Typography.Text>
            </Flex>
            <Typography.Text>{SHORTCUTS.CODE_BLOCK}</Typography.Text>
          </Flex>),
          onClick: () => formatCode(editor, blockType),
          style: blockType === 'code' ? { background: "rgba(0, 0, 0, 0.03)" } : {}
        }
      ]
    }} >
      <Button type='text' size='small' variant='filled' title={blockTypeToBlockName[blockType]} disabled={disabled} className='w-28'>
        <Flex justify='space-between' align='center' className='w-full'>
          <Flex justify='flex-start' align='center' gap={8}>{blockTypeToBlockIcon[blockType]}{blockTypeToBlockName[blockType]}</Flex>
          <ChevronDown size={16} /></Flex>
      </Button>
    </Dropdown>
  );
}

export default function ToolbarPlugin({
  editor,
  activeEditor,
  setActiveEditor,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor;
  activeEditor: LexicalEditor;
  setActiveEditor: Dispatch<LexicalEditor>;
  setIsLinkEditMode: Dispatch<boolean>;
}): JSX.Element {
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null,
  );

  const [modalHook, contextHolder] = Modal.useModal();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const { toolbarState, updateToolbarState } = useToolbarState();

  const [tablePopover, setTablePopover] = useState(false);
  const [equationPopover, setEquationPopover] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      if (activeEditor !== editor && $isEditorIsNestedEditor(activeEditor)) {
        const rootElement = activeEditor.getRootElement();
        updateToolbarState(
          'isImageCaption',
          !!rootElement?.parentElement?.classList.contains(
            'image-caption-container',
          ),
        );
      } else {
        updateToolbarState('isImageCaption', false);
      }

      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      updateToolbarState('isRTL', $isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      const isLink = $isLinkNode(parent) || $isLinkNode(node);
      updateToolbarState('isLink', isLink);

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        updateToolbarState('rootType', 'table');
      } else {
        updateToolbarState('rootType', 'root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();

          updateToolbarState('blockType', type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            updateToolbarState(
              'blockType',
              type as keyof typeof blockTypeToBlockName,
            );
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            updateToolbarState(
              'codeLanguage',
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }
      // Handle buttons
      updateToolbarState(
        'fontColor',
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      updateToolbarState(
        'bgColor',
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      updateToolbarState(
        'fontFamily',
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        );
      }

      // If matchingParent is a valid node, pass it's format type
      updateToolbarState(
        'elementFormat',
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      // Update text format
      updateToolbarState('isBold', selection.hasFormat('bold'));
      updateToolbarState('isItalic', selection.hasFormat('italic'));
      updateToolbarState('isUnderline', selection.hasFormat('underline'));
      updateToolbarState(
        'isStrikethrough',
        selection.hasFormat('strikethrough'),
      );
      updateToolbarState('isSubscript', selection.hasFormat('subscript'));
      updateToolbarState('isSuperscript', selection.hasFormat('superscript'));
      updateToolbarState('isCode', selection.hasFormat('code'));
      updateToolbarState(
        'fontSize',
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
      );
    }
  }, [activeEditor, editor, updateToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar, setActiveEditor]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      $updateToolbar();
    });
  }, [activeEditor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          updateToolbarState('canUndo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          updateToolbarState('canRedo', payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor, updateToolbarState]);

  const insertLink = useCallback(() => {
    if (!toolbarState.isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://'),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, setIsLinkEditMode, toolbarState.isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey],
  );

  const canViewerSeeInsertDropdown = !toolbarState.isImageCaption;
  const canViewerSeeInsertCodeButton = !toolbarState.isImageCaption;

  return (
    <Space size={2} className="toolbar">
      {toolbarState.blockType in blockTypeToBlockName &&
        activeEditor === editor && (
          <>
            <BlockFormatDropDown
              disabled={!isEditable}
              blockType={toolbarState.blockType}
              rootType={toolbarState.rootType}
              editor={activeEditor}
            />
            <Divider type="vertical" />
          </>
        )}
      {toolbarState.blockType === 'code' ? (
        <Dropdown trigger={['click']} disabled={!isEditable} overlayClassName='max-h-96 overflow-y-auto' menu={{
          items: CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
            return {
              key: value,
              label: (<Flex justify='space-between' align='center' className='w-48'>
                <Typography.Text>{name}</Typography.Text>
              </Flex>),
              onClick: () => onCodeLanguageSelect(value),
              style: value === toolbarState.codeLanguage ? { background: "rgba(0, 0, 0, 0.03)" } : {}
            }
          })
        }}>
          <Button type='text' size='small' variant='filled' disabled={!isEditable}>
            <Flex justify='space_between' align='center' gap={8}>{getLanguageFriendlyName(toolbarState.codeLanguage) || '选择语言'}<ChevronDown size={16} /></Flex>
          </Button>
        </Dropdown>
      ) : (
        <>
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`粗体 (${SHORTCUTS.BOLD})`}
            color={toolbarState.isBold ? 'default' : undefined}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }}>
            <Bold size={16} strokeWidth={toolbarState.isBold ? 2.5 : 2} />
          </Button>
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`斜体 (${SHORTCUTS.ITALIC})`}
            color={toolbarState.isItalic ? 'default' : undefined}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }}>
            <Italic size={16} strokeWidth={toolbarState.isItalic ? 2.5 : 2} />
          </Button>
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`下划线 (${SHORTCUTS.UNDERLINE})`}
            color={toolbarState.isUnderline ? 'default' : undefined}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }}>
            <Underline size={16} strokeWidth={toolbarState.isUnderline ? 2.5 : 2} />
          </Button>
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`删除线 (${SHORTCUTS.STRIKETHROUGH})`}
            color={toolbarState.isStrikethrough ? 'default' : undefined}
            onClick={() => {
              activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }}>
            <Strikethrough size={16} strokeWidth={toolbarState.isStrikethrough ? 2.5 : 2} />
          </Button>
          {canViewerSeeInsertCodeButton && (
            <Button
              type='text' size='small' variant='filled'
              disabled={!isEditable}
              title={`行内代码 (${SHORTCUTS.INSERT_CODE_BLOCK})`}
              color={toolbarState.isCode ? 'default' : undefined}
              onClick={() => {
                activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}>
              <Code size={16} strokeWidth={toolbarState.isCode ? 2.5 : 2} />
            </Button>
          )}
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`链接 (${SHORTCUTS.INSERT_LINK})`}
            color={toolbarState.isLink ? 'default' : undefined}
            onClick={insertLink}>
            <Link size={16} strokeWidth={toolbarState.isLink ? 2.5 : 2} />
          </Button>
          <Button
            type='text' size='small' variant='filled'
            disabled={!isEditable}
            title={`清除格式 (${SHORTCUTS.CLEAR_FORMATTING})`}
            onClick={() => clearFormatting(activeEditor)}>
            <Eraser size={16} />
          </Button>

          {canViewerSeeInsertDropdown && (<>
            <Divider type="vertical" />
            <Popover
              content={<InsertTableDialog
                activeEditor={editor}
                onClose={() => { setTablePopover(false) }}
              />}
              style={{ width: 186 }}
              rootClassName='w-48'
              arrow={false}
              placement="topRight"
              title="插入表格"
              trigger="click"
              destroyTooltipOnHide={true}
              open={tablePopover}
              onOpenChange={setTablePopover}
            >
              <Button
                type='text' size='small' variant='filled'
                disabled={!isEditable}
                title={`插入表格`}>
                <Sheet size={16} />
              </Button>
            </Popover>

            <Popover
              content={<InsertEquationDialog
                activeEditor={editor}
                onClose={() => { setEquationPopover(false) }}
              />}
              rootClassName='max-w-1/2 min-w-48'
              arrow={false}
              placement="topRight"
              title="插入公式"
              trigger="click"
              destroyTooltipOnHide={true}
              open={equationPopover}
              onOpenChange={setEquationPopover}
            >
              <Button
                type='text' size='small' variant='filled'
                disabled={!isEditable}
                title={`插入公式`}>
                <Sigma size={16} />
              </Button>
            </Popover>
          </>)}
        </>
      )}

      {contextHolder}
    </Space>
  );
}
