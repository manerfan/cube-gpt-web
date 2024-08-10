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

import { getPathAndModule } from '@/services/common';
import { history, useLocation } from '@umijs/max';
import { Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import StickyBox from 'react-sticky-box';

const TabHeader: React.FC<{
  items: TabsProps['items'],
  tabBarRender?: boolean,
  tabBarExtraContent?: Partial<Record<'left' | 'right', React.ReactNode>>
}> = ({items, tabBarRender, tabBarExtraContent}) => {
  const location = useLocation();

  // 选择的菜单KEY
  const [activeKey, setActiveKey] = useState<string | undefined>();

  useEffect(() => {
    const [path, module] = getPathAndModule(location.pathname);
    if (path && module) {
      setActiveKey(module);
    }
  }, [location.pathname]);

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <StickyBox style={{ zIndex: 1 }}>
      <DefaultTabBar
        {...props}
        style={{
          background: 'rgb(245, 245, 245, .2)',
          backdropFilter: 'blur(5px)',
          padding: '.6rem 0',
        }}
      />
    </StickyBox>
  );
  return (
    <>
      <Tabs
        centered
        size="large"
        activeKey={activeKey}
        onChange={(activeKey: string) => {
          setActiveKey(activeKey);
          const [path] = getPathAndModule(location.pathname);
          history.push(`${path}/${activeKey}`);
        }}
        renderTabBar={!!tabBarRender ? renderTabBar : undefined}
        tabBarExtraContent={tabBarExtraContent}
        items={items}
      />
    </>
  );
};

export default TabHeader;
