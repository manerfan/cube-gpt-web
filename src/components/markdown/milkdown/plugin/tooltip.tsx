
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

import { Ctx } from "@milkdown/kit/ctx"
import { tooltipFactory, TooltipProvider } from "@milkdown/kit/plugin/tooltip"
import { useInstance } from '@milkdown/react'
import { usePluginViewContext } from "@prosemirror-adapter/react"
import { useCallback, useEffect, useRef } from "react"
import { Button, Input, InputRef, Space } from "antd"
import { parserCtx } from "@milkdown/kit/core"
import { Slice } from "prosemirror-model"
import _ from "lodash"

export const tooltip = tooltipFactory('Text');

export const TooltipView = () => {
    const refTooltip = useRef<HTMLDivElement>(null);
    const refMathInline = useRef<InputRef>(null);
    const tooltipProvider = useRef<TooltipProvider>();

    const { view, prevState } = usePluginViewContext()
    const { state, dispatch } = view;
    console.log(state.selection)

    const [loading, get] = useInstance()
    const action = useCallback((fn: (ctx: Ctx) => void) => {
        if (loading) return;
        get().action(fn)
    }, [loading]);

    let parser: Parser;
    action((ctx) => {
        parser = ctx.get(parserCtx);
    });

    const hideTooltip = () => {
        refTooltip?.current?.setAttribute('data-show', 'false')
    }

    useEffect(() => {
        const div = refTooltip.current
        if (loading || !div) {
            return;
        }
        tooltipProvider.current = new TooltipProvider({
            content: div,
        })

        return () => {
            tooltipProvider.current?.destroy()
        }
    }, [loading])

    useEffect(() => {
        tooltipProvider.current?.update(view, prevState)
    })

    return (
        <div className="absolute data-[show=false]:hidden" ref={refTooltip}>
            {
                // 内敛 latex
                state.selection.node?.type?.name === "math_inline" && (
                    <Space.Compact style={{ width: '100%' }}>
                        <Input ref={refMathInline} defaultValue={state.selection.node?.content?.content?.[0]?.text} />
                        <Button type="primary" onClick={(e) => {
                            e.preventDefault();
                            const latexContent = refMathInline?.current?.input?.value

                            const doc = _.isEmpty(latexContent) ? parser('') : parser(`$${latexContent}$` || '');
                            // parse后会被 p 包裹
                            console.log(doc)
                            console.log(state)
                                
                            // 直接 replace UI 不会更新，很奇怪，这里插入后删除
                            const to = state.selection.ranges[0].$to.pos
                            dispatch(
                                state.tr.replaceSelectionWith(state.schema.text("a")).insert(to, doc.content.content[0].content)
                            );

                            hideTooltip();
                        }}>修改</Button>
                    </Space.Compact>
                )
            }
        </div>
    )
}
