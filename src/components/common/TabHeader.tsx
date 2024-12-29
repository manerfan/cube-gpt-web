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
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { useState } from 'react';
import StickyBox from 'react-sticky-box';

const TabHeader: React.FC<{
  items: TabsProps['items'],
  centered?: boolean,
  size?: SizeType;
  sticky?: boolean,
  className?: string,
  contentNoPpadding?: boolean;
  locationUpdate?: boolean,
  tabBarRender?: boolean,
  defaultActiveKey?: string;
  tabBarExtraContent?: Partial<Record<'left' | 'right', React.ReactNode>>
}> = ({ items, centered, size, sticky, className, contentNoPpadding, locationUpdate, tabBarRender, defaultActiveKey, tabBarExtraContent }) => {
  const location = useLocation();

  // 选择的菜单KEY
  const [activeKey, setActiveKey] = useState<string | undefined>(defaultActiveKey);

  const tabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <DefaultTabBar
      {...props}
      style={{
        background: 'rgb(245, 245, 245, .2)',
        backdropFilter: 'blur(5px)',
        padding: '.6rem 0',
      }}
    />
  )

  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => {
    return sticky ? (
      <StickyBox style={{ zIndex: 1 }}>
        {tabBar(props, DefaultTabBar)}
      </StickyBox>
    ) : (
      tabBar(props, DefaultTabBar)
    )
  }


  return (
    <Tabs
      centered={centered}
      size={size || "large"}
      defaultActiveKey={defaultActiveKey}
      activeKey={activeKey}
      onChange={(activeKey: string) => {
        setActiveKey(activeKey);
        if (locationUpdate) {
          const [path] = getPathAndModule(location.pathname);
          history.push(`${path}/${activeKey}`);
        }
      }}
      renderTabBar={!!tabBarRender ? renderTabBar : undefined}
      tabBarExtraContent={tabBarExtraContent}
      items={items}
      className={`${className} ${contentNoPpadding ? 'ant-tabs-content-no-padding' : ''}`}
    />
  );
};

export default TabHeader;
