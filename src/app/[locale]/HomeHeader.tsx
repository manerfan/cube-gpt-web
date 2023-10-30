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

import Image from "next/image";
import LanguageChanger from "../components/language-changer/LanguageChanger";

export default function HomeHeader({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
      <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
        <code className="font-mono font-bold">. CUBE CHAT</code>
        &nbsp;|&nbsp;
        <code className="font-mono">
          Speek <span className="font-bold">FREELY</span> with Me!
        </code>

        <LanguageChanger size="small" params={{ locale }} className="ml-3" />
      </p>
      <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
        <a
          className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
          href="https://github.com/manerfan"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            src="/logo.png"
            alt="CubeBit Logo"
            width={60}
            height={60}
            priority
          />
        </a>
      </div>
    </div>
  );
}
