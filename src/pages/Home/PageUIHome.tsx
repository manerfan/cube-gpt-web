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

import BackgroundBanderole from "@/components/background/BackgroundBanderole";
import HeaderSimple from "@/components/header/HeaderSimple";
import { ThemeProvider } from "@lobehub/ui";
import { LandingMarquee } from '@/components/landing/LandingMarquee';
import { ByteDance, Cohere, Moonshot, Ollama, OpenAI, Zhipu, Anthropic, Qwen, Claude } from "@lobehub/icons";
import styles from './styles.module.scss';


const PageUIHome: React.FC = () => {
    return (
        <ThemeProvider>
            <BackgroundBanderole />

            <main
                className="flex relative flex-col h-full min-h-screen items-center justify-between p-5 sm:px-10 md:px-15 lg:px-24"
                style={{ gridTemplateRows: 'auto 1fr auto' }}
            >
                <HeaderSimple />

                <LandingMarquee className={`${styles['landing']} ${styles['marquee']}`}>
                    <OpenAI size={64} />
                    <Ollama size={64} />
                    <Cohere size={64} />
                    <Anthropic size={64} />
                    <Claude size={64} />
                    <Zhipu size={64} />
                    <Moonshot size={64} />
                    <ByteDance size={64} />
                    <Qwen size={64} />
                </LandingMarquee>
            </main>
        </ThemeProvider>
    )
}

export default PageUIHome;