/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import {
    COMMAND_PRIORITY_NORMAL,
    KEY_MODIFIER_COMMAND,
    LexicalEditor,
} from 'lexical';
import { useEffect } from 'react';


export default function KeyboardEventPlugin({
    editor,
    onKeyboardEvent
}: {
    editor: LexicalEditor;
    onKeyboardEvent: (event: KeyboardEvent) => boolean;
}): null {
    useEffect(() => {
        const keyboardShortcutsHandler = (payload: KeyboardEvent) => {
            return onKeyboardEvent(payload);
        };

        return editor.registerCommand(
            KEY_MODIFIER_COMMAND,
            keyboardShortcutsHandler,
            COMMAND_PRIORITY_NORMAL,
        );
    }, [editor,]);

    return null;
}
