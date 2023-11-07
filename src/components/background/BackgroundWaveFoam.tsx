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

const BackgroundFoamAnimation: React.FC = () => {
  return (
    <div
      className="absolute z-1 w-full h-full place-items-center grid"
    >
      <div className="w-full h-full" style={{
        background: 'url(/loading/foam.svg) center center no-repeat',
        backgroundSize: 'cover',
      }}></div>
    </div>
  );
};

export default BackgroundFoamAnimation;
