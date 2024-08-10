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

import { CopyOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import Mermaid from 'react-mermaid2';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark as codeTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

import _ from 'lodash';

const CodeComponent = (props: any) => {
  const { children, className, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  const content = String(children).replace(/\n$/, '');
  const language =
    !_.isEmpty(match) && match!.length > 1 && !_.isEmpty(match![1])
      ? match![1]
      : '';

  let codeComponent: React.ReactNode = <></>;
  switch (language) {
    case 'mermaid':
      // mermaid绘图
      codeComponent = <Mermaid chart={children} />;
      break;
    default:
      // 普通的代码
      codeComponent = (
        <>
          <Flex
            justify="space-between"
            align="center"
            style={{
              marginTop: '0.5em',
              padding: '0.5em 1em',
              backgroundColor: 'rgb(40, 44, 52)',
              borderTopLeftRadius: '0.3em',
              borderTopRightRadius: '0.3em',
              borderBottom: '1px solid rgb(75 85 99)',
            }}
          >
            <Typography.Text strong className="text-gray-200">
              {_.isEmpty(language) ? '' : 'language-' + language}
            </Typography.Text>
            <Typography.Text
              copyable={{
                text: content,
                icon: <CopyOutlined className="text-gray-200" />,
                tooltips: false,
              }}
            ></Typography.Text>
          </Flex>
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            language={language}
            style={codeTheme}
            showLineNumbers={true}
            customStyle={{
              'margin-top': '0',
              'border-top-right-radius': '0em',
              'border-top-left-radius': '0em',
              'border-bottom-right-radius': '0.3em',
              'border-bottom-left-radius': '0.3em',
            }}
          >
            {content}
          </SyntaxHighlighter>
        </>
      );
      break;
  }

  return match ? (
    codeComponent
  ) : (
    <code {...rest} className={`font-code ${className}`}>
      {children}
    </code>
  );
};

export default CodeComponent;
