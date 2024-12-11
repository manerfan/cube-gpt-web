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

/**
 * 彩虹色条背景
 */
const BackgroundBanderole: React.FC = () => {
  return (
    <div className="absolute z-1 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none">
        <div className="flex-none flex justify-end">
          <picture>
            <source
              srcSet="/bg/top_bg.avif"
              type="image/avif"
              className="flex-none max-w-none"
            />
            <img
              src="/bg/top_bg.png"
              alt=""
              className="flex-none max-w-none"
              decoding="async"
            />
          </picture>
        </div>
      </div>
  );
};

export default BackgroundBanderole;