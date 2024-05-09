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

import { Hero, HeroProps } from '@lobehub/ui';
import { useIntl } from '@umijs/max';
import { CSSProperties } from 'react';
import LogoSlogan from './LogoSlogan';
import IdeaSlogan from './IdeaSlogan';

const LogoInfo: React.FC<{
  className?: string | undefined;
  style?: CSSProperties | undefined;
}> = ({ className, style }) => {
  const intl = useIntl();

  const actions: HeroProps['actions'] = [
    {
      icon: 'Github',
      link: 'https://github.com/manerfan',
      text: 'Github',
    },
    {
      link: '/cube/chat',
      text: intl.formatMessage({ id: 'home.header.start' }),
      type: 'primary',
    },
  ];

  return (
    <>
      <div
        className={`relative grid place-items-center z-10
      before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] before:lg:h-[360px]
      after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] ${
        className || ''
      }`}
        style={style || {}}
      >
        <Hero actions={actions} title="<b>. CUBE</b> CHAT" />

        <LogoSlogan />
        <IdeaSlogan className="mt-4 underline decoration-4 decoration-sky-200"/>
      </div>
    </>
  );
};

export default LogoInfo;
