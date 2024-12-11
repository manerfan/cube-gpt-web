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

import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';

import theme from './themes/lexical-theme-default';

import { $convertFromMarkdownString, } from '@lexical/markdown';
import { TRANSFORMERS } from './plugins/ExtTransformers';
import { ToolbarContext } from './context/ToolbarContext';
import { SharedHistoryContext } from './context/SharedHistoryContext';
import { TableContext } from './plugins/TablePlugin';
import LexicalInnerEditor, { LexicalInnerEditorRefProperty } from './lexical-editor';
import nodes from './nodes';
import {
    CLEAR_EDITOR_COMMAND,
    CLEAR_HISTORY_COMMAND,
} from 'lexical';

export interface LexicalTextareaRefProperty {
    clearEditor: () => void;
    getMarkdownContent: () => string;
}


/**
 * 需要保证该组件无状态
 */
const LexicalTextarea: React.FC<{
    placeholder?: string,
    readOnly?: boolean,
    defaultValue?: string,
    showToolbar?: boolean,
    onChange?: (markdown: string) => void,
}> = forwardRef(({ placeholder, readOnly, defaultValue, showToolbar, onChange }, ref) => {
    const lexicalInnerEditorPopoverRef = useRef<LexicalInnerEditorRefProperty>();

    useImperativeHandle(ref, () => ({
        clearEditor() {
            const editor = lexicalInnerEditorPopoverRef.current?.getEditor()
            editor?.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            editor?.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        },
        getMarkdownContent() {
            return lexicalInnerEditorPopoverRef.current?.getMarkdownContent();
        }
    }));

    useEffect(() => {
        const editor = lexicalInnerEditorPopoverRef?.current?.getEditor();
        editor?.setEditable(!readOnly);
        if (!readOnly) {
            editor?.focus(
                () => {
                  // See AutoFocusPlugin
                  // If we try and move selection to the same point with setBaseAndExtent, it won't
                  // trigger a re-focus on the element. So in the case this occurs, we'll need to correct it.
                  // Normally this is fine, Selection API !== Focus API, but fore the intents of the naming
                  // of this plugin, which should preserve focus too.
                  const activeElement = document.activeElement;
                  const rootElement = editor.getRootElement() as HTMLDivElement;
                  if (
                    rootElement !== null &&
                    (activeElement === null || !rootElement.contains(activeElement))
                  ) {
                    // Note: preventScroll won't work in Webkit.
                    rootElement.focus({preventScroll: true});
                  }
                },
                {defaultSelection: 'rootStart'}
              );
        }
    }, [readOnly]);

    return <div className='lexical'>
        <LexicalComposer initialConfig={
            {
                namespace: 'MarkdownEditor',
                theme: theme,
                nodes: nodes,
                onError: (error) => {
                    throw error;
                },
                editorState: () => {
                    return $convertFromMarkdownString(defaultValue || '', TRANSFORMERS);
                },
                editable: !readOnly,
            }
        }>
            <SharedHistoryContext>
                <TableContext>
                    <ToolbarContext>
                        <LexicalInnerEditor
                            ref={lexicalInnerEditorPopoverRef}
                            placeholder={placeholder}
                            showToolbar={showToolbar}
                            onChange={onChange} />
                    </ToolbarContext>
                </TableContext>
            </SharedHistoryContext>
        </LexicalComposer>
    </div>
});

export default LexicalTextarea;