/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './index.css';

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeFromDOMNode, $getNodeByKey } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { CopyButton } from './components/CopyButton';
import { canBePrettier, PrettierButton } from './components/PrettierButton';
import { useDebounce } from './utils';
import { Button, Dropdown, Flex, Space, Typography } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const CODE_PADDING = 8;

interface Position {
  top: string;
  right: string;
}

function CodeActionMenuContainer({
  anchorElem,
}: {
  anchorElem: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState('');
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: '0',
    top: '0',
  });
  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);

  function getCodeDOMNode(): HTMLElement | null {
    return codeDOMNodeRef.current;
  }

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

  const onCodeLanguageSelect = React.useCallback(
    (value: string) => {
      editor.update(() => {
        const codeNode = getCodeDOMNode();
        if (!!codeNode) {
          const node = $getNearestNodeFromDOMNode(codeNode);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
      setLang(value);
    },
    [editor],
  );

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });

      if (codeNode) {
        const { y: editorElemY, right: editorElemRight } =
          anchorElem.getBoundingClientRect();
        const { y, right } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        setPosition({
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        });
      }
    },
    50,
    1000,
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener('mousemove', debouncedOnMouseMove);

    return () => {
      setShown(false);
      debouncedOnMouseMove.cancel();
      document.removeEventListener('mousemove', debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case 'created':
                codeSetRef.current.add(key);
                break;

              case 'destroyed':
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false },
    );
  }, [editor]);

  const normalizedLang = normalizeCodeLang(lang);
  const codeFriendlyName = getLanguageFriendlyName(lang);

  return (
    <>
      {isShown ? (
        <div className="code-action-menu-container absolute flex" style={{ ...position }}>
          <Dropdown trigger={['click']} overlayClassName='max-h-96 overflow-y-auto'
            menu={{
              items: CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                return {
                  key: value,
                  label: (<Flex justify='space-between' align='center' className='w-48'>
                    <Typography.Text>{name}</Typography.Text>
                  </Flex>),
                  onClick: () => onCodeLanguageSelect(value),
                  style: value === lang ? { background: "rgba(0, 0, 0, 0.03)" } : {}
                }
              })
            }}>
            <Button type='text' size='small' variant='filled'>
              <Typography.Text className='text-[12px] text-gray-500'><Space size='small'>{codeFriendlyName}<DownOutlined /></Space></Typography.Text>
            </Button>
          </Dropdown>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
          {canBePrettier(normalizedLang) ? (
            <PrettierButton
              editor={editor}
              getCodeDOMNode={getCodeDOMNode}
              lang={normalizedLang}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function getMouseInfo(event: MouseEvent): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} {
  const target = event.target;

  if (target && target instanceof HTMLElement) {
    const codeDOMNode = target.closest<HTMLElement>(
      'code.code',
    );
    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>('div.code-action-menu-container') ||
      target.closest<HTMLElement>('div.ant-dropdown')
    );

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
}

export default function CodeActionMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem,
  );
}
