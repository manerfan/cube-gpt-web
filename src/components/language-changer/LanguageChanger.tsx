/**
 * Copyright 2023 Maner·Fan
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

'use client';

import { Button } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { useState } from 'react';
import { getLocale, setLocale } from 'umi';

import styles from './styles.module.scss';

const LanguageChanger: React.FC<{
  size?: SizeType;
  className?: string;
}> = ({
  size,
  className,
}) => {
  const [language, setLanguage] = useState(getLocale());

  const handleChange = () => {
    const l = language === 'en-US' ? 'zh-CN' : 'en-US';
    setLanguage(l);
    setLocale(l, false);
  };

  return (
    <Button
      type="link"
      size={size}
      className={`${styles['acss-btn']} ${className || ''}`}
      onClick={handleChange}
    >
      <div className={styles['btn-inner']}>
        <div className={styles['acss-inner']}>
          <span
            className={
              language === 'zh-CN'
                ? styles['acss-active']
                : styles['acss-disactive']
            }
          >
            中
          </span>
          <span
            className={
              language === 'zh-CN'
                ? styles['acss-disactive']
                : styles['acss-active']
            }
          >
            En
          </span>
        </div>
      </div>
    </Button>
  );
}

export default LanguageChanger;