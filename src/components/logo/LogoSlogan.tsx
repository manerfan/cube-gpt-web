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

const LogoSlogan: React.FC<{
  className?: string | undefined;
}> = ({ className }) => {
  return (
    <>
      <span
        className={`mt-6 place-items-center space-x-4 md:block ${
          className || ''
        }`}
      >
        <code className="font-mono font-bold text-2xl">. CUBE CHAT</code>
        <span>|</span>
        <span className="font-mono">
          Speak <span className="font-bold">FREELY</span> with Me!
        </span>
      </span>
    </>
  );
};

export default LogoSlogan;
