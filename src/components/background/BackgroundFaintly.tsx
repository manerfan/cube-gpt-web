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

const BackgroundFaintly: React.FC = () => {
  return (
    <section style={{ position: 'relative', flex: 1, maxWidth: '100%' }}>
      <div
        style={{
          backgroundImage:
            'linear-gradient( -45deg, #369eff, #95f3d9, #ffcb47, #e34ba9 )',
          backgroundSize: '400% 400%',
          borderRadius: 'inherit',
          animation: '5s animation-1gj30q7 5s ease infinite',
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 1,
          top: -100,
          left: '-20vw',
          transform: 'rotate(-4deg)',
          opacity: 0.2,
          width: '60vw',
          height: 200,
          filter: 'blur(100px)',
        }}
      ></div>
      <div
        style={{
          backgroundImage:
            'linear-gradient( -45deg, #ffcb47, #e34ba9, #369eff, #95f3d9 )',
          backgroundSize: '400% 400%',
          borderRadius: 'inherit',
          animation: '5s animation-1gj30q7 5s ease infinite',
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 1,
          top: -100,
          right: '-20vw',
          transform: 'rotate(4deg)',
          opacity: 0.2,
          width: '60vw',
          height: 200,
          filter: 'blur(100px)',
        }}
      ></div>
    </section>
  );
};

export default BackgroundFaintly;
