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

import { Flex } from 'antd';
import { CSSProperties } from 'react';
import IdeaSlogan from './IdeaSlogan';
import LogoSlogan from './LogoSlogan';

const LogoInfoSimple: React.FC<{
  animated?: boolean;
  className?: string | undefined;
  style?: CSSProperties | undefined;
  children?: React.ReactNode;
}> = ({ animated, className, style, children }) => {
  return (
      <Flex
        vertical
        justify="center"
        align="center"
        className={className}
        style={style}
      >
        <span className="font-bold" style={{ fontSize: 70 }}>
          <b className={animated ? "text-animation" : "text-colorful"}>. MODU</b> 墨读
        </span>
        <span className="text-colorful font-bold" style={{ fontSize: 40 }}>
          /ˈmɔː.du/ 墨读无界
        </span>
        
        <div className='mt-8 mb-8'>
          {children && <>{children}</>}
        </div>

        <LogoSlogan />
        <IdeaSlogan className="mt-4 underline decoration-4 decoration-sky-200" />
      </Flex>
  );
};

export default LogoInfoSimple;
