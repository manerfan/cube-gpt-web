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

import { CSSProperties } from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import styles from './styles.module.scss';

import Markdown from 'react-markdown';
import CodeComponent from './CodeComponent';

const ChatMarkdown: React.FC<{
  children?: string;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ children, className, style }) => {
  return (
    <>
      <div className={`${className} ${styles['markdown']}`} style={style}>
        <Markdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkToc]}
          components={{
            code: CodeComponent,
          }}
        >
          {children}
        </Markdown>
      </div>
    </>
  );
};

export default ChatMarkdown;
