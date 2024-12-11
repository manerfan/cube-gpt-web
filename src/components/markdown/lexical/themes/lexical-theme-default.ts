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

export default {
  autocomplete: 'autocomplete',
  blockCursor: 'blockCursor',
  characterLimit: 'characterLimit',
  code: 'code',
  codeHighlight: {
    atrule: 'tokenAttr',
    attr: 'tokenAttr',
    boolean: 'tokenProperty',
    builtin: 'tokenSelector',
    cdata: 'tokenComment',
    char: 'tokenSelector',
    class: 'tokenFunction',
    'class-name': 'tokenFunction',
    comment: 'tokenComment',
    constant: 'tokenProperty',
    deleted: 'tokenProperty',
    doctype: 'tokenComment',
    entity: 'tokenOperator',
    function: 'tokenFunction',
    important: 'tokenVariable',
    inserted: 'tokenSelector',
    keyword: 'tokenAttr',
    namespace: 'tokenVariable',
    number: 'tokenProperty',
    operator: 'tokenOperator',
    prolog: 'tokenComment',
    property: 'tokenProperty',
    punctuation: 'tokenPunctuation',
    regex: 'tokenVariable',
    selector: 'tokenSelector',
    string: 'tokenSelector',
    symbol: 'tokenProperty',
    tag: 'tokenProperty',
    url: 'tokenOperator',
    variable: 'tokenVariable',
  },
  embedBlock: {
    base: 'embedBlock',
    focus: 'embedBlockFocus',
  },
  hashtag: 'hashtag',
  heading: {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
  },
  hr: 'hr',
  image: 'editor-image',
  indent: 'indent',
  inlineImage: 'inline-editor-image',
  layoutContainer: 'layoutContainer',
  layoutItem: 'layoutItem',
  link: 'link',
  list: {
    checklist: 'checklist',
    listitem: 'listItem',
    listitemChecked: 'listItemChecked',
    listitemUnchecked: 'listItemUnchecked',
    nested: {
      listitem: 'nestedListItem',
    },
    olDepth: [
      'ol1',
      'ol2',
      'ol3',
      'ol4',
      'ol5',
    ],
    ul: 'ul',
  },
  ltr: 'ltr',
  mark: 'mark',
  markOverlap: 'markOverlap',
  paragraph: 'paragraph',
  quote: 'quote',
  rtl: 'rtl',
  specialText: 'specialText',
  table: 'table',
  tableCell: 'tableCell',
  tableCellActionButton: 'tableCellActionButton',
  tableCellActionButtonContainer:
    'tableCellActionButtonContainer',
  tableCellHeader: 'tableCellHeader',
  tableCellResizer: 'tableCellResizer',
  tableCellSelected: 'tableCellSelected',
  tableRowStriping: 'tableRowStriping',
  tableScrollableWrapper: 'tableScrollableWrapper',
  tableSelected: 'tableSelected',
  tableSelection: 'tableSelection',
  text: {
    bold: 'textBold',
    code: 'textCode',
    italic: 'textItalic',
    strikethrough: 'textStrikethrough',
    subscript: 'textSubscript',
    superscript: 'textSuperscript',
    underline: 'textUnderline',
    underlineStrikethrough: 'textUnderlineStrikethrough',
  },
};
