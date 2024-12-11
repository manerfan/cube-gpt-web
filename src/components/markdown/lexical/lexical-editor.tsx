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

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import type { EditorState, LexicalEditor } from 'lexical';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin';

import { $convertToMarkdownString } from '@lexical/markdown';
import { Typography } from 'antd';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ShortcutsPlugin from './plugins/ShortcutsPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { SelectionAlwaysOnDisplay } from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TRANSFORMERS } from './plugins/ExtTransformers';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { CAN_USE_DOM } from './utils/canUseDOM';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import TableActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableHoverActionsPlugin from './plugins/TableHoverActionsPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { useSharedHistoryContext } from './context/SharedHistoryContext';

export interface LexicalInnerEditorRefProperty {
    getEditor: () => LexicalEditor;
    getMarkdownContent: () => string;
}

/**
 * 需要保证该组件无状态
 */
const LexicalInnerEditor: React.FC<{
    placeholder?: string,
    showToolbar?: boolean,
    onChange?: (markdown: string) => void,
}> = forwardRef(({ placeholder, showToolbar = true, onChange }, ref) => {
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const [isSmallWidthViewport, setIsSmallWidthViewport] = useState<boolean>(false);
    const [editor] = useLexicalComposerContext();
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    const { historyState } = useSharedHistoryContext();

    const [markdown, setMarkdown] = useState<string>();

    useImperativeHandle(ref, () => ({
        getEditor() {
            return editor;
        },
        getMarkdownContent() {
            return markdown;
        }
    }));

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    useEffect(() => {
        const updateViewPortWidth = () => {
            const isNextSmallWidthViewport =
                CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

            if (isNextSmallWidthViewport !== isSmallWidthViewport) {
                setIsSmallWidthViewport(isNextSmallWidthViewport);
            }
        };
        updateViewPortWidth();
        window.addEventListener('resize', updateViewPortWidth);

        return () => {
            window.removeEventListener('resize', updateViewPortWidth);
        };
    }, [isSmallWidthViewport]);

    return <>
        {/* 工具栏 */}
        {showToolbar &&
            <ToolbarPlugin
                editor={editor}
                activeEditor={editor}
                setActiveEditor={() => { }}
                setIsLinkEditMode={setIsLinkEditMode}
            />
        }

        {/* 键盘事件监听 */}
        {/* <KeyboardEventPlugin editor={editor} onKeyboardEvent={(event: KeyboardEvent) => {
            const { code, metaKey, ctrlKey } = event;
            if (code === 'Enter' && (metaKey || ctrlKey)) {
                event.preventDefault();
                editor.getEditorState()?.read(() => {
                    const markdown = $convertToMarkdownString(TRANSFORMERS);
                    onSubmit?.(markdown);
                });
                return true;
            }

            return false;
        }} /> */}

        {/* 通用快捷键触发样式 */}
        <ShortcutsPlugin
            editor={editor}
            setIsLinkEditMode={setIsLinkEditMode}
        />

        {/* MARKDOWN快捷键触发样式 */}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

        {/* 代码语法高亮 */}
        <CodeHighlightPlugin />

        {/* 公式 */}
        <EquationsPlugin />

        {/* TAB键保留 */}
        <TabFocusPlugin />
        <TabIndentationPlugin />

        {/* 分隔 */}
        <HorizontalRulePlugin />

        {/* 列表 */}
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />

        {/* 待办列表 */}
        <CheckListPlugin />

        {/* 表格 */}
        <TablePlugin
            hasTabHandler={false}
            hasCellMerge={false}
            hasCellBackgroundColor={false}
            hasHorizontalScroll={true}
        />

        {/* 超链接 */}
        <AutoLinkPlugin />
        <LinkPlugin hasLinkAttributes={true} />

        {/* 自动聚焦 */}
        <AutoFocusPlugin />

        {/* 光标始终显示 */}
        <SelectionAlwaysOnDisplay />

        {/* 斜杠青年 */}
        <ComponentPickerPlugin trigger="/" />

        {floatingAnchorElem && !isSmallWidthViewport && (<>
            {/* 代码块工具 */}
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

            {/* 表格工具 */}
            <TableActionMenuPlugin
                anchorElem={floatingAnchorElem}
                cellMerge={false}
            />
            <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />

            {/* 超链接工具 */}
            {/* <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
            /> */}
        </>)}

        <div className='lexical-content relative' ref={onRef}>
            {/* 富文本 编辑器 */}
            <RichTextPlugin
                contentEditable={<ContentEditable
                    className="editor-input"
                    aria-placeholder={placeholder || '请输入内容'}
                    placeholder={<Typography.Text className="editor-placeholder text-zinc-300">{placeholder || '请输入内容'}</Typography.Text>}
                />}
                ErrorBoundary={LexicalErrorBoundary} />
            {/* 历史记录 */}
            <HistoryPlugin externalHistoryState={historyState} />
        </div>

        {/* 内容变更监听 */}
        <OnChangePlugin onChange={(editorState: EditorState) => {
            editorState.read(() => {
                const markdown = $convertToMarkdownString(TRANSFORMERS);
                setMarkdown(markdown);
                onChange?.(markdown);
            });
        }} />

        {/* 清除编辑器内容 */}
        <ClearEditorPlugin />
    </>
});

export default LexicalInnerEditor;