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

import { Avatar, Result } from 'antd';
import LdsRipple from './components/loading/LdsRipple';

const Loading: React.FC = () => {
  return (
    <>
      <main className="min-h-screen place-items-center grid">
        <Result
          icon={
            <Avatar
              src={<img src={'/logo.png'} alt="MODU 墨读无界" />}
              size={100}
              shape="square"
            />
          }
          title="想你所想 及你所及"
          extra={ <LdsRipple /> }
        />
      </main>
    </>
  );
};

export default Loading;
