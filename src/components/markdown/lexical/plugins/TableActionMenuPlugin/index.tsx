/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalEditable } from '@lexical/react/useLexicalEditable';
import {
  $deleteTableColumn__EXPERIMENTAL,
  $deleteTableRow__EXPERIMENTAL,
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $insertTableColumn__EXPERIMENTAL,
  $insertTableRow__EXPERIMENTAL,
  $isTableCellNode,
  $isTableSelection,
  getTableElement,
  getTableObserverFromTableElement,
  TableCellNode,
  TableObserver,
  TableSelection,
} from '@lexical/table';
import { mergeRegister } from '@lexical/utils';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  getDOMSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { ReactPortal, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import invariant from '../../utils/invariant';
import { Button, Dropdown } from 'antd';
import { ChevronDown } from 'lucide-react';

function computeSelectionCount(selection: TableSelection): {
  columns: number;
  rows: number;
} {
  const selectionShape = selection.getShape();
  return {
    columns: selectionShape.toX - selectionShape.fromX + 1,
    rows: selectionShape.toY - selectionShape.fromY + 1,
  };
}

function TableCellActionMenuContainer({
  anchorElem,
  cellMerge,
}: {
  anchorElem: HTMLElement;
  cellMerge: boolean;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const menuButtonRef = useRef<HTMLDivElement | null>(null);

  const [tableCellNode, setTableMenuCellNode] = useState<TableCellNode | null>(
    null,
  );

  const $moveMenu = useCallback(() => {
    const menu = menuButtonRef.current;
    const selection = $getSelection();
    const nativeSelection = getDOMSelection(editor._window);
    const activeElement = document.activeElement;
    function disable() {
      if (menu) {
        menu.classList.remove('table-cell-action-button-container--active');
        menu.classList.add('table-cell-action-button-container--inactive');
      }
      setTableMenuCellNode(null);
    }

    if (!selection || !menu) {
      return disable();
    }

    const rootElement = editor.getRootElement();
    let tableObserver: TableObserver | null = null;
    let tableCellParentNodeDOM: HTMLElement | null = null;

    if (
      $isRangeSelection(selection) &&
      rootElement !== null &&
      nativeSelection !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );

      if (!tableCellNodeFromSelection) {
        return disable();
      }

      tableCellParentNodeDOM = editor.getElementByKey(
        tableCellNodeFromSelection.getKey(),
      );

      if (
        !tableCellParentNodeDOM ||
        !tableCellNodeFromSelection.isAttached()
      ) {
        return disable();
      }

      const tableNode = $getTableNodeFromLexicalNodeOrThrow(
        tableCellNodeFromSelection,
      );
      const tableElement = getTableElement(
        tableNode,
        editor.getElementByKey(tableNode.getKey()),
      );

      invariant(
        tableElement !== null,
        'TableActionMenu: Expected to find tableElement in DOM',
      );

      tableObserver = getTableObserverFromTableElement(tableElement);
      setTableMenuCellNode(tableCellNodeFromSelection);
    } else if ($isTableSelection(selection)) {
      const anchorNode = $getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );
      invariant(
        $isTableCellNode(anchorNode),
        'TableSelection anchorNode must be a TableCellNode',
      );
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(anchorNode);
      const tableElement = getTableElement(
        tableNode,
        editor.getElementByKey(tableNode.getKey()),
      );
      invariant(
        tableElement !== null,
        'TableActionMenu: Expected to find tableElement in DOM',
      );
      tableObserver = getTableObserverFromTableElement(tableElement);
      tableCellParentNodeDOM = editor.getElementByKey(anchorNode.getKey());
    } else if (!activeElement) {
      return disable();
    }
    if (tableObserver === null || tableCellParentNodeDOM === null) {
      return disable();
    }
    const enabled = !tableObserver || !tableObserver.isSelecting;
    menu.classList.toggle(
      'table-cell-action-button-container--active',
      enabled,
    );
    menu.classList.toggle(
      'table-cell-action-button-container--inactive',
      !enabled,
    );
    if (enabled) {
      const tableCellRect = tableCellParentNodeDOM.getBoundingClientRect();
      const anchorRect = anchorElem.getBoundingClientRect();
      const top = tableCellRect.top - anchorRect.top + 10;
      const left = tableCellRect.right - anchorRect.left - 20;
      menu.style.transform = `translate(${left}px, ${top}px)`;
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    // We call the $moveMenu callback every time the selection changes,
    // once up front, and once after each mouseUp
    let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
    const callback = () => {
      timeoutId = undefined;
      editor.getEditorState().read($moveMenu);
    };
    const delayedCallback = () => {
      if (timeoutId === undefined) {
        timeoutId = setTimeout(callback, 0);
      }
      return false;
    };
    return mergeRegister(
      editor.registerUpdateListener(delayedCallback),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        delayedCallback,
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerRootListener((rootElement, prevRootElement) => {
        if (prevRootElement) {
          prevRootElement.removeEventListener('mouseup', delayedCallback);
        }
        if (rootElement) {
          rootElement.addEventListener('mouseup', delayedCallback);
          delayedCallback();
        }
      }),
      () => clearTimeout(timeoutId),
    );
  });

  const prevTableCellDOM = useRef(tableCellNode);

  useEffect(() => {
    prevTableCellDOM.current = tableCellNode;
  }, [prevTableCellDOM, tableCellNode]);

  const [selectionCounts, updateSelectionCounts] = useState({
    columns: 1,
    rows: 1,
  });

  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      // Merge cells
      if ($isTableSelection(selection)) {
        const currentSelectionCounts = computeSelectionCount(selection);
        updateSelectionCounts(currentSelectionCounts);
      }
    });
  }, [editor]);

  const insertTableRowAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        $insertTableRow__EXPERIMENTAL(shouldInsertAfter);
      });
    },
    [editor],
  );

  const insertTableColumnAtSelection = useCallback(
    (shouldInsertAfter: boolean) => {
      editor.update(() => {
        for (let i = 0; i < selectionCounts.columns; i++) {
          $insertTableColumn__EXPERIMENTAL(shouldInsertAfter);
        }
      });
    },
    [editor, selectionCounts.columns],
  );

  const deleteTableColumnAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableColumn__EXPERIMENTAL();
    });
  }, [editor]);

  const deleteTableRowAtSelection = useCallback(() => {
    editor.update(() => {
      $deleteTableRow__EXPERIMENTAL();
    });
  }, [editor]);

  const clearTableSelection = useCallback(() => {
    editor.update(() => {
      if (tableCellNode!.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode!);
        const tableElement = getTableElement(
          tableNode,
          editor.getElementByKey(tableNode.getKey()),
        );

        invariant(
          tableElement !== null,
          'TableActionMenu: Expected to find tableElement in DOM',
        );

        const tableObserver = getTableObserverFromTableElement(tableElement);
        if (tableObserver !== null) {
          tableObserver.$clearHighlight();
        }

        tableNode.markDirty();
      }

      const rootNode = $getRoot();
      rootNode.selectStart();
    });
  }, [editor, tableCellNode]);

  const deleteTableAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode!);
      tableNode.remove();

      clearTableSelection();
    });
  }, [editor, tableCellNode, clearTableSelection]);

  return (
    <div className="table-cell-action-button-container" ref={menuButtonRef}>
      {!!tableCellNode && (
        <>
          <Dropdown trigger={['click']} overlayClassName='max-h-96 overflow-y-auto' menu={{
            items: [
              {
                key: 'table-insert-row-above',
                label: '在上添加一行',
                onClick: () => insertTableRowAtSelection(false)
              },
              {
                key: 'table-insert-row-below',
                label: '在下添加一行',
                onClick: () => insertTableRowAtSelection(true)
              },
              {
                type: 'divider'
              },
              {
                key: 'table-insert-column-before',
                label: '在左添加一列',
                onClick: () => insertTableColumnAtSelection(false)
              },
              {
                key: 'table-insert-column-after',
                label: '在右添加一列',
                onClick: () => insertTableColumnAtSelection(true)
              },
              {
                type: 'divider'
              },
              {
                key: 'table-delete-columns',
                label: '删除列',
                onClick: () => deleteTableColumnAtSelection()
              },
              {
                key: 'table-delete-rows',
                label: '删除行',
                onClick: () => deleteTableRowAtSelection()
              }, {
                key: 'table-delete',
                label: '删除表格',
                onClick: () => deleteTableAtSelection()
              },
            ]
          }}>
            <Button size='small' variant='filled' color='default' className='p-0 w-4 h-4'>
              <ChevronDown size={16} />
            </Button>
          </Dropdown>
        </>
      )}
    </div>
  );
}

export default function TableActionMenuPlugin({
  anchorElem = document.body,
  cellMerge = false,
}: {
  anchorElem?: HTMLElement;
  cellMerge?: boolean;
}): null | ReactPortal {
  const isEditable = useLexicalEditable();
  return createPortal(
    isEditable ? (
      <TableCellActionMenuContainer
        anchorElem={anchorElem}
        cellMerge={cellMerge}
      />
    ) : null,
    anchorElem,
  );
}
