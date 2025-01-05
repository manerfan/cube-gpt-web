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

import TabHeader from "@/components/common/TabHeader";
import { SmileOutlined } from "@ant-design/icons";
import { Result, TabsProps } from "antd";
import { Typography } from "antd";
import FavoriteBots from "./FavoriteBots";

const UserFavorite: React.FC = () => {
  // tab内容
  const items: TabsProps['items'] = [
    {
      key: 'bots',
      label: <Typography.Text>智能体</Typography.Text>,
      children: <FavoriteBots />,
    },
    {
      key: 'plugins',
      label: <Typography.Text>插件</Typography.Text>,
      children: <Result
        icon={<SmileOutlined />}
        title="插件正在建设中，敬请期待..."
      />,
    },
  ]

  return <TabHeader
    type='card'
    className="w-full mt-6"
    contentNoPpadding
    items={items}
    defaultActiveKey='bots'
  />;
}

export default UserFavorite;
