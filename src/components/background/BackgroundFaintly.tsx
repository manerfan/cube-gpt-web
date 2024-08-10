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

import styles from './styles.module.scss';

const BackgroundFaintly: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ position = 'top-right' }) => {
  return (
    <section style={{ position: 'relative', flex: 1, maxWidth: '100%' }}>
      <div
        className={`hidden ${styles.faintly} ${styles['faintly-left']}`}
        style={{
          backgroundImage:
            'linear-gradient( -45deg, #369eff, #95f3d9, #ffcb47, #e34ba9 )',
          top: -100,
          left: '-20vw',
          transform: 'rotate(-4deg)',
        }}
      ></div>
      <div className={`${styles.faintly} ${styles['faintly-' + position]}`}></div>
    </section>
  );
};

export default BackgroundFaintly;
