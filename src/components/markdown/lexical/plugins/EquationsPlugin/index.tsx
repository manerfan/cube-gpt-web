/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'katex/dist/katex.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';

import { $createEquationNode, EquationNode } from '../../nodes/EquationNode';
import { Button, Form, Input, Radio, Switch } from 'antd';
import KatexRenderer from '../../ui/KatexRenderer';
import { ErrorBoundary } from 'react-error-boundary';

type CommandPayload = {
  equation: string;
  inline: boolean;
};

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
  createCommand('INSERT_EQUATION_COMMAND');

export function InsertEquationDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState<string>('');
  const [inline, setInline] = useState<boolean>(true);

  const onRadiaoChange = useCallback((inline: boolean) => {
    setInline(inline);
  }, [setInline]);

  const onEquationConfirm = (equation: string, inline: boolean) => {
    activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
    onClose();
  }

  return <Form layout='vertical' className='mt-5'>
    <Form.Item>
      <Radio.Group defaultValue="inline" optionType="button" buttonStyle="solid" onChange={(e) => onRadiaoChange(e.target.value === 'inline')}>
        <Radio.Button value="inline">行内公式</Radio.Button>
        <Radio.Button value="block">公式块</Radio.Button>
      </Radio.Group>
    </Form.Item>
    <Form.Item>
      <Input.TextArea variant='filled' maxLength={512} value={equation} onChange={(e) => setEquation(e.target.value)} />
    </Form.Item>
    {equation &&
      <Form.Item>
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
          <KatexRenderer
            equation={equation}
            inline={inline}
            onDoubleClick={() => null}
          />
        </ErrorBoundary>
      </Form.Item>
    }
    <Form.Item>
      <Button type="primary" htmlType="submit" className='float-right' onClick={() => onEquationConfirm(equation, inline)}>
        插入
      </Button>
    </Form.Item>
  </Form>
}

export default function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor',
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const equationNode = $createEquationNode(equation, inline);

        $insertNodes([equationNode]);
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
