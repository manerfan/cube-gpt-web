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

export default function HomeInfo() {
  return (
      <div className="relative grid place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:lg:h-[360px] z-[-1]">
        <Image
          className="relative"
          src="/logo.png"
          alt="CubeBit Logo"
          width={180}
          height={180}
          priority
        />
        <span className="space-x-4 relative top-6">
          <code className="font-mono font-bold text-2xl">. CUBE CHAT</code>
          <span>|</span>
          <span className="font-mono">
            Speek <span className="font-bold">FREELY</span> with Me!
          </span>
        </span>
      </div>
  );
}
