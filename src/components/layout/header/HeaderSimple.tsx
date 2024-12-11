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

import { Link, useIntl } from '@umijs/max';
import { Button, Image, Space } from 'antd';
import { BookText, Github, MonitorSmartphone } from 'lucide-react';

const HeaderSimple: React.FC<{ className?: string }> = ({ className }) => {
  const intl = useIntl();

  return (
    <div
      className={`z-50 max-w-5xl w-full items-center justify-between text-sm lg:flex ${className}`}
    >
      <div className="fixed left-0 top-0 flex w-full justify-center items-center py-2 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:bg-opacity-10">
        <Space>
          <Link
            to="/login"
            className="pointer-events-none flex place-items-center gap-2 lg:pointer-events-auto"
          >
            <Image
              src="/logo.png"
              alt="ModuBit Logo"
              width={40}
              height={40}
              preview={false}
            />
          </Link>
          <Space className="text-base">
            <code className="font-bold">. MODU 墨读</code>
            <span>|</span>
            <code>
              墨读无界
            </code>
          </Space>

        </Space>
      </div>
      <div className="fixed bottom-0 left-0 flex h-16 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
        <Space className="text-base" size='small'>
          <Button type="link" className="text-inherit font-medium p-2" href="https://modubit.github.io/" target='_blank' icon={<BookText size={20} />}>Docs</Button>
          <Button type="link" className="text-inherit font-medium p-2" href="https://github.com/modubit" target='_blank' icon={<Github size={20} />}>GitHub</Button>
          <Button type="text" className="text-inherit font-medium p-2" icon={<MonitorSmartphone size={20} />}>
            <Link to="/modu/chat" className="font-bold">
              {intl.formatMessage({ id: 'home.header.start' })}
            </Link>
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default HeaderSimple;
