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

import { Editor, rootCtx, editorViewOptionsCtx, defaultValueCtx, editorViewCtx, parserCtx } from '@milkdown/kit/core';
import { Slice } from "prosemirror-model";
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/react';
import { commonmark, paragraphSchema } from '@milkdown/kit/preset/commonmark';
import { gfm } from '@milkdown/kit/preset/gfm';
import { clipboard } from '@milkdown/kit/plugin/clipboard';
import { math, katexOptionsCtx } from '@milkdown/plugin-math';
import { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
import { placeholderCtx, placeholder } from '@/components/markdown/milkdown/plugin/placeholder';
import { codeBlockComponent, codeBlockConfig } from '@milkdown/kit/component/code-block';
import { languages } from '@codemirror/language-data';
import { basicSetup } from 'codemirror';
import { defaultKeymap } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { usePluginViewFactory } from '@prosemirror-adapter/react';
import React, { useEffect, useState } from 'react';
import { EditorView } from '@milkdown/prose/view';

/**
 * 需要保证该组件无状态
 */
const MilkdownTextarea: React.FC<{
    placeholder?: string,
    readOnly?: boolean,
    defaultValue?: string,
    value?: string,
    onChange?: (value: string, preValue: string) => void,
    onKeyDown?: (event: KeyboardEvent) => void,
}> = ({ placeholder: placeholderContent, readOnly, defaultValue, value, onChange, onKeyDown }) => {
    const [markdownContent, setMarkdownContent] = useState<string>();
    const pluginViewFactory = usePluginViewFactory();

    // https://milkdown.dev/docs/recipes/react
    const { get } = useEditor((root) =>
        Editor.make()
            .config(nord)
            .config((ctx) => {
                ctx.set(rootCtx, root);

                // 默认内容
                ctx.set(defaultValueCtx, defaultValue || '')

                // placehoder
                ctx.set(placeholderCtx, placeholderContent || '请输入内容')

                // 设置是否允许编辑
                ctx.update(editorViewOptionsCtx, (prev) => ({ ...prev, editable: () => !readOnly }))

                // math(latex)配置
                // https://katex.org/docs/options.html
                ctx.set(katexOptionsCtx.key, {});

                ctx.update(codeBlockConfig.key, defaultConfig => ({
                    ...defaultConfig,
                    languages,
                    extensions: [basicSetup, keymap.of(defaultKeymap)],
                    expandIcon: () => '▼',
                    searchIcon: () => '',
                    clearSearchIcon: () => 'x',
                    renderLanguage: (language, selected) => {
                        return `${language} ${selected ? " ◉" : ''}`
                    },
                }))

                // ctx.set(tooltip.key, {
                //     view: pluginViewFactory({
                //         component: TooltipView,
                //     })
                // })

                // 监听 markdown 更新
                const listener = ctx.get(listenerCtx);
                listener.updated((ctx, doc, preDoc) => {
                    const lastNode = doc.lastChild;

                    console.log(doc)

                    // 检查是否在代码块结束时
                    if (lastNode && lastNode.type.name === 'code_block') {
                        const editorView = ctx.get(editorViewCtx);
                        const { state, dispatch } = editorView;
                        const { tr } = state;
                        // 插入一个空行
                        tr.insert(tr.doc.content.size, state.schema.node('paragraph'));
                        dispatch(tr);
                    }

                    // 检查是否在math_block结束时 (暂不支持)
                    if (lastNode && lastNode.type.name === 'math_block') {
                        const editorView = ctx.get(editorViewCtx);
                        const { state, dispatch } = editorView;
                        const { tr } = state;
                        // 删除这个 math_block
                        const pos = doc.content.size - lastNode.nodeSize;
                        const transaction = tr.delete(pos, pos + lastNode.nodeSize);
                        dispatch(transaction);
                    }
                });
                listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
                    if (markdown === prevMarkdown) {
                        return;
                    }

                    setMarkdownContent(markdown);
                    onChange?.(markdown, prevMarkdown);
                })
            })
            // https://commonmark.org/
            .use(commonmark)
            // https://github.github.com/gfm/
            .use(gfm)
            // https://milkdown.dev/docs/api/plugin-clipboard
            .use(clipboard)
            // https://github.com/HexMox/milkdown-plugin-placeholder
            .use(placeholder)
            // https://milkdown.dev/docs/api/plugin-listener
            .use(listener)
            // https://milkdown.dev/docs/api/plugin-tooltip
            // .use(tooltip)
            // https://milkdown.dev/docs/api/plugin-math
            .use(math)
            .use(codeBlockComponent)

    );

    useEffect(() => {
        // 更新milkdown内容 https://github.com/Milkdown/milkdown/issues/127
        get()?.action((ctx) => {
            if (value === markdownContent) {
                return;
            }

            const view: EditorView = ctx.get(editorViewCtx);
            const parser = ctx.get(parserCtx);
            const doc = parser(value || '');
            if (!doc) {
                return;
            }

            const state = view.state;
            view.dispatch(
                state.tr.replace(
                    0,
                    state.doc.content.size,
                    new Slice(doc.content, 0, 0)
                )
            );
        })
    }, [value]);

    useEffect(() => {
        // 更新milkdown只读 https://milkdown.dev/docs/guide/interacting-with-editor#readonly-mode
        get()?.action((ctx) => {
            ctx.update(editorViewOptionsCtx, (prev) => ({ ...prev, editable: () => !readOnly }))
        })
    }, [readOnly]);

    useEffect(() => {
        // 注册 keyDown 事件
        if (!onKeyDown) {
            return;
        }

        let view: EditorView;

        get()?.action((ctx) => {
            view = ctx.get(editorViewCtx);
            view.dom.addEventListener('keydown', onKeyDown);
        })

        return () => {
            if (view) {
                view.dom.removeEventListener('keydown', onKeyDown);
            }
        };
    }, [onKeyDown]);

    return <Milkdown />;
}

export default MilkdownTextarea;