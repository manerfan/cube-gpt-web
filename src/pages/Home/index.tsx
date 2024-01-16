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

import BackgroundBanderole from '@/components/background/BackgroundBanderole';
import Footer from '@/components/footer/Footer';
import HeaderSimple from '@/components/header/HeaderSimple';
import LogoInfo from '@/components/logo/LogoInfo';
import { ThemeProvider } from '@lobehub/ui';

import { Features, FeaturesProps } from '@lobehub/ui';
import { Waypoints, MousePointerClick, Boxes} from 'lucide-react';

const items: FeaturesProps['items'] = [
  {
    description:
      'xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz.',
    icon:  Waypoints,
    title: '灵活开放',
  },
  {
    description:
      'xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx.',
    icon: MousePointerClick,
    title: '开箱即用',
  },
  {
    description:
      'xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz xxx yyy zzz.',
    icon: Boxes,
    title: '私有部署',
  },
];

const HomePage: React.FC = () => {
  return (
    <ThemeProvider>
      <BackgroundBanderole />
      
      <main className="flex relative flex-col h-full min-h-screen items-center justify-between p-5 sm:px-10 md:px-15 lg:px-24" style={{gridTemplateRows: 'auto 1fr auto'}}>
        <HeaderSimple />

        <LogoInfo className='mt-24 lg:mt-32 '/>

        <div className="mt-20 mb-16 md:mb-20">
          <Features items={items} />
        </div>

        <Footer className='py-4 grow-0 shrink-0 mb-36 lg:mb-2' />
      </main>
    </ThemeProvider>
  );
};

export default HomePage;
